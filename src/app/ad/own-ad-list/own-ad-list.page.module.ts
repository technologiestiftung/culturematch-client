import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnAdListPage } from './own-ad-list.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OwnAdListPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [OwnAdListPage],
})
// tslint:disable-next-line
export class OwnAdListPageModule {}