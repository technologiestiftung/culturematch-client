import { Component, OnInit, Input } from '@angular/core';

import { GeolocationService } from 'src/app/@core/geolocation.service';
import { LocationModel } from 'src/app/location/shared/location.model';

@Component({
  selector: 'proto-location-preview',
  templateUrl: './location-preview.component.html',
  styleUrls: ['./location-preview.component.scss'],
})
export class LocationPreviewComponent implements OnInit {
  @Input() public location: LocationModel;
  @Input() public currentPosition: Position;

  public distance: string;

  constructor(
    private geolocationService: GeolocationService,
  ) { }

  public ngOnInit() { }

  public ngOnChanges() {
    if (this.currentPosition && this.location && this.location.location) {
      this.calculateDistance();
    }
  }

  private calculateDistance() {
    const startLng = this.currentPosition.coords.longitude;
    const startLat = this.currentPosition.coords.latitude;
    const endLng = this.location.location.coordinates[0];
    const endLat = this.location.location.coordinates[1];

    this.distance = this.geolocationService.calculateDistance(startLng, startLat, endLng, endLat);
  }
}
