import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(
    private storage: StorageService,
  ) { }

  public initTracking() {
    let appStarts = this.storage.get('appStarts', 0);

    if (appStarts === 0) {
      this.storage.set('firstVisit', new Date().toISOString());
      this.track('firstVisit');
    }

    this.storage.set('lastVisit', new Date().toISOString());
    this.storage.set('appStarts', ++appStarts);

    this.track('appStart', { appStarts: appStarts });

    this.bindEvents();
  }

  private bindEvents() {
    // TODO: replace deprecated ionic Events
    // e.g. via plain js Event constructor or libs like https://github.com/ai/nanoevents
  }

  private track(eventName: string, eventProperties?: any) {
    const isTrackingDisabled = this.storage.get('isTrackingDisabled', false);
    if (isTrackingDisabled) { return console.warn('Tracking is disabled'); }

    // TODO Implement track function here
    // this.firebase.logEvent(eventName, eventProperties || {})
    //   .then((res: any) => { this.logger.info('log event success', res); })
    //   .catch((res: any) => { this.logger.info('log event error', res); });

    console.info('Tracking', eventName, eventProperties);
  }
}
