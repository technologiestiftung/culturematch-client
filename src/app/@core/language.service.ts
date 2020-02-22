import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { C } from 'src/app/@shared/constants';
import { StorageService } from 'src/app/@core/storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private storage: StorageService,
    private translate: TranslateService,
  ) { }

  public initialize() {
    const storedLanguage = this.getStoredLanguage();

    const browserLanguage = navigator.language.split('-')[0];

    let language = storedLanguage || C.defaultLanguage;

    if (!storedLanguage && C.availableLanguages.includes(browserLanguage)) {
      language = browserLanguage;
      this.storage.set('language', browserLanguage);
    }

    this.translate.setDefaultLang(C.defaultLanguage);
    try {
      this.translate.use(language);
      this.setMomentLanguage(language);
    } catch (error) {
      console.error('Error setting language', error);
    } finally {
      this.translate.getTranslation(browserLanguage);
    }
  }

  public changeLanguage(newLanguage: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!C.availableLanguages.includes(newLanguage)) {
        return reject(`ERROR: '${newLanguage}' is not a language that is available.`);
      }

      this.storage.set('language', newLanguage);
      this.translate.use(newLanguage);
      this.setMomentLanguage(newLanguage);

      resolve();
    });
  }

  public getTranslation(translatableString: string) {
    this.translate.getTranslation(this.getLanguage());

    return this.translate.get(translatableString);
  }

  public getLanguage(): string {
    const storedLanguage = this.getStoredLanguage();

    const browserLanguage = navigator.language.split('-')[0];

    let language = storedLanguage || C.defaultLanguage;

    if (!storedLanguage && C.availableLanguages.includes(browserLanguage)) {
      language = browserLanguage;
    }

    return language;
  }

  private getStoredLanguage() {
    const storedLanguage = this.storage.get('language');

    if (!storedLanguage || !C.availableLanguages.includes(storedLanguage)) {
      this.storage.remove('language');

      return;
    }

    return storedLanguage;
  }

  private setMomentLanguage(language = C.defaultLanguage) {
    moment.locale(language);
  }
}
