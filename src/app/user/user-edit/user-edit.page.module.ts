import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditPage } from './user-edit.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UserEditPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [UserEditPage],
})
// tslint:disable-next-line
export class UserEditPageModule {}