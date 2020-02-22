import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AdService } from 'src/app/ad/shared/ad.service';
import { EventModel } from 'src/app/event/shared/event.model';
import { Events, EventService } from 'src/app/event/shared/event.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import {
  MOCK_EVENTS_BY_CATEGORY,
} from 'src/app/event/shared/match-event-preview/mock-data';
import { IMatchEvent } from 'src/app/event/shared/match-event-preview/match-event-preview.component';

const TAGS_TO_DISPLAY = 5;
const EVENTS_TO_LOAD = 6;
const SUNDAY = 6;

@HideSplash()
@Component({
  selector: 'page-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public eventsByCategory: IMatchEvent[] = [];
  public eventsThisWeek: Events = { items: [], meta: { isFirstLoad: true, isLoading: true } };

  public adCount = 0;
  public tags: any = [];
  public tagsCount: any = {};
  public nextSunday = moment().isoWeekday(SUNDAY).toISOString();

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private adService: AdService,
    private eventService: EventService,
  ) {
  }

  public ngOnInit() {
    this.getEventsByCategory();
    this.getEventsForThisWeek();

    this.adService.getAdsCount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((count: number) => this.adCount = count);
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public trackByFunction(index: number, item: any) {
    return item ? item.id : index;
  }

  private getEventsByCategory() {
    this.eventsByCategory = MOCK_EVENTS_BY_CATEGORY;

    this.eventService.getTags()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tags: any) => {
        this.tags = tags
          .slice()
          .splice(0, TAGS_TO_DISPLAY);

        this.tags.forEach((t: any) => {
          this.tagsCount[t.id] = 0;

          this.adService.getAdsCount(t.id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((count: number) => this.tagsCount[t.id] = count);
        });

      });
  }

  private getEventsForThisWeek() {
    // this.eventService.getEventsThisWeek()
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((events: EventModel[]) => {
    //     console.log(this.eventsThisWeek.items instanceof Array);
    //     this.eventsThisWeek.items.push(...events);
    //     console.log(this.eventsThisWeek);
    //   });

    this.adService.getEventsWithAds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((ads: EventModel[]) => {
        this.eventsThisWeek.items.push(...ads.slice().splice(0, EVENTS_TO_LOAD));
      });
  }
}
