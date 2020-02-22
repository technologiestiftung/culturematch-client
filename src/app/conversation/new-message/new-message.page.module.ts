import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewMessagePage } from './new-message.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NewMessagePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [NewMessagePage],
})
// tslint:disable-next-line
export class NewMessagePageModule {}