
import { MenuPopoverComponent } from './@shared/menu-popover/menu-popover.component';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicGestureConfig } from './@shared/ionic-gesture-config';

import { AdEditPageModule } from 'src/app/ad/ad-edit/ad-edit.page.module';
import { AgreementPageModule } from 'src/app/legal/agreement/agreement.page.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './@core/core.module';
import { EventFilterPageModule } from 'src/app/event/event-filter/event-filter.page.module';
import { LocationFilterPageModule } from 'src/app/location/location-filter/location-filter.page.module';
import { NewMessagePageModule } from 'src/app/conversation/new-message/new-message.page.module';
import { NotFoundPageModule } from 'src/app/static-pages/not-found/not-found.page.module';
import { SharedModule } from './@shared/shared.module';

// --- Factories ---------------------------------------------------------------
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const IONIC_CONFIG = {
  animated: false,
  inputShims: true,
  rippleEffect: false,
};

@NgModule({
  declarations: [AppComponent, MenuPopoverComponent],
  entryComponents: [MenuPopoverComponent],
  imports: [
    /**/AppRoutingModule, // AppRoutingModule has to be imported first
    AdEditPageModule,
    AgreementPageModule,
    BrowserModule,
    CoreModule,
    EventFilterPageModule,
    HttpClientModule,
    IonicModule.forRoot(IONIC_CONFIG),
    NewMessagePageModule,
    NotFoundPageModule,
    LocationFilterPageModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig,
    },
  ],
  bootstrap: [AppComponent],
})
// tslint:disable-next-line
export class AppModule {}
