import { EventDateComponent } from './../event/shared/event-date/event-date.component';
import { RouterModule } from '@angular/router';
import { EventPreviewComponent } from 'src/app/event/shared/event-preview/event-preview.component';
import { FilterPreviewComponent } from 'src/app/@shared/filter-preview/filter-preview.component';
import { FooterComponent } from 'src/app/@shared/footer/footer.component';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RelatedEventsComponent } from 'src/app/event/shared/related-events/related-events.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';

import { AdPreviewComponent } from 'src/app/ad/shared/ad-preview/ad-preview.component';
import { AppInfoComponent } from './app-info/app-info.component';
import { ConversationPreviewComponent } from 'src/app/conversation/shared/conversation-preview/conversation-preview.component';
import { HandleExternalLinksDirective } from './handle-external-links.directive';
import { HandleInternalLinksDirective } from './handle-internal-links.directive';
import { HandleKeyboardEventsDirective } from './handle-keyboard-events.directive';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { LikeComponent } from 'src/app/like/shared/like/like.component';
import { LocationPreviewComponent } from 'src/app/location/shared/location-preview/location-preview.component';
import { MatchEventPreviewComponent } from 'src/app/event/shared/match-event-preview/match-event-preview.component';
import { ProtoImageComponent } from './proto-image/proto-image.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';

@NgModule({
  declarations: [
    AdPreviewComponent,
    AppInfoComponent,
    ConversationPreviewComponent,
    EventPreviewComponent,
    EventDateComponent,
    HandleExternalLinksDirective,
    HandleInternalLinksDirective,
    HandleKeyboardEventsDirective,
    LanguageSwitchComponent,
    LikeComponent,
    LocationPreviewComponent,
    MatchEventPreviewComponent,
    ProtoImageComponent,
    RelatedEventsComponent,
    ShowHidePasswordComponent,
    FilterPreviewComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
  ],
  exports: [
    AdPreviewComponent,
    AppInfoComponent,
    ConversationPreviewComponent,
    CommonModule,
    EventPreviewComponent,
    EventDateComponent,
    FilterPreviewComponent,
    FooterComponent,
    FormsModule,
    HandleExternalLinksDirective,
    HandleInternalLinksDirective,
    HandleKeyboardEventsDirective,
    IonicModule,
    LanguageSwitchComponent,
    LikeComponent,
    LocationPreviewComponent,
    MatchEventPreviewComponent,
    MomentModule,
    ProtoImageComponent,
    ReactiveFormsModule,
    RelatedEventsComponent,
    ShowHidePasswordComponent,
    TranslateModule,
  ],
  entryComponents: [],
})
// tslint:disable-next-line
export class SharedModule { }
