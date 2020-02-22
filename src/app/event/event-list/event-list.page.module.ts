import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventListPage } from './event-list.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EventListPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [EventListPage],
})
// tslint:disable-next-line
export class EventListPageModule {}