import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LocationService } from 'src/app/location/shared/location.service';
import { TagModel } from 'src/app/location/shared/tag.model';

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 50;
const DEFAULT_DISTANCE = 25;

@HideSplash()
@Component({
  selector: 'page-location-filter',
  templateUrl: './location-filter.page.html',
  styleUrls: ['./location-filter.page.scss'],
})
export class LocationFilterPage implements OnInit {
  @Input() public whereFilter: any;
  @Input() public orderBy: any;

  public tags: TagModel[] = [];
  public currentLocation = { lat: 52.52451, lng: 13.395346 };
  public priceRange: string;
  public locationCategoryId: string;

  public locationDistance: any = {
    isActive: false,
    current: DEFAULT_DISTANCE,
    min: MIN_DISTANCE,
    max: MAX_DISTANCE,
  };

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private locationService: LocationService,
  ) { }

  public ngOnInit() {
    this.restoreFilter();

    this.locationService.getTags()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tags) => {
        this.tags = tags;
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public clearFilter() {
    this.priceRange = '___ALL___';
    this.locationCategoryId = '___ALL___';
    this.locationDistance.isActive = false;
    this.orderBy = this.locationService.getDefaultOrderBy();

    this.applyFilter();
  }

  public applyFilter() {
    this.updateWhereFilter();

    this.locationService.setFilter(this.whereFilter, this.orderBy);
    this.dismiss();
  }

  public dismiss() {
    this.modalController.dismiss().catch();
  }

  private restoreFilter() {
    this.priceRange = this.whereFilter.priceRange || '___ALL___';
    this.locationCategoryId = this.whereFilter.locationCategoryId || '___ALL___';

    if (this.whereFilter.location && this.whereFilter.location.maxDistance) {
      this.locationDistance.isActive = true;
      this.locationDistance.current = this.whereFilter.location.maxDistance;
    }
  }

  private updateWhereFilter() {
    this.whereFilter.priceRange = this.priceRange;
    this.whereFilter.locationCategoryId = this.locationCategoryId;

    if (this.locationDistance.isActive) {
      this.whereFilter.location = {
        maxDistance: this.locationDistance.current,
        near: this.currentLocation,
      };
    } else {
      this.whereFilter.location = null;
    }

    for (const key in this.whereFilter) {
      if (this.whereFilter[key] === null || this.whereFilter[key] === undefined || this.whereFilter[key] === '___ALL___') {
        delete this.whereFilter[key];
      }
    }
  }
}
