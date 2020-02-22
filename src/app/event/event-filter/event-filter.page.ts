import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { EventService } from 'src/app/event/shared/event.service';
import { GeolocationService } from 'src/app/@core/geolocation.service';
import { TagModel } from 'src/app/event/shared/tag.model';
import * as moment from 'moment';

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 5;
const DEFAULT_DISTANCE = 2.5;

@HideSplash()
@Component({
  selector: 'page-event-filter',
  templateUrl: './event-filter.page.html',
  styleUrls: ['./event-filter.page.scss'],
})
export class EventFilterPage implements OnInit {
  @Input() public whereFilter: any;
  @Input() public orderBy: any;

  public tags: TagModel[] = [];
  public currentPosition = { lat: 52.52451, lng: 13.395346 };
  public priceRange: string[];
  public time: string[] = [];
  public dateFrom: string;
  public dateTo: string;
  public today: string = (new Date()).toISOString();
  public targetAudience: string[] = [];
  public tagIds: string[] = [];
  public initialized = false;

  public eventDistance: any = {
    isActive: false,
    current: DEFAULT_DISTANCE,
    min: MIN_DISTANCE,
    max: MAX_DISTANCE,
  };

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private eventService: EventService,
    private geolocationService: GeolocationService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.geolocationService.getCurrentPosition()
      .subscribe((position: Position) => {
        if (position && position.coords) {
          this.currentPosition.lat = position.coords.latitude;
          this.currentPosition.lng = position.coords.longitude;
        }
      });
  }

  public getFilterOptions(type: string): any {
    const filter = this.translate.instant('FILTER.' + type);
    const result = [];
    Object.keys(filter).map((key) => {
      result.push({
        VALUE: key,
        LABEL: filter[key],
      })
    })

    return result;
  }

  public ngOnInit() {
    this.getFilterOptions('TIME');
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ionViewDidEnter() {
    if (this.initialized) { return; }

    this.initialized = true;
    this.restoreFilter();
    this.eventService.getTags()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tags) => {
        this.tags = tags;
      });
  }

  public clearFilter() {
    this.priceRange = [];
    this.eventDistance.isActive = false;
    this.orderBy = this.eventService.getDefaultOrderBy();
    this.dateFrom = null;
    this.dateTo = null;

    this.time = [];
    this.tagIds = [];
    this.targetAudience = [];

    this.applyFilter();
  }

  public applyFilter() {
    this.updateWhereFilter();

    this.eventService.setFilter(this.whereFilter, this.orderBy);
    this.dismiss();
  }

  public dismiss() {
    this.modalController.dismiss().catch();
  }

  private restoreFilter() {
    this.priceRange = this.whereFilter.priceRange || [];
    this.time = this.whereFilter.time || [];
    this.targetAudience = this.whereFilter.targetAudience || [];
    this.tagIds = this.whereFilter.tags || [];
    this.dateFrom = this.whereFilter.dateFrom || null;
    this.dateTo = this.whereFilter.dateTo || null;

    if (this.whereFilter.radius && this.whereFilter.near) {
      this.eventDistance.isActive = true;
      this.eventDistance.current = this.whereFilter.radius;
    }
  }

  private updateWhereFilter() {
    this.whereFilter.time = this.time.length ? this.time : null;
    this.whereFilter.priceRange = this.priceRange.length ? this.priceRange : null;
    this.whereFilter.targetAudience = this.targetAudience.length ? this.targetAudience : null;
    this.whereFilter.tags = this.tagIds.length ? this.tagIds : null;
    this.whereFilter.dateFrom = moment(this.dateFrom).toISOString();
    this.whereFilter.dateTo = moment(this.dateTo).toISOString();

    if (this.eventDistance.isActive) {
      this.whereFilter.near = this.currentPosition;
      this.whereFilter.radius = this.eventDistance.current;
    } else {
      this.whereFilter.near = null;
      this.whereFilter.radius = DEFAULT_DISTANCE;
    }

    const queryParams = {
      targetAudience: this.targetAudience.length ? this.targetAudience.join() : null,
      tags: this.tagIds.length ? this.tagIds.join() : null,
      priceRange: this.priceRange.length ? this.priceRange.join() : null,
      time: this.time.length ? this.time.join() : null,
      near: this.eventDistance.isActive ? `${this.currentPosition.lat},${this.currentPosition.lng}` : null,
      radius: this.eventDistance.isActive ? this.eventDistance.current : null,
      dateFrom: this.whereFilter.dateFrom || null,
      dateTo: this.whereFilter.dateTo || null,
      openFilterModal: 0,
    };

    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams, queryParamsHandling: 'merge' }).catch();

    for (const key in this.whereFilter) {
      if (this.whereFilter[key] === null || this.whereFilter[key] === undefined || this.whereFilter[key] === '___ALL___') {
        delete this.whereFilter[key];
      }
    }
  }
}
