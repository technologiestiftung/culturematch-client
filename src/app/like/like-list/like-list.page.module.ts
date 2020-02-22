import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LikeListPage } from './like-list.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LikeListPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [LikeListPage],
})
// tslint:disable-next-line
export class LikeListPageModule {}