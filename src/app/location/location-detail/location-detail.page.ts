import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import { GeolocationService } from 'src/app/@core/geolocation.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LocationModel } from '../shared/location.model';
import { LocationService } from '../shared/location.service';
import { environment } from 'src/environments/environment';

const TIMEOUT = 1000;

@HideSplash()
@Component({
  selector: 'page-location-detail',
  templateUrl: './location-detail.page.html',
  styleUrls: ['./location-detail.page.scss'],
})
export class LocationDetailPage implements OnInit {
  @ViewChild('slides', { static: false }) public slides: IonSlides;
  @ViewChild(IonContent, { static: false }) public content: IonContent;
  @ViewChild('relatedEvents', { static: false }) public related: ElementRef;

  public initialized = false;
  public id: string;
  public location: LocationModel;
  public mapImage = '';
  public bvgUrl = '';
  public gmapsUrl = '';
  public distance: string;
  public currentPosition: Position;
  public imageSliderOptions: any = {
    loop: true,
  };
  public tags = '';

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocationService: GeolocationService,
    private locationService: LocationService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
  ) { }

  public ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;

    this.locationService.getLocationById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((location) => {
        this.location = location;

        this.setMapData();
        this.calculateDistance();

        this.tags = this.location.tags
          .map((tag: any) => tag.name)
          .join(', ');

        // TODO: Do this after render is complete instead of timeout
        setTimeout(() => { this.scrollToRelated(); }, TIMEOUT);
      });

    this.geolocationService.getCurrentPosition()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentPosition) => {
        this.currentPosition = currentPosition;

        this.calculateDistance();
      });
  }

  public ionViewDidEnter() {
    if (this.initialized) { return; }

    this.initialized = true;
  }

  public scrollToRelated() {
    const hash = window.location.hash;
    if (hash === '#related') {
      const y = this.related.nativeElement.getBoundingClientRect().top;
      this.content.scrollToPoint(0, y).catch();
    }
  }

  public trackByFunction(index: number, item: any) {
    return item ? item.id : index;
  }

  public getVideoIframe(htmlString: string) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  public async slideNext() {
    this.slides.slideNext().catch();
  }

  public async slidePrevious() {
    this.slides.slidePrev().catch();
  }

  private setMapData() {
    if (!this.location.location) { return ''; }

    const COORDINATES_ARRAY_LENGTH = 2;
    if (this.location.location.coordinates.length !== COORDINATES_ARRAY_LENGTH) { return''; }

    const width = 748;
    const height = 260;
    const lat = this.location.location.coordinates[1];
    const lng = this.location.location.coordinates[0];
    const zoom = 13;

    this.mapImage = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}?access_token=${environment.mapboxAccessToken}`

    if (!this.location.address) { return; }

    const zip = this.location.address.zipcode;
    const city = this.location.address.city ? ' ' + this.location.address.city : '';
    const street = this.location.address.street ? ' ' + this.location.address.street : '';

    this.gmapsUrl = this.fixedEncodeURI(`https://www.google.com/maps/dir/?api=1&destination=${zip}${city}${street}`);
    this.bvgUrl = this.fixedEncodeURI(`https://fahrinfo.bvg.de/?to=${zip}${city}${street}`);
  }

  private fixedEncodeURI(str: string): string {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
  }

  private calculateDistance() {
    if (!this.location || !this.currentPosition) { return; }

    if (this.location && this.location.location && this.location.location.coordinates) {
      const startLng = this.currentPosition.coords.longitude;
      const startLat = this.currentPosition.coords.latitude;
      const endLng = this.location.location.coordinates[0];
      const endLat = this.location.location.coordinates[1];

      this.distance = this.geolocationService.calculateDistance(startLng, startLat, endLng, endLat);
    }
  }
}
