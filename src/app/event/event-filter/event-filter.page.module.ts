import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventFilterPage } from './event-filter.page';
import { SharedModule } from 'src/app/@shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';

const routes: Routes = [
  {
    path: '',
    component: EventFilterPage,
  },
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [EventFilterPage],
  providers: [
    // TODO: make this work for multi language
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  ],
})
// tslint:disable-next-line
export class EventFilterPageModule {}
