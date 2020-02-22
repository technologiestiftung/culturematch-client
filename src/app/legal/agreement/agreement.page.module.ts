import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgreementPage } from './agreement.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AgreementPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [AgreementPage],
})
// tslint:disable-next-line
export class AgreementPageModule {}