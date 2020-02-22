import * as moment from 'moment';

import { C } from './constants';

export interface ImageSource {
  large: string
  original?: string,
  preload?: string,
  preview?: string,
  largeOriginalRatio?: string,
}

export interface GeoPoint {
  lat: number,
  lng: number,
}

 /* tslint:disable-next-line */
export class AppHelper {

  public static stripHtml(content: string) {
    if (!content) { return '' };

    const tmp = document.implementation.createHTMLDocument('New').body;
    tmp.innerHTML = content;

    return tmp.textContent || tmp.innerText || '';
  }

  public static harmonizeLoopbackFilter(filter: any) {
    if (filter.where && !filter.where.and) {
      filter.where = {
        and: [
          filter.where,
        ],
      };
    }

    if (!filter.where) {
      filter.where = {
        and: [],
      };
    }

    return filter;
  }

  public  static isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  public static formatDate(date: string, dateFormat: string): string {
    if (dateFormat === 'fromNow') {
      return moment(date).fromNow();
    }

    return moment(date).format(dateFormat);
  }

  // http://gis.stackexchange.com/questions/25877/how-to-generate-random-locations-nearby-my-location
  public static getRandomLatLngNearby(original_lat: number, original_lng: number) {
    const radius = 0.08985; // = 5 km
    const double = 2;

    const y0 = original_lat;
    const x0 = original_lng;
    const u = Math.random();
    const v = Math.random();
    const w = radius * Math.sqrt(u);
    const t = double * Math.PI * v;
    const x = w * Math.cos(t);
    const y1 = w * Math.sin(t);
    const x1 = x / Math.cos(y0);

    return { lat: y0 + y1, lng: x0 + x1 };
  }

  public static urlParamsFromObject(obj: any) {
    let str = '';
    for (const key in obj) {
      if (str != '') { str += '&'; }
      str += key + '=' + encodeURIComponent(obj[key]);
    }

    return str;
  }

  public static objectFromUrlParams(params: any) {
    const obj: any = {};

    const parts = params.split('&');

    parts.forEach((part: string) => {
      const key = part.split('=')[0];
      const value = part.split('=')[1];

      obj[key] = value;
    });

    return obj;
  }

  public static getImage(id: string, width?: number, height?: number | 'auto'): string {
    if (!id) {
      return this.getFallbackImage('fallback_default');
    }
    if (id.includes('fallback')) {
      return this.getFallbackImage(id, width);
    }
    if (!width) {
      return `${C.urls.files}/${id}/download`;
    }
    if (!height) {
      return `${C.urls.files}/${id}/download?square=${width}`;
    }
    if (height === 'auto') {
      return `${C.urls.files}/${id}/download?width=${width}`;
    }

    return `${C.urls.files}/${id}/download?width=${width}&height=${height}`;
  }

  public static sortByTitle(a: any, b: any) {
    if (a.title < b.title) { return -1; }
    if (a.title > b.title) { return 1; }

    return 0;
  }

  private static getFallbackImage(id: string, width?: number): string {
    let key: string = id.substring(id.indexOf('_') + 1);

    if (!key || !C.imageFallback[key]) {
      key = 'default';
    }
    if (!width || width > C.imageSizes.preload) {
      return C.imageFallback[key].large;
    }

    return C.imageFallback[key].preload;
  }
}
