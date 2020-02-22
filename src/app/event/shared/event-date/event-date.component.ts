import * as moment from 'moment' ;
import { EventDate, EventModel } from 'src/app/event/shared/event.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'proto-event-date',
  templateUrl: './event-date.component.html',
  styleUrls: ['./event-date.component.scss'],
})
export class EventDateComponent implements OnInit {
  @Input() public eventDate: EventDate;
  @Input() public event: EventModel;
  @Input() public hideAdditionalEvents: boolean;
  @Input() public relatedEventsClickable: boolean;
  @Output() public relatedEvents: EventEmitter<void> = new EventEmitter();

  public isDateToday = false;

  constructor() {
  }

  public ngOnChanges() {
    if (!this.event) { return; }

    const firstDate = moment(this.event.dates[0].date.from);

    if (firstDate.isSame(moment(), 'day')) { this.isDateToday = true; }
  }

  public ngOnInit() {}

  public trigger() {
    this.relatedEvents.emit();
  }
}
