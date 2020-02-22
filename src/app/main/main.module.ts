import { NgModule } from '@angular/core';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  imports: [
    MainRoutingModule,
    SharedModule,
  ],
  declarations: [MainComponent],
})
// tslint:disable-next-line
export class MainModule {}
