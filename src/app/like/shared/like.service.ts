import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, mergeMap, map, switchMap } from 'rxjs/operators';

import { AppHelper } from 'src/app/@shared/app-helper';
import { C } from 'src/app/@shared/constants';
import { EventModel, EventSource } from 'src/app/event/shared/event.model';
import { LikeSource, LikeModel } from 'src/app/like/shared/like.model';
import { LocationModel, LocationSource } from 'src/app/location/shared/location.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { UserService } from 'src/app/user/shared/user.service';

const DEFAULT_LIMIT = 25;

interface LikeStatsByEntityStore {
  [key: string]: LikeStats;
};

interface LikeStatsByEntity {
  [key: string]: BehaviorSubject<LikeStats>;
};

export interface LikeStats {
  count: number;
  liked: boolean;
  likeId?: string;
  type?: string,
};

export interface Likes extends ProtoItems {
  items: LikeModel[],
}

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private likeStatsByEntityStore: LikeStatsByEntityStore = {};
  private likeStatsByEntity: LikeStatsByEntity = {};
  private likedLocationsStore: Likes = null;
  private likedLocations: BehaviorSubject<Likes> = new BehaviorSubject(null);
  private likedEventsStore: Likes = null;
  private likedEvents: BehaviorSubject<Likes> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  public likeEntity(entityId: string, entityType: string) {
    const url = `${C.urls.likes}`;
    const userId = this.userService.getCurrentUser().id;
    const type = entityType;

    return this.http.post<LikeSource>(url, { userId, entityId, type })
      .pipe(
        map((like) => new LikeModel(like)),
        tap((like) => {
          this.likeStatsByEntityStore[entityId] = {
            count: this.likeStatsByEntityStore[entityId].count + 1,
            liked: true,
            likeId: like.id,
          };

          this.likeStatsByEntity[entityId].next(this.likeStatsByEntityStore[entityId]);

          this.addLike(like).catch();
        }),
      )
      .toPromise();
  }

  public revokeLike(entityId: string, likeId: string) {
    const url = `${C.urls.likes}/${likeId}`;

    return this.http.delete(url)
      .pipe(
        tap(() => {
          this.likeStatsByEntityStore[entityId] = {
            count: this.likeStatsByEntityStore[entityId].count - 1,
            liked: false,
            likeId: null,
          };

          this.likeStatsByEntity[entityId].next(this.likeStatsByEntityStore[entityId]);

          this.removeLike(likeId);
        }),
      )
      .toPromise();
  }

  public getLikeStatsById(entityId: string): Observable<LikeStats> {
    if (this.likeStatsByEntity[entityId]) {
      return this.likeStatsByEntity[entityId].asObservable();
    }

    return this.loadLikeStats([entityId]).pipe(mergeMap(() => {
      return this.likeStatsByEntity[entityId].asObservable();
    }));
  }

  public updateLikeStats(...entityIds: string[]) {
    return this.loadLikeStats(entityIds).toPromise();
  }

  public getLikedLocations(): Observable<Likes> {
    this.likedLocationsStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
    this.likedLocations.next(this.likedLocationsStore);

    this.loadLikedLocations().toPromise().catch((error) => {
      this.likedLocationsStore.meta.error = error;
      this.likedLocationsStore.meta.isLoading = false;

      this.likedLocations.next(this.likedLocationsStore);
    });

    return this.likedLocations.asObservable();
  }

  public getMoreLikedLocations() {
    this.likedLocationsStore.meta.isLoading = true;
    this.likedLocations.next(this.likedLocationsStore);

    this.loadLikedLocations(this.likedLocationsStore.items.length).toPromise().catch((error) => {
      this.likedLocationsStore.meta.error = error;
      this.likedLocationsStore.meta.isLoading = false;

      this.likedLocations.next(this.likedLocationsStore);
    });
  }

  public getLikedEvents(): Observable<Likes> {
    this.likedEventsStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
    this.likedEvents.next(this.likedEventsStore);

    this.loadLikedEvents().toPromise().catch((error) => {
      this.likedEventsStore.meta.error = error;
      this.likedEventsStore.meta.isLoading = false;

      this.likedEvents.next(this.likedEventsStore);
    });

    return this.likedEvents.asObservable();
  }

  public getMoreLikedEvents() {
    this.likedEventsStore.meta.isLoading = true;
    this.likedEvents.next(this.likedEventsStore);

    this.loadLikedEvents(this.likedEventsStore.items.length).toPromise().catch((error) => {
      this.likedEventsStore.meta.error = error;
      this.likedEventsStore.meta.isLoading = false;

      this.likedEvents.next(this.likedEventsStore);
    });
  }

  private loadLikedLocations(skip = 0, limit = DEFAULT_LIMIT) {
    const currentUser = this.userService.getCurrentUser();

    const filter: any = {
      skip: skip,
      limit: limit,
      where: { type: 'location' },
    };

    const url = `${C.urls.users}/${currentUser.id}/likes?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get<LikeSource[]>(url, { observe: 'response' })
      .pipe(
        tap((response) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response) => response.body),
        map((likes) => likes.map((like) => new LikeModel(like))),
        switchMap(async (likes) => {
          const entityIds = likes.map((like) => like.entityId);

          const locations = await this.getLocationsByIds(...entityIds);
          const locationsById = this.locationsArrayToObject(locations);

          likes.forEach((like) => {
            like.entity = locationsById[like.entityId];
          });

          return likes;
        }),
        tap(async (likes) => {
          const items = skip ? this.likedLocationsStore.items.concat(likes) : likes;
          const hasMore = items.length < totalCount;

          this.likedLocationsStore.items = items;
          this.likedLocationsStore.meta.hasMore = hasMore;
          this.likedLocationsStore.meta.totalCount = totalCount;
          this.likedLocationsStore.meta.isLoading = false;

          this.likedLocations.next(this.likedLocationsStore);
        }),
      );
  }

  private loadLikedEvents(skip = 0, limit = DEFAULT_LIMIT) {
    const currentUser = this.userService.getCurrentUser();

    const filter: any = {
      skip: skip,
      limit: limit,
      where: { type: 'event' },
    };

    const url = `${C.urls.users}/${currentUser.id}/likes?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get<LikeSource[]>(url, { observe: 'response' })
      .pipe(
        tap((response) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response) => response.body),
        map((likes) => likes.map((like) => new LikeModel(like))),
        switchMap(async (likes) => {
          const entityIds = likes.map((like) => like.entityId);

          const events = await this.getEventsByIds(...entityIds);
          const eventsById = this.eventsArrayToObject(events);

          likes.forEach((like) => {
            like.entity = eventsById[like.entityId];
          });

          return likes;
        }),
        tap(async (likes) => {
          const items = skip ? this.likedEventsStore.items.concat(likes) : likes;
          const hasMore = items.length < totalCount;

          this.likedEventsStore.items = items;
          this.likedEventsStore.meta.hasMore = hasMore;
          this.likedEventsStore.meta.totalCount = totalCount;
          this.likedEventsStore.meta.isLoading = false;

          this.likedEvents.next(this.likedEventsStore);
        }),
      );
  }

  private loadLikeStats(entityIds: string[]) {
    const query = { entityIds };

    const url = `${C.urls.likes}/stats?${AppHelper.urlParamsFromObject(query)}`;

    return this.http.get(url)
      .pipe(
        tap((likeStats) => {
          for (const entityId in likeStats) {
            if (likeStats.hasOwnProperty(entityId)) {
              const count = likeStats[entityId];

              this.likeStatsByEntityStore[entityId] = count;

              if (!this.likeStatsByEntity[entityId]) {
                this.likeStatsByEntity[entityId] = new BehaviorSubject(null);
              }

              this.likeStatsByEntity[entityId].next(this.likeStatsByEntityStore[entityId]);
            }
          }
        }),
      );
  }

  private getLocationsByIds(...locationIds: string[]) {
    const filter: any = {
      ids: JSON.stringify(locationIds),
      limit: DEFAULT_LIMIT,
    };

    const url = `${C.urls.locations}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((locations: LocationSource[]) => locations.map((location) => new LocationModel(location))),
      )
      .toPromise();
  }

  private getEventsByIds(...eventIds: string[]) {
    const filter: any = {
      ids: JSON.stringify(eventIds),
      limit: DEFAULT_LIMIT,
    };

    const url = `${C.urls.events}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((events: EventSource[]) => events.map((location) => new EventModel(location))),
      )
      .toPromise();
  }

  private locationsArrayToObject(locationsArray: LocationModel[]) {
    const locationsObject = {};

    locationsArray.forEach((location) => {
      locationsObject[location.id] = location;
    });

    return locationsObject;
  }

  private eventsArrayToObject(eventsArray: EventModel[]) {
    const eventsObject = {};

    eventsArray.forEach((event) => {
      eventsObject[event.id] = event;
    });

    return eventsObject;
  }

  private async addLike(like: LikeModel) {
    try {
      if (like.type === 'event') {
        const url = `${C.urls.events}/${like.entityId}`;
        const event = await this.http.get<EventSource>(url).pipe(map((event) => new EventModel(event))).toPromise();

        like.entity = event;

        this.likedEventsStore.items.unshift(like);
        this.likedEvents.next(this.likedEventsStore);

        return;
      }

      const url = `${C.urls.locations}/${like.entityId}`;
      const location = await this.http.get<LocationSource>(url).pipe(map((event) => new LocationModel(event))).toPromise();

      like.entity = location;

      this.likedLocationsStore.items.unshift(like);
      this.likedLocations.next(this.likedLocationsStore);
    } catch (error) {
      console.error();
    }
  }

  private removeLike(likeId: string) {
    let done = false;

    if (this.likedEventsStore) {
      this.likedEventsStore.items.some((likedEvent, i) => {
        if (likedEvent.id === likeId) {
          this.likedEventsStore.items.splice(i, 1);
          this.likedEvents.next(this.likedEventsStore);
          done = true;

          return true;
        }
      });
    }

    if (done || !this.likedLocationsStore) { return; }

    this.likedLocationsStore.items.some((likedLocation, i) => {
      if (likedLocation.id === likeId) {
        this.likedLocationsStore.items.splice(i, 1);
        this.likedLocations.next(this.likedLocationsStore);

        return true;
      }
    });
  }
}
