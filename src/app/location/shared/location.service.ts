import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap, switchMap } from 'rxjs/operators';

import { AppHelper } from 'src/app/@shared/app-helper';
import { C } from 'src/app/@shared/constants';
import { LikeService } from 'src/app/like/shared/like.service';
import { LocationModel, LocationSource } from './location.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { TagSource, TagModel } from 'src/app/location/shared/tag.model';

interface Coordinates {
  lat: number;
  lng: number;
}

export interface Locations extends ProtoItems {
  items: LocationModel[],
}

export interface LocationsAsGeoJSON {
  type: string,
  features: any[],
};

interface LocationsByIdStore {
  [key: string]: LocationModel,
}

interface LocationsById {
  [key: string]: BehaviorSubject<LocationModel>,
}

const DEFAULT_LIMIT = 25;
const DEFAUL_WHERE_FILTER = {};
const DEFAULT_ORDER_BY = 'createdAt DESC';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private whereFilter: any = DEFAUL_WHERE_FILTER;
  private orderBy = DEFAULT_ORDER_BY;
  private search: { [key: string]: string } = {};
  private locationsStore: Locations = null;
  private locations: BehaviorSubject<Locations> = new BehaviorSubject(null);
  private locationsByIdStore: LocationsByIdStore = {};
  private locationsById: LocationsById = {};
  private tagsStore: TagModel[];
  private tags: BehaviorSubject<TagModel[]> = new BehaviorSubject(null);
  private locationsAsGeoJsonStore: LocationsAsGeoJSON;
  private locationsAsGeoJson: BehaviorSubject<LocationsAsGeoJSON>;

  constructor(
    private http: HttpClient,
    private likeService: LikeService,
  ) { }

  public async getLocationIdsByCoords(coords: Coordinates, radius: number): Promise<string[]> {
    const filter: any = {
      skip: 0,
      limit: 0,
      distance: radius,
    };

    const location = `location=${JSON.stringify({ coordinates: [coords.lng, coords.lat] })}&fields=["eventCount"]&`;

    const url = `${C.urls.locations}?${location}${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((locations: any[]) => locations.filter((l: any) => l.eventCount)),
        map((locations: any[]) => locations.map((l: any) => l.id)),
      ).toPromise();
  }

  public getLocationsAsGeoJson() {
    if (this.locationsAsGeoJson) {
      return this.locationsAsGeoJson.asObservable();
    }

    return this.loadLocationsAsGeoJson().pipe(mergeMap(() => {
      return this.locationsAsGeoJson.asObservable();
    }));
  }

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

  public searchLocations(search: { [key: string]: any }) {
    this.updateSearch(search);
  }

  public clearSearch() {
    this.updateSearch({});
  }

  public getLocationById(locationId: string): Observable<LocationModel> {
    if (this.locationsById[locationId]) {
      return this.locationsById[locationId].asObservable();
    }

    return this.loadLocationById(locationId).pipe(mergeMap(() => {
      return this.locationsById[locationId].asObservable();
    }));
  }

  public refreshLocationById(locationId: string) {
    this.loadLocationById(locationId).toPromise().catch((error) => {
      console.error(`Error refreshing location ${locationId}`);
      console.error(error);
    });
  }

  public getLocations(): Observable<Locations> {
    this.locationsStore = { items: [], meta: { isFirstLoad: true, isLoading: true, filterIsActive: AppHelper.isEmptyObject(this.whereFilter), whereFilter: this.whereFilter, orderBy: this.orderBy } };
    this.locations.next(this.locationsStore);

    this.loadLocations().toPromise().catch((error) => {
      this.locationsStore.meta.error = error;
      this.locationsStore.meta.isLoading = false;

      this.locations.next(this.locationsStore);
    });

    return this.locations.asObservable();
  }

  public getMoreLocations() {
    this.locationsStore.meta.isLoading = true;
    this.locations.next(this.locationsStore);

    this.loadLocations(this.locationsStore.items.length).toPromise().catch((error) => {
      this.locationsStore.meta.error = error;
      this.locationsStore.meta.isLoading = false;

      this.locations.next(this.locationsStore);
    });
  }

  public refreshLocations() {
    if (!this.locationsStore) { return; }

    this.locationsStore.meta.isLoading = true;
    this.locations.next(this.locationsStore);

    this.loadLocations().toPromise().catch((error) => {
      this.locationsStore.meta.error = error;
      this.locationsStore.meta.isLoading = false;

      this.locations.next(this.locationsStore);
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

  private loadLocationsAsGeoJson() {
    const filter: any = {
      limit: 0,
      fields: JSON.stringify(['location', 'general.name', 'eventCount']),
    };

    const url = `${C.urls.locations}?${AppHelper.urlParamsFromObject(filter)}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => response.data),
        map((locations) => locations.map((location) => {
          return location.location && location.location.coordinates ? {
            type: 'Feature',
            geometry: location.location,
            properties: {
              id: location.id,
              title: location.general.name,
              eventCount: location.eventCount,
            },
          } : null })),
        switchMap(async (features) => {
          features = features.filter(Boolean);

          return {
            type: 'FeatureCollection',
            features,
          };
        }),
        tap((geojson) => {
          this.locationsAsGeoJsonStore = geojson;

          if (!this.locationsAsGeoJson) {
            this.locationsAsGeoJson = new BehaviorSubject(null);
          }

          this.locationsAsGeoJson.next(this.locationsAsGeoJsonStore);
        }),
      );
  }

  private loadLocations(skip = 0, limit = DEFAULT_LIMIT) {
    const filter: any = {
      skip: skip,
      limit: limit,
    };

    let url = `${C.urls.locations}?${AppHelper.urlParamsFromObject(filter)}`;

    if (!AppHelper.isEmptyObject(this.search)) {
      filter.name = this.search.name;

      url = `${C.urls.locations}/search?${AppHelper.urlParamsFromObject(filter)}`;
    }

    let totalCount = 0;

    return this.http.get(url)
      .pipe(
        tap((response: any) => {
          totalCount = response.count;
        }),
        map((response: any) => response.data),
        map((locations: LocationSource[]) => locations.map((location) => new LocationModel(location))),
        switchMap(async (locations) => {
          const locationIds = locations.map((location) => location.id);

          await this.likeService.updateLikeStats(...locationIds);

          return locations;
        }),
        tap(async (locations) => {
          const items = skip ? this.locationsStore.items.concat(locations) : locations;
          const hasMore = items.length < totalCount;

          this.locationsStore.items = items;
          this.locationsStore.meta.hasMore = hasMore;
          this.locationsStore.meta.totalCount = totalCount;
          this.locationsStore.meta.isLoading = false;

          this.locations.next(this.locationsStore);

          this.updateLocationsById(locations);
        }),
      );
  }

  private loadLocationById(locationId: string) {
    const url = `${C.urls.locations}/${locationId}`;

    return this.http.get<LocationSource>(url)
      .pipe(
        map((location) => new LocationModel(location)),
        switchMap(async (location) => {
          await this.likeService.updateLikeStats(location.id);

          return location;
        }),
        tap(async (location) => {
          this.locationsByIdStore[location.id] = location;

          if (!this.locationsById[location.id]) {
            this.locationsById[location.id] = new BehaviorSubject(null);
          }

          this.locationsById[location.id].next(this.locationsByIdStore[location.id]);

          return location;
        }),
      );
  }

  private updateLocationsById(locations: LocationModel[]) {
    locations.forEach((location) => {
      this.locationsByIdStore[location.id] = location;

      if (!this.locationsById[location.id]) {
        this.locationsById[location.id] = new BehaviorSubject(null);
      }

      this.locationsById[location.id].next(this.locationsByIdStore[location.id]);
    });
  }

  private loadTags() {
    const url = `${C.urls.tags}`;

    return this.http.get<any>(url)
      .pipe(
        map((response) => response.data),
        map((tags: TagSource[]) => tags.map((category) => new TagModel(category))),
        tap((tags) => {
          this.tagsStore = tags;
          this.tags.next(this.tagsStore);
        }),
      );
  }

  private updateFilter() {
    this.locationsStore.items = [];
    this.locationsStore.meta.isLoading = true;
    this.locationsStore.meta.filterIsActive = AppHelper.isEmptyObject(this.whereFilter);
    this.locationsStore.meta.whereFilter = this.whereFilter;
    this.locationsStore.meta.orderBy = this.orderBy;
    this.locations.next(this.locationsStore);

    this.loadLocations().toPromise().catch((error) => {
      this.locationsStore.meta.error = error;
      this.locationsStore.meta.isLoading = false;

      this.locations.next(this.locationsStore);
    });
  }

  private updateSearch(search: { [key: string]: any }) {
    this.search = search;

    this.locationsStore.items = [];
    this.locationsStore.meta.isLoading = true;
    this.locationsStore.meta.search = this.search;

    this.loadLocations().toPromise().catch((error) => {
      this.locationsStore.meta.error = error;
      this.locationsStore.meta.isLoading = false;

      this.locations.next(this.locationsStore);
    });
  }
}
