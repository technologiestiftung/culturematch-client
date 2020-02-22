import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConversationDetailPage } from './conversation-detail.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ConversationDetailPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [ConversationDetailPage],
})
// tslint:disable-next-line
export class ConversationDetailPageModule {}