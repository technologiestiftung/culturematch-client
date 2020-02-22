import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { AdModel } from 'src/app/ad/shared/ad.model';
import { ConversationService } from 'src/app/conversation/shared/conversation.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'page-new-message',
  templateUrl: './new-message.page.html',
  styleUrls: ['./new-message.page.scss'],
})
export class NewMessagePage implements OnInit {
  @Input() public ad: AdModel;

  public messageForm: FormGroup;
  public isLoading = false;

  constructor(
    private conversationService: ConversationService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  public ngOnInit() { }

  public messageFormIsValid() {
    return this.messageForm.valid;
  }

  public async submit() {
    if (!this.messageFormIsValid) { return; }

    this.isLoading = true;

    try {
      await this.conversationService.startNewConversation(this.ad.id, this.messageForm.value.message);

      this.isLoading = false;

      this.modalController.dismiss().catch();
    } catch (error) {
      console.error(error);

      this.isLoading = false;
    }
  }
}
