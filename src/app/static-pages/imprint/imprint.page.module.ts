import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImprintPage } from './imprint.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ImprintPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [ImprintPage],
})
// tslint:disable-next-line
export class ImprintPageModule {}