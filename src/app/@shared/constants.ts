import { environment } from '../../environments/environment';

declare var navigator: any;

// Do NEVER remove or modify the following line (appVersionFromConfigXml)
// under any circumstances as the world will explode if you do so!
const appVersionFromConfigXml = '0.9.3_RC1';
const pStyle: CSSStyleDeclaration = getComputedStyle(document.documentElement);

/* tslint:disable-next-line */
export class C {
  public static ENV = environment.name;

  public static STORAGE_PREFIX_SEPARATOR = 'ಠ_ಠ';
  public static STORAGE_APP_PREFIX = 'culturematch';
  public static STORAGE_PREFIX = `${C.STORAGE_APP_PREFIX}-${environment.name}${C.STORAGE_PREFIX_SEPARATOR}`;

  // for non-cordova platforms
  public static APP_VERSION = {
    name: 'culturematch',
    package: 'berlin.prototype.culturematch',
    number: appVersionFromConfigXml,
  };

  public static availableLanguages = ['de'];
  public static defaultLanguage = 'de';

  public static appReloadThreshold = 3600000;

  public static urls: any = {
    get culturematch() {
      return environment.culturematchUrl;
    },
    get baseUrl() {
      return environment.apiBaseUrl;
    },
    get baseUrlData() {
      return environment.apiBaseUrlData;
    },
    apiVersion: 'api',
    apiVersionData: 'v2',
    get url() {
      return `${this.baseUrl}/${this.apiVersion}`;
    },
    get users() {
      return `${this.url}/users`;
    },
    get agreements() {
      return `${this.url}/agreements`;
    },
    get consents() {
      return `${this.url}/consents`;
    },
    get files() {
      return `${this.url}/files`;
    },
    get likes() {
      return `${this.url}/likes`;
    },
    get conversations() {
      return `${this.url}/conversations`;
    },
    get ads() {
      return `${this.url}/offers`;
    },
    get locations() {
      return `${this.baseUrlData}/${this.apiVersionData}/venues`;
    },
    get events() {
      return `${this.baseUrlData}/${this.apiVersionData}/events`;
    },
    get tags() {
      return `${this.baseUrlData}/${this.apiVersionData}/tags`;
    },
  };

  // {8,100}           - Assert password is between 8 and 100 characters
  // (?=.*[0-9])       - Assert a string has at least one number
  // /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/
  public static regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    strongPassword: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,100}$/,
  };

  public static validation = {
    passwordMinLength: 8,
  };

  public static status = {
    unprocessableEntity: 422,
    unauthorized: 401,
  };

  public static colors = {
    primary: pStyle.getPropertyValue(`--ion-color-primary`),
    secondary: pStyle.getPropertyValue(`--ion-color-secondary`),
    danger: pStyle.getPropertyValue(`--ion-color-danger`),
    light: pStyle.getPropertyValue(`--ion-color-light`),
    medium: pStyle.getPropertyValue(`--ion-color-medium`),
    dark: pStyle.getPropertyValue(`--ion-color-dark`),
  };

  public static imageUploadOptions: any = {
    quality: 80,
    targetWidth: 1024,
    targetHeight: 1024,
  };

  public static statusBarSettings = {
    style: 'light', // works for iOS | optional | default = dark text (other option: 'light')
    background: C.colors.primary, // works for Android and iOS (if overlaysWebview is false)
    overlaysWebview: true, // if true, status bar background is transparent on iOS
  };

  public static imageSizes: any = {
    preload: 12,
    preview: 120,
    large: 750,
  };

  public static imageFallback: any = {
    default: {
      large: './assets/img/default.png',
      preload: './assets/img/default-preload.png',
    },
    restaurant: {
      large: './assets/img/restaurant.jpg',
      preload: './assets/img/restaurant-preload.jpg',
    },
  };

  public static facebook = {
    page: 'https://www.facebook.com/prototype.berlin/',
  };

  public static google = {
    geocoding: {
      key: 'AIzaSyBWofL-OT0ZZfh5sFfhNvRwHQI2b_QSEBQ',
    },
    maps: {
      key: 'AIzaSyBdcFMydB2OhLucCDSIt9GvxzvqB9TzBhg',
    },
  };

  /**
   * @param {{deviceMemory:number}} navigator
   */
  public static isLowEndDevice(): boolean {
    const DEVICE_MEMORY = 2;

    return navigator.deviceMemory && navigator.deviceMemory <= DEVICE_MEMORY;
  }
}
