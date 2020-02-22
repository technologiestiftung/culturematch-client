import { Component, OnInit, Input } from '@angular/core';

import { ConversationModel } from 'src/app/conversation/shared/conversation.model';
import { UserService } from 'src/app/user/shared/user.service';
import { UserModel } from 'src/app/user/shared/user.model';

@Component({
  selector: 'proto-conversation-preview',
  templateUrl: './conversation-preview.component.html',
  styleUrls: ['./conversation-preview.component.scss'],
})
export class ConversationPreviewComponent implements OnInit {
  @Input() public conversation: ConversationModel;

  public currentUser: UserModel;

  constructor(
    private userService: UserService,
  ) { }

  public ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }
}
