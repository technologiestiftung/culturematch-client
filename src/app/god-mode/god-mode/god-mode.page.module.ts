import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { GodModePage } from './god-mode.page';
import { SharedModule } from 'src/app/@shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: GodModePage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgxJsonViewerModule,
  ],
  declarations: [GodModePage],
})
// tslint:disable-next-line
export class GodModePageModule {}