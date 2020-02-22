import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

import { RESTAURANT_DUMMY_DATA, LocationModel } from '../shared/location.model';
import { LocationService, Locations } from '../shared/location.service';
import { LocationFilterPage } from 'src/app/location/location-filter/location-filter.page';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'page-location-list',
  templateUrl: './location-list.page.html',
  styleUrls: ['./location-list.page.scss'],
})
export class LocationListPage implements OnInit {
  @ViewChild('ListContent', { static: true }) public content: IonContent;
  public locations: Locations = {
    items: RESTAURANT_DUMMY_DATA,
    meta: { isFirstLoad: true, isLoading: true },
  };
  public searchValue: string;
  public currentLang: string;

  private ngUnsubscribe: Subject<any> = new Subject();
  private infiniteScrollEvent: any;
  private refresherEvent: any;
  private searchResultsLoading = false;

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private locationService: LocationService,
    private translate: TranslateService,
  ) {
    this.currentLang = this.translate.currentLang;
  }

  public ngOnInit() {
    this.locationService.getLocations()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((locations: Locations) => {
        this.locations.meta = locations.meta;

        // otherwise completeInfiniteScroll and completeRefresher would complete too early!
        if (this.locations.meta.isLoading) { return; }

        this.locations.items = locations.items;

        this.completeInfiniteScroll();
        this.completeRefresher();

        if (this.searchResultsLoading) {
          this.searchResultsLoading = false;
          this.content.scrollToTop(0).catch();
        }

      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public search(event: any) {
    this.searchResultsLoading = true;

    this.searchValue = event.detail.value;

    if (!this.searchValue) {
      return this.locationService.clearSearch();
    }

    this.locationService.searchLocations({ name: this.searchValue });
  }

  public refresh(event: any) {
    this.refresherEvent = event;
    this.locationService.refreshLocations();
  }

  public loadMore(event: any) {
    this.infiniteScrollEvent = event;

    if (!this.locations.meta.hasMore) {
      return this.completeInfiniteScroll();
    }

    this.locationService.getMoreLocations();
  }

  public openDetailPage(location: LocationModel) {
    if (!location) { return; }

    this.navController.navigateForward(['/main/locations', location.id]).catch();
  }

  public async openFilterModal() {
    const modal = await this.modalController.create({
      component: LocationFilterPage,
      componentProps: {
        whereFilter: JSON.parse(JSON.stringify(this.locations.meta.whereFilter)),
        orderBy: JSON.parse(JSON.stringify(this.locations.meta.orderBy)),
      },
      cssClass: 'filter-modal',
    } as ModalOptions);

    return await modal.present();
  }

  public trackByFunction(index: number, item: any) {
    return item ? item.id : index;
  }

  private completeInfiniteScroll() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
    }
  }

  private completeRefresher() {
    if (this.refresherEvent) {
      this.refresherEvent.target.complete();
    }
  }
}
