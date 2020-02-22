import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { EVENT_DUMMY_DATA } from 'src/app/event/shared/event.model';
import { EventService, Events } from 'src/app/event/shared/event.service';
import { EventModel } from 'src/app/event/shared/event.model';

const EVENT_COUNT = 3;

@Component({
  selector: 'related-events',
  templateUrl: './related-events.component.html',
  styleUrls: ['./related-events.component.scss'],
})
export class RelatedEventsComponent implements OnInit {
  public events: Events = {
    items: EVENT_DUMMY_DATA,
    meta: { isFirstLoad: true, isLoading: true },
  };

  private ngUnsubscribe: Subject<any> = new Subject();
  @Input() private eventId;
  @Input() private tagId;
  @Input() private locationId;

  constructor(
    private eventService: EventService,
  ) { }

  public ngOnInit() {
    if (this.tagId) {
      this.eventService.getEventsByTag(this.tagId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((events: EventModel[]) => {
        this.events.meta = {
          isLoading: false,
          isFirstLoad: false,
        };
        this.events.items = events
          .filter((e: EventModel) => e.id !== this.eventId)
          .splice(0, EVENT_COUNT);
      });

      return;
    }

    if (this.locationId) {
      this.eventService.getEventsBylocation(this.locationId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((events: EventModel[]) => {
        this.events.meta = {
          isLoading: false,
          isFirstLoad: false,
        };
        this.events.items = events
          .filter((e: EventModel) => e.id !== this.eventId)
          .splice(0, EVENT_COUNT);
      });

      return;
    }
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
