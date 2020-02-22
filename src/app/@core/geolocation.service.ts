import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { StorageService } from 'src/app/@core/storage.service';

const GEOLOCATION_PERMISSION_KEY = 'hasAllowedGeolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private currentPosition: BehaviorSubject<Position> = new BehaviorSubject(null);
  private currentPositionStore: Position;

  constructor(
    private alertController: AlertController,
    private storageService: StorageService,
    private translate: TranslateService,
  ) { }

  public async init() {
    if (navigator.geolocation) {
      const hadPermission = this.getGeolocationPermission();

      if (hadPermission === 'unkown') {
        const hasPermission = await this.showSoftAlert();
        this.setGeolocationPermission(hasPermission);

        if (!hasPermission) { return; }
      }

      navigator.geolocation.getCurrentPosition((position) => {
        this.currentPositionStore = position;
        this.currentPosition.next(this.currentPositionStore);
      });

      return;
    }
  }

  public getCurrentPosition() {
    if (this.currentPosition) {
      return this.currentPosition.asObservable();
    }

    return this.loadCurrentPosition().pipe(mergeMap(() => {
      return this.currentPosition.asObservable();
    }));
  }

  public calculateDistance(startLng: number, startLat: number, endLng: number, endLat: number) {
    if ((startLat == endLat) && (startLng == endLng)) { return '0'; }

    const radStartLat = Math.PI * startLat / 180; // tslint:disable-line
    const radEndLat = Math.PI * endLat / 180; // tslint:disable-line
    const theta = startLng - endLng;
    const radTheta = Math.PI * theta / 180; // tslint:disable-line
    let distance = Math.sin(radStartLat) * Math.sin(radEndLat) + Math.cos(radStartLat) * Math.cos(radEndLat) * Math.cos(radTheta);
    if (distance > 1) {
      distance = 1;
    }
    distance = Math.acos(distance);
    distance = distance * 180 / Math.PI; // tslint:disable-line
    distance = distance * 60 * 1.1515; // tslint:disable-line
    distance = distance * 1.609344; // tslint:disable-line

    const rounded = Math.round( distance * 10 ) / 10; // tslint:disable-line

    return rounded.toFixed(1).replace('.', ','); ;
  }

  private loadCurrentPosition() {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentPositionStore = position;
        this.currentPosition.next(this.currentPositionStore);
        observer.next(this.currentPositionStore);
        observer.complete();
      });
    });
  }

  private getGeolocationPermission(): boolean | "unkown" {
    return this.storageService.get(GEOLOCATION_PERMISSION_KEY, 'unkown');
  }

  private setGeolocationPermission(isAllowed: boolean) {
    this.storageService.set(GEOLOCATION_PERMISSION_KEY, isAllowed);
  }

  private async showSoftAlert(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: this.translate.instant('ALERT.GEOLOCATION.HEADER'),
        message: this.translate.instant('ALERT.GEOLOCATION.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => { return resolve(false); },
          }, {
            text: this.translate.instant('BUTTON.OK'),
            handler: () => { return resolve(true); },
          },
        ],
      });

      await alert.present();
    });
  }
}
