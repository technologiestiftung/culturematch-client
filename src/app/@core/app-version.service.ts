import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { C } from '../@shared/constants';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppVersionService {
  constructor(
    private http: HttpClient,
    private platform: Platform,
    private storage: StorageService,
  ) {
  }

  public getAppVersionFromStorage(): string {
    return this.storage.get('appVersion');
  }

  public getAppVersion(): Promise<string> {
    return Promise.resolve(C.APP_VERSION.number);
  }
  public getAppName(): Promise<string> {
    return Promise.resolve(C.APP_VERSION.name);
  }

  public getPackageName(): Promise<string> {
    return Promise.resolve(C.APP_VERSION.package);
  }

  // http://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number
  // a > b  returns number >= 1
  // a = b  returns number = 0
  // a < b  returns number <= -1
  public compareVersion(a: string, b: string): number {
    let i, diff;
    const radix = 10;
    const regExStrip0 = /(\.0+)+$/;
    const segmentsA = a.replace(regExStrip0, '').split('.');
    const segmentsB = b.replace(regExStrip0, '').split('.');
    const l = Math.min(segmentsA.length, segmentsB.length);
    for (i = 0; i < l; i++) {
      diff = parseInt(segmentsA[i], radix) - parseInt(segmentsB[i], radix);
      if (diff) {
        return diff;
      }
    }

    return segmentsA.length - segmentsB.length;
  }

  public checkForBreakingChanges(): Promise<any> {
    return this.getAppVersion().then((appVersion) => {
      return this.getRemoteVersions().then((remoteVersions: any) => {
        let hasBreakingChanges = false;
        remoteVersions.forEach((remoteVersion: any) => {
          if (this.compareVersion(remoteVersion.versionCode, appVersion) > 0 && remoteVersion.breakingChanges) {
            hasBreakingChanges = true;
          }
        });

        console.debug(`Breaking changes detected: ${hasBreakingChanges}`);

        return Promise.resolve(hasBreakingChanges);
      }, (error) => {
        return Promise.reject(error);
      });
    }, (error) => {
      return Promise.reject(error);
    });
  }

  private getRemoteVersions() {
    const url = `${C.urls.appVersions}`;

    return this.http.get(url).toPromise();
  }
}
