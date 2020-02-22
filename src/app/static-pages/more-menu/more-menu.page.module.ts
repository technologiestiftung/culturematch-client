import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreMenuPage } from './more-menu.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MoreMenuPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [MoreMenuPage],
})
// tslint:disable-next-line
export class MoreMenuPageModule {}