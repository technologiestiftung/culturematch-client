import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConversationListPage } from './conversation-list.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ConversationListPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [ConversationListPage],
})
// tslint:disable-next-line
export class ConversationListPageModule {}