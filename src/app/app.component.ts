import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { UserService } from 'src/app/user/shared/user.service';
import { environment } from '../environments/environment';

declare var cordova: any;
declare var window: any;

const SPLASH_TIMEOUT = 3000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public splashImage = '';
  public splashImageLoaded: boolean;
  public splashTimeout;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  public initializeApp() {
    this.handleConsole();

    this.platform.ready().then(async () => {
      this.setTranslateConfig();

      this.splashImage = this.getSplashImage(this.platform.width());

      // if onSplashImageLoaded callback hasn't fired
      this.splashTimeout = setTimeout(() => {
        this.onSplashImageLoaded();
      }, SPLASH_TIMEOUT);

      if (this.authService.isAuthenticated()) {
        try {
          await this.userService.refreshCurrentUser();
        } catch (error) {
          console.error(error);
        }
      }
    }).catch();
  }

  public onSplashImageLoaded() {
    clearTimeout(this.splashTimeout);
    this.splashImageLoaded = true;

    if (!this.platform.is('cordova')) { return; }
  }

  private setTranslateConfig() {
    let lang = navigator.language.split('-')[0];
    lang = /(de|en)/gi.test(lang) ? lang : 'de';

    this.translate.setDefaultLang('de');
    this.translate.use('de');
  }

  private handleConsole() {
    if (window.localStorage.getItem('PROTO_DEBUG')) { return; }

    let methods: string[] = [];

    switch (environment.name) {
      case 'production':
      case 'staging':
        methods = ['log', 'debug', 'info', 'warn'];
        break;

      default:
        break;
    }

    if (methods.length) {
      console.warn('=====================================================');
      console.warn(' ');
      console.warn(`    🚨 Console output is disabled on ${environment.name}!`);
      console.warn(' ');
      console.warn('=====================================================');
    }

    methods.forEach((method) => {
      console[method] = function () { };
    });
  }

  private getSplashImage(width: number, height?: number): string {
    const WIDTH_IPHONE_5 = 320;
    const WIDTH_ANDROID_DEFAULT = 360;

    // TODO: missing splashscreen for s7 edge (and most probably other devices)

    if (width === WIDTH_IPHONE_5) {
      return "./assets/img/splash/Default-568h@2x~iphone.png";
    }

    if (width === WIDTH_ANDROID_DEFAULT) {
      return "./assets/img/splash/drawable-port-xhdpi-screen.png";
    }

    return "./assets/img/splash/Default-667h.png";
  }
}
