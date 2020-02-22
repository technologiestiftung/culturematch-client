import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdEditPage } from './ad-edit.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AdEditPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [AdEditPage],
})
// tslint:disable-next-line
export class AdEditPageModule {}