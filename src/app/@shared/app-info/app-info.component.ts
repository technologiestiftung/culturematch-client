import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppVersionService } from '../../@core/app-version.service';
import { environment } from '../../../environments/environment';

const minKnocks = 13;

@Component({
  selector: 'app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss'],
})
export class AppInfoComponent {
  public name = 'Not set';
  public id = 'Not set';
  public version = 'Not set';
  public environment = 'Not set';

  private knocks = 0;

  constructor(
    private appVersionService: AppVersionService,
    private router: Router,
  ) {
    this.getAppInfo();
  }

  public knockToOpenGodMode() {
    this.knocks++;

    if (this.knocks >= minKnocks) {
      this.knocks = 0;
      this.router.navigate(['/god-mode']).catch();
    }
  }

  private getAppInfo() {
    this.appVersionService.getAppName().then((result) => { this.name = result; }).catch((error) => { console.error(error); });
    this.appVersionService.getPackageName().then((result) => { this.id = result; }).catch((error) => { console.error(error); });
    this.appVersionService.getAppVersion().then((result) => { this.version = result; }).catch((error) => { console.error(error); });
    this.environment = environment.name;
  }
}
