import { Component, OnInit, Input } from '@angular/core';

import { EventModel } from 'src/app/event/shared/event.model';
import { GeolocationService } from 'src/app/@core/geolocation.service';

export type MatchEventType = 'highlight' | 'category' | 'default';

// for background colors
export type MatchEventCategory = 'category1' | 'category2' | 'category3' | 'category4' | 'category5';

export interface IMatchEvent {
  id: string;
  adCount: number;
  date: { from: string, to?: string };
  title: string;
  type: MatchEventType;
  imageUrl?: string;
  location?: {
    name: string,
    coords: {
      latitude: number,
      longitude: number,
    },
  };
  category?: MatchEventCategory;
  distance?: number;
  isFree?: boolean;
}

@Component({
  selector: 'proto-match-event-preview',
  host: {
    class: 'match-event-preview',
  },
  templateUrl: './match-event-preview.component.html',
  styleUrls: ['./match-event-preview.component.scss'],
})
export class MatchEventPreviewComponent implements OnInit {
  @Input() public event: EventModel;
  @Input() public type: MatchEventType = 'default';
  @Input() public currentPosition: Position;

  public distance: string;
  public imageUrl = '';

  constructor(
    private geolocationService: GeolocationService,
  ) { }

  public ngOnInit() {
    if (!this.event) { return; }
    if (!this.event.images) { return; }

    this.imageUrl = !this.event.images.length ? './assets/img/fallback-default.png' : this.event.images[0].url;
  }

  public onImageError() {
    this.imageUrl = './assets/img/fallback-error.png';
  }
}
