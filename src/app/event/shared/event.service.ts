import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap, switchMap } from 'rxjs/operators';

import { AdService } from 'src/app/ad/shared/ad.service';
import { AppHelper } from 'src/app/@shared/app-helper';
import { C } from 'src/app/@shared/constants';
import { LikeService } from 'src/app/like/shared/like.service';
import { LocationService } from 'src/app/location/shared/location.service';
import { EventModel, EventSource } from './event.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { TagSource, TagModel } from 'src/app/event/shared/tag.model';

export interface Events extends ProtoItems {
  items: EventModel[],
}

interface EventsByIdStore {
  [key: string]: EventModel,
}

interface EventsById {
  [key: string]: BehaviorSubject<EventModel>,
}

const PREVIEW_LIMIT = 3;
const DEFAULT_LIMIT = 25;
const DEFAUL_WHERE_FILTER = {};
const DEFAULT_ORDER_BY = 'createdAt DESC';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private whereFilter: any = DEFAUL_WHERE_FILTER;
  private orderBy = DEFAULT_ORDER_BY;
  private search: { [key: string]: string } = {};
  private eventsStore: Events = null;
  private events: BehaviorSubject<Events> = new BehaviorSubject(null);
  private eventsByIdStore: EventsByIdStore = {};
  private eventsById: EventsById = {};
  private tagsStore: TagModel[];
  private tags: BehaviorSubject<TagModel[]> = new BehaviorSubject(null);
  private highlightedEventsStore: EventModel[];
  private highlightedEvents: BehaviorSubject<EventModel[]>;

  constructor(
    private adService: AdService,
    private http: HttpClient,
    private likeService: LikeService,
    private locationService: LocationService,
  ) { }

  public setFilter(whereFilter: any = DEFAUL_WHERE_FILTER, orderBy: string = DEFAULT_ORDER_BY) {
    this.whereFilter = whereFilter;
    this.orderBy = orderBy;

    this.updateFilter();
  }

  public resetFilter() {
    this.whereFilter = DEFAUL_WHERE_FILTER;
    this.orderBy = DEFAULT_ORDER_BY;

    this.updateFilter();
  }

  public getDefaultWhereFilter(): any {
    return DEFAUL_WHERE_FILTER;
  }

  public getDefaultOrderBy(): string {
    return DEFAULT_ORDER_BY;
  }

  public searchEvents(search: { [key: string]: any }) {
    this.updateSearch(search);
  }

  public clearSearch() {
    this.updateSearch({});
  }

  public getEventById(eventId: string): Observable<EventModel> {
    if (this.eventsById[eventId]) {
      return this.eventsById[eventId].asObservable();
    }

    return this.loadEventById(eventId).pipe(mergeMap(() => {
      return this.eventsById[eventId].asObservable();
    }));
  }

  public getHighlightedEvents(): Observable<EventModel[]> {
    if (this.highlightedEvents) {
      return this.highlightedEvents.asObservable();
    }

    return this.loadHighlightedEvents().pipe(mergeMap(() => {
      return this.highlightedEvents.asObservable();
    }));
  }

  public refreshEventById(eventId: string) {
    this.loadEventById(eventId).toPromise().catch((error) => {
      console.error(`Error refreshing event ${eventId}`);
      console.error(error);
    });
  }

  public getEvents(): Observable<Events> {
    this.eventsStore = { items: [], meta: { isFirstLoad: true, isLoading: true, filterIsActive: AppHelper.isEmptyObject(this.whereFilter), whereFilter: this.whereFilter, orderBy: this.orderBy } };
    this.events.next(this.eventsStore);

    this.loadEvents().catch((error) => {
      this.eventsStore.meta.error = error;
      this.eventsStore.meta.isLoading = false;

      this.events.next(this.eventsStore);
    });

    return this.events.asObservable();
  }

  public getMoreEvents() {
    this.eventsStore.meta.isLoading = true;
    this.events.next(this.eventsStore);

    this.loadEvents(this.eventsStore.items.length).catch((error) => {
      this.eventsStore.meta.error = error;
      this.eventsStore.meta.isLoading = false;

      this.events.next(this.eventsStore);
    });
  }

  public refreshEvents() {
    if (!this.eventsStore) { return; }

    this.eventsStore.meta.isLoading = true;
    this.events.next(this.eventsStore);

    this.loadEvents().catch((error) => {
      this.eventsStore.meta.error = error;
      this.eventsStore.meta.isLoading = false;

      this.events.next(this.eventsStore);
    });
  }

  public getTags(): Observable<TagModel[]> {
    if (this.tagsStore) {
      return this.tags.asObservable();
    }

    return this.loadTags().pipe(mergeMap(() => {
      return this.tags.asObservable();
    }));
  }

  public getEventsByTag(tagId: string, limit = 5): Observable<EventModel[]> {
    const filter: any = {
      limit: limit,
      sort: 'dates.date.from',
      order: 'ascend',
      tags: JSON.stringify([tagId]),
      dates: JSON.stringify([{ date: { from: (new Date()).toISOString() } }]),
    };

    const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((events: EventSource[]) => events.map((event) => new EventModel(event))),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);

          await this.likeService.updateLikeStats(...eventIds);

          return events;
        }),
      );
  }

  public getEventsBylocation(locationId: string, limit = 3): Observable<EventModel[]> {
    const filter: any = {
      limit: limit,
      sort: 'dates.date.from',
      order: 'ascend',
      or: JSON.stringify([{ 'dates.venue': locationId }]),
      dates: JSON.stringify([{ date: { from: (new Date()).toISOString() } }]),
    };

    const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((events: EventSource[]) => events.map((event) => new EventModel(event))),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);

          await this.likeService.updateLikeStats(...eventIds);

          return events;
        }),
      );
  }

  public getEventsThisWeek(skip = 0, limit = PREVIEW_LIMIT) {
    const filter: any = {
      skip: skip,
      limit: limit,
      sort: 'dates.date.from',
      order: 'ascend',
    };

    if (!filter.dates || filter.dates.indexOf('from') === -1) {
      filter.dates = JSON.stringify([{ date: { from: (new Date()).toISOString() } }]);
    }

    const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((events: EventSource[]) => events.map((event) => new EventModel(event))),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);

          if (!eventIds.length) { return events; }

          await this.likeService.updateLikeStats(...eventIds);

          return events;
        }),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);
          const adStats = await this.adService.getAdStats(...eventIds);

          events.forEach((event) => {
            event.adCount = adStats[event.id];
          });

          return events;
        }),
      );
  }

  private async loadEvents(skip = 0, limit = DEFAULT_LIMIT) {
    const whereFilter = await this.transformWhereFilter(this.whereFilter);
    const filter: any = Object.assign({
      skip: skip,
      limit: limit,
      sort: 'dates.date.from',
      order: 'ascend',
    }, whereFilter);

    if (!filter.dates || filter.dates.indexOf('from') === -1) {
      filter.dates = JSON.stringify([{ date: { from: (new Date()).toISOString() } }]);
    }

    if (!AppHelper.isEmptyObject(this.search)) { filter.q = this.search.q; }

    const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

    let totalCount = 0;

    return this.http.get(url)
      .pipe(
        tap((response: any) => {
          totalCount = response.count;
        }),
        map((response: any) => response.data),
        map((events: EventSource[]) => events.map((event) => new EventModel(event))),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);

          if (!eventIds.length) { return events; }

          await this.likeService.updateLikeStats(...eventIds);

          return events;
        }),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);
          const adStats = await this.adService.getAdStats(...eventIds);

          events.forEach((event) => {
            event.adCount = adStats[event.id];
          });

          return events;
        }),
        tap(async (events) => {
          const items = skip ? this.eventsStore.items.concat(events) : events;
          const hasMore = items.length < totalCount;

          this.eventsStore.items = items;
          this.eventsStore.meta.hasMore = hasMore;
          this.eventsStore.meta.totalCount = totalCount;
          this.eventsStore.meta.isLoading = false;

          this.events.next(this.eventsStore);

          this.updateEventsById(events);
        }),
      ).toPromise();
  }

  private loadEventById(eventId: string) {
    const url = `${C.urls.events}/${eventId}`;

    return this.http.get<EventSource>(url)
      .pipe(
        map((event) => new EventModel(event)),
        switchMap(async (event) => {
          await this.likeService.updateLikeStats(event.id);

          return event;
        }),
        tap(async (event) => {
          this.eventsByIdStore[event.id] = event;

          if (!this.eventsById[event.id]) {
            this.eventsById[event.id] = new BehaviorSubject(null);
          }

          this.eventsById[event.id].next(this.eventsByIdStore[event.id]);

          return event;
        }),
      );
  }

  private updateEventsById(events: EventModel[]) {
    events.forEach((event) => {
      this.eventsByIdStore[event.id] = event;

      if (!this.eventsById[event.id]) {
        this.eventsById[event.id] = new BehaviorSubject(null);
      }

      this.eventsById[event.id].next(this.eventsByIdStore[event.id]);
    });
  }

  private loadTags() {
    const url = `${C.urls.tags}?limit=0`;

    return this.http.get<any>(url)
      .pipe(
        map((response) => response.data),
        map((tags: TagSource[]) => tags
            .filter((t: TagSource) => t.name && !t.parent)
            .map((category) => new TagModel(category))),
        tap((tags: TagModel[]) => {
          this.tagsStore = tags.slice();
          this.tags.next(this.tagsStore);
        }),
      );
  }

  private loadHighlightedEvents(limit = 5) {
    const filter = {
      limit,
      general: JSON.stringify({ isHighlight: true }),
      dates: JSON.stringify([{ date: { from: (new Date()).toISOString() } }]),
    };

    const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get<any>(url)
      .pipe(
        map((response) => response.data),
        map((events: EventSource[]) => events.map((event) => new EventModel(event))),
        tap((events) => {
          this.highlightedEventsStore = events;

          if (!this.highlightedEvents) {
            this.highlightedEvents = new BehaviorSubject(null);
          }

          this.highlightedEvents.next(this.highlightedEventsStore);
        }),
      );
  }

  private updateFilter() {
    if (!this.eventsStore) { return; }

    this.eventsStore.items = [];
    this.eventsStore.meta.isLoading = true;
    this.eventsStore.meta.filterIsActive = AppHelper.isEmptyObject(this.whereFilter);
    this.eventsStore.meta.whereFilter = this.whereFilter;
    this.eventsStore.meta.orderBy = this.orderBy;
    this.events.next(this.eventsStore);

    this.loadEvents().catch((error) => {
      this.eventsStore.meta.error = error;
      this.eventsStore.meta.isLoading = false;

      this.events.next(this.eventsStore);
    });
  }

  private updateSearch(search: { [key: string]: any }) {
    this.search = search;

    if (!this.eventsStore) {
      this.eventsStore = { items: [], meta: { } };
    }

    this.eventsStore.items = [];
    this.eventsStore.meta.isLoading = true;
    this.eventsStore.meta.search = this.search;

    this.loadEvents().catch((error) => {
      this.eventsStore.meta.error = error;
      this.eventsStore.meta.isLoading = false;

      this.events.next(this.eventsStore);
    });

    this.events.next(this.eventsStore);
  }

  private async transformWhereFilter(filter) {
    const transformedFilter: any = {};
    const or: any[] = [];
    const dates: any[] = [];

    if (filter.near) {
      const near = filter.near;
      const distance = filter.radius;
      const locationIds: string[] = await this.locationService.getLocationIdsByCoords(near, distance);
      if (locationIds.length === 0)  {
        throw new Error('No locations found');
      }
      const locationIdFilter = locationIds.map((id: string) => { return { 'dates.venue': id }; });
      or.push(...locationIdFilter);
    }

    if (filter.tags) {
      or.push(...filter.tags.map((id: string) => { return { 'tags': id } }));
    }

    if (filter.priceRange) {
      filter.priceRange.forEach((price: string) => {
        if (price === 'free') {
          or.push(JSON.stringify({ 'price.free': true }));

          return;
        }

        const priceFilter = { 'price.priceCategory': price };
        or.push(priceFilter);
      });
    }

    if (filter.targetAudience) {
      or.push(...filter.targetAudience.map((id: string) => { return { 'targetAudience': id } }));
    }

    if (filter.dateFrom || filter.dateTo) {
      const date: any = {};
      if (filter.dateFrom) { date.from = filter.dateFrom; }
      if (filter.dateTo) { date.to = filter.dateTo; }
      if (!filter.dateFrom) { date.from = (new Date()).toISOString(); }
      dates.push({ date: date });
    }

    if (filter.time) {
      dates.push({ date: { time: filter.time } });
    }

    transformedFilter.dates = JSON.stringify(dates);

    if (or.length) { transformedFilter.or = JSON.stringify(or); }

    return transformedFilter;
  }
}
