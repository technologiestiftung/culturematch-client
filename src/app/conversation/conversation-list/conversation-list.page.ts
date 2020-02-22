import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { ConversationModel } from '../shared/conversation.model';
import { ConversationService, Conversations } from '../shared/conversation.service';

@HideSplash()
@Component({
  selector: 'page-conversation-list',
  templateUrl: './conversation-list.page.html',
  styleUrls: ['./conversation-list.page.scss'],
})
export class ConversationListPage implements OnInit {
  public conversations: Conversations;

  private ngUnsubscribe: Subject<any> = new Subject();
  private infiniteScrollEvent: any;

  constructor(
    private conversationService: ConversationService,
    private router: Router,
  ) { }

  public ngOnInit() {
    this.conversationService.getConversations()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((conversations) => {
        this.conversations = conversations;

        this.completeInfiniteScroll();
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public refresh(event: any) {
    this.conversationService.refreshConversations();
  }

  public loadMore(event: any) {
    this.infiniteScrollEvent = event;

    if (!this.conversations.meta.hasMore) {
      this.completeInfiniteScroll();

      return;
    }

    this.conversationService.getMoreConversations();
  }

  public openDetailPage(conversation: ConversationModel) {
    if (!conversation) { return; }

    this.router.navigate(['/conversations', conversation.id]).catch();
  }

  public trackByFunction(index: number, item: any) {
    return item ? item.id : index;
  }

  private completeInfiniteScroll() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
      this.infiniteScrollEvent = null;
    }
  }
}
