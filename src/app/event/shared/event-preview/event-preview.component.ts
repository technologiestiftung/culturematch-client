import { Component, OnInit, Input } from '@angular/core';

import { EventModel } from 'src/app/event/shared/event.model';
import { GeolocationService } from 'src/app/@core/geolocation.service';

@Component({
  selector: 'proto-event-preview',
  templateUrl: './event-preview.component.html',
  styleUrls: ['./event-preview.component.scss'],
})
export class EventPreviewComponent implements OnInit {
  @Input() public event: EventModel;
  @Input() public isHighlight = false;
  @Input() public currentPosition: Position;

  public distance: string;
  public imageUrl = '';

  constructor(
    private geolocationService: GeolocationService,
  ) { }

  public ngOnInit() {
    if (!this.event) { return; }

    this.imageUrl = !this.event.images || !this.event.images.length ? './assets/img/fallback-default.png' : this.event.images[0].url;
  }

  public ngOnChanges() {
    if (this.currentPosition && this.event && this.event.venue) {
      this.calculateDistance();
    }
  }

  public onImageError() {
    this.imageUrl = './assets/img/fallback-error.png';
  }

  private calculateDistance() {
    const startLng = this.currentPosition.coords.longitude;
    const startLat = this.currentPosition.coords.latitude;
    const endLng = this.event.venue.location.coordinates[0];
    const endLat = this.event.venue.location.coordinates[1];

    this.distance = this.geolocationService.calculateDistance(startLng, startLat, endLng, endLat);
  }
}
