import { UserService } from './../../user/shared/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { ConversationService } from 'src/app/conversation/shared/conversation.service';
import { ConversationModel } from 'src/app/conversation/shared/conversation.model';
import { MessageService, Messages } from 'src/app/conversation/shared/message.service';
import { AuthService } from 'src/app/auth/shared/auth.service';

@HideSplash()
@Component({
  selector: 'page-conversation-detail',
  templateUrl: './conversation-detail.page.html',
  styleUrls: ['./conversation-detail.page.scss'],
})
export class ConversationDetailPage implements OnInit {
  public conversationId: string;
  public conversation: ConversationModel;
  public messages: Messages;
  public messageForm: FormGroup;
  public isLoading = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private conversationService: ConversationService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  public ngOnInit() {
    this.conversationId = this.activatedRoute.snapshot.params.id;

    this.conversationService.getConversationById(this.conversationId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((conversation) => {
        this.conversation = conversation;
      });

    this.messageService.getMessagesByConversation(this.conversationId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public messageFormIsValid() {
    return this.messageForm.valid;
  }

  public async submit() {
    if (!this.messageFormIsValid) { return; }

    this.isLoading = true;

    try {
      await this.messageService.createNewMessage(this.conversationId, this.messageForm.value.content);

      this.messageForm.reset();

      this.isLoading = false;
    } catch (error) {
      console.error(error);

      this.isLoading = false;
    }
  }
}
