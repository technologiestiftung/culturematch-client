import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap, switchMap } from 'rxjs/operators';

import { AdModel, AdSource } from './ad.model';
import { AppHelper } from 'src/app/@shared/app-helper';
import { C } from 'src/app/@shared/constants';
import { EventModel, EventSource } from 'src/app/event/shared/event.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { UserService } from 'src/app/user/shared/user.service';

export interface Ads extends ProtoItems {
  items: AdModel[],
}

interface AdsByEventStore {
  [key: string]: Ads,
}

interface AdsByEvent {
  [key: string]: BehaviorSubject<Ads>,
}

interface AdsByIdStore {
  [key: string]: AdModel,
}

interface AdsById {
  [key: string]: BehaviorSubject<AdModel>,
}

const DEFAULT_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class AdService {
  private ownAdsStore: Ads = null;
  private ownAds: BehaviorSubject<Ads> = new BehaviorSubject(null);
  private adsStore: Ads = null;
  private ads: BehaviorSubject<Ads> = new BehaviorSubject(null);
  private adsByIdStore: AdsByIdStore = {};
  private adsById: AdsById = {};
  private adsByEventStore: AdsByEventStore = {};
  private adsByEvent: AdsByEvent = {};

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  public getAdsCount(tagId?: string) {
    const filter: any = {
      limit: 1,
    };

    if (tagId) {
      filter.where = { eventTagIds: { like: `%${tagId}%` } };
    }

    const url = `${C.urls.ads}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        map((response: any) => {
          const headers: HttpHeaders = response.headers;

          return totalCount = parseInt(headers.get('x-total-count'));
        }),
      );
  }

  public getAdsByTagId(tagId: string) {
    const filter = {
      limit: 0,
      include: 'user',
      where: {
        tagIds: tagId,
      },
    };

    const url = `${C.urls.ads}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((ads: AdSource[]) => ads.map((ad) => new AdModel(ad))),
        tap((ads: AdModel[]) => {
          console.log(totalCount, ads);
        }),
      );
  }

  // TODO: remove
  public getEventsWithAds() {
    const url = `${C.urls.ads}/unique-event-ids`;

    return this.http.get(url)
      .pipe(
        switchMap(async (eventIds) => {
          const filter: any = {
            limit: 0,
            ids: JSON.stringify(eventIds),
          };

          const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

          const response = await this.http.get<any>(url).toPromise();

          return response;
        }),
        map((response: any) => response.data),
        map((events: EventSource[]) => events.map((event) => new EventModel(event))),
        switchMap(async (events) => {
          const eventIds = events.map((event) => event.id);
          const adStats = await this.getAdStats(...eventIds);

          events.forEach((event) => {
            event.adCount = adStats[event.id];
          });

          return events;
        }),
      );
  }

  public getAdById(adId: string): Observable<AdModel> {
    if (this.adsById[adId]) {
      return this.adsById[adId].asObservable();
    }

    return this.loadAdById(adId).pipe(mergeMap(() => {
      return this.adsById[adId].asObservable();
    }));
  }

  public refreshAdById(adId: string) {
    this.loadAdById(adId).toPromise().catch((error) => {
      console.error(`Error refreshing ad ${adId}`);
      console.error(error);
    });
  }

  public getAds(): Observable<Ads> {
    this.adsStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
    this.ads.next(this.adsStore);

    this.loadAds().toPromise().catch((error) => {
      this.adsStore.meta.error = error;
      this.adsStore.meta.isLoading = false;

      this.ads.next(this.adsStore);
    });

    return this.ads.asObservable();
  }

  public getOwnAds(): Observable<Ads> {
    this.ownAdsStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
    this.ownAds.next(this.ownAdsStore);

    this.loadOwnAds().toPromise().catch((error) => {
      this.ownAdsStore.meta.error = error;
      this.ownAdsStore.meta.isLoading = false;

      this.ownAds.next(this.ownAdsStore);
    });

    return this.ownAds.asObservable();
  }

  public getMoreOwnAds() {
    this.ownAdsStore.meta.isLoading = true;
    this.ownAds.next(this.ownAdsStore);

    this.loadOwnAds(this.ownAdsStore.items.length).toPromise().catch((error) => {
      this.ownAdsStore.meta.error = error;
      this.ownAdsStore.meta.isLoading = false;

      this.ownAds.next(this.ownAdsStore);
    });
  }

  public getAdsByEvent(eventId: string): Observable<Ads> {
    this.adsByEventStore[eventId] = { items: [], meta: { isFirstLoad: true, isLoading: true } };

    if (!this.adsByEvent[eventId]) {
      this.adsByEvent[eventId] = new BehaviorSubject(null);
    }

    this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);

    this.loadAdsByEvent(eventId).toPromise().catch((error) => {
      this.adsByEventStore[eventId].meta.error = error;
      this.adsByEventStore[eventId].meta.isLoading = false;

      this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);
    });

    return this.adsByEvent[eventId].asObservable();
  }

  public getMoreAdsByEvent(eventId: string) {
    this.adsByEventStore[eventId].meta.isLoading = true;
    this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);

    this.loadAdsByEvent(eventId, this.adsByEventStore[eventId].items.length).toPromise().catch((error) => {
      this.adsByEventStore[eventId].meta.error = error;
      this.adsByEventStore[eventId].meta.isLoading = false;

      this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);
    });
  }

  public refreshAdsByEvent(eventId: string) {
    if (!this.adsByEventStore[eventId]) { return; }

    this.adsByEventStore[eventId].meta.isLoading = true;
    this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);

    this.loadAdsByEvent(eventId).toPromise().catch((error) => {
      this.adsByEventStore[eventId].meta.error = error;
      this.adsByEventStore[eventId].meta.isLoading = false;

      this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);
    });
  }

  public getAdStats(...eventIds: string[]) {
    const url = `${C.urls.ads}/stats?eventIds=${eventIds.join()}`;

    return this.http.get(url)
      .toPromise();
  }

  public createAd(event: EventModel, description: string) {
    const url = `${C.urls.ads}`;

    const data = {
      eventId: event.id,
      description,
      eventTitle: event.title,
      eventTagIds: event.tags.map((t: any) => t.id).join(','),
    };

    return this.http.post<AdSource>(url, data)
      .pipe(
        map((ad) => new AdModel(ad)),
        tap((ad) => {
          ad.user = this.userService.getCurrentUser();

          if (this.adsByEventStore[event.id]) {
            this.adsByEventStore[event.id].items.unshift(ad);
            this.adsByEventStore[event.id].meta.totalCount++;

            this.adsByEvent[event.id].next(this.adsByEventStore[event.id]);
          }

          return ad;
        }),
      )
      .toPromise();
  }

  public updateAttributes(adId: string, eventId: string, attributes: any) {
    const url = `${C.urls.ads}/${adId}`;

    return this.http.patch(url, attributes)
      .pipe(
        tap(() => {
          this.ownAdsStore.items.some((ad, i) => {
            if (ad.id === adId) {
              this.ownAdsStore.items[i] = Object.assign(ad, attributes);
              this.ownAds.next(this.ownAdsStore);

              return true;
            }
          });

          if (this.adsByEventStore[eventId]) {
            this.adsByEventStore[eventId].items.some((ad, i) => {
              this.adsByEventStore[eventId].items[i] = Object.assign(ad, attributes);
              this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);

              return true;
            });
          }
        }),
      )
      .toPromise();
  }

  private loadAds(skip = 0, limit = DEFAULT_LIMIT) {
    const filter = {
      skip: skip,
      limit: limit,
      include: 'user',
    };

    const url = `${C.urls.ads}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((ads: AdSource[]) => ads.map((ad) => new AdModel(ad))),
        tap((ads: AdModel[]) => {
          const items = skip ? this.adsStore.items.concat(ads) : ads;
          const hasMore = items.length < totalCount;
          this.adsStore = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

          if (!this.ads) {
            this.ads = new BehaviorSubject(null);
          }

          this.ads.next(this.adsStore);
        }),
      );
  }

  private loadOwnAds(skip = 0, limit = DEFAULT_LIMIT) {
    const currentUser = this.userService.getCurrentUser();

    const filter = {
      skip: skip,
      limit: limit,
      include: 'user',
    };

    const url = `${C.urls.users}/${currentUser.id}/offers?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((ads: AdSource[]) => ads.map((ad) => new AdModel(ad))),
        tap((ads: AdModel[]) => {
          const items = skip ? this.ownAdsStore.items.concat(ads) : ads;
          const hasMore = items.length < totalCount;
          this.ownAdsStore = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

          this.ownAds.next(this.ownAdsStore);
        }),
        tap((ads) => {
          this.updateAdsById(ads);
        }),
      );
  }

  private loadAdsByEvent(eventId: string, skip = 0, limit = DEFAULT_LIMIT) {
    const filter = {
      skip: skip,
      limit: limit,
      where: { eventId },
      include: 'user',
    };

    const url = `${C.urls.ads}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((ads: AdSource[]) => ads.map((ad) => new AdModel(ad))),
        tap((ads: AdModel[]) => {
          const items = skip ? this.adsByEventStore[eventId].items.concat(ads) : ads;
          const hasMore = items.length < totalCount;
          this.adsByEventStore[eventId] = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

          if (!this.adsByEvent[eventId]) {
            this.adsByEvent[eventId] = new BehaviorSubject(null);
          }

          this.adsByEvent[eventId].next(this.adsByEventStore[eventId]);
        }),
        tap((ads) => {
          this.updateAdsById(ads);
        }),
      );
  }

  private loadAdById(adId: string) {
    const url = `${C.urls.ads}/${adId}`;

    return this.http.get<AdSource>(url)
      .pipe(
        map((ad) => new AdModel(ad)),
        tap((ad) => {
          this.adsByIdStore[ad.id] = ad;

          if (!this.adsById[ad.id]) {
            this.adsById[ad.id] = new BehaviorSubject(null);
          }

          this.adsById[ad.id].next(this.adsByIdStore[ad.id]);
        }),
      );
  }

  private updateAdsById(ads: AdModel[]) {
    ads.forEach((ad) => {
      this.adsByIdStore[ad.id] = ad;

      if (!this.adsById[ad.id]) {
        this.adsById[ad.id] = new BehaviorSubject(null);
      }

      this.adsById[ad.id].next(this.adsByIdStore[ad.id]);
    });
  }
}
