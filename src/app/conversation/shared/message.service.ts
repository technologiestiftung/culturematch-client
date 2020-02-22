import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { C } from 'src/app/@shared/constants';
import { MessageModel, MessageSource } from 'src/app/conversation/shared/message.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';

export interface Messages extends ProtoItems {
  items: MessageModel[],
}

interface MessagesByConversationStore {
  [key: string]: Messages,
}

interface MessagesByConversation {
  [key: string]: BehaviorSubject<Messages>,
}

const DEFAULT_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesByConversationStore: MessagesByConversationStore = {};
  private messagesByConversation: MessagesByConversation = {};

  constructor(
    private http: HttpClient,
  ) { }

  public getMessagesByConversation(conversationId: string): Observable<Messages> {
    if (this.messagesByConversation[conversationId]) {
      return this.messagesByConversation[conversationId].asObservable();
    }

    return this.loadMessagesByConversation(conversationId).pipe(mergeMap(() => {
      return this.messagesByConversation[conversationId].asObservable();
    }));
  }

  public getMoreMessagesByConversation(conversationId: string) {
    this.messagesByConversationStore[conversationId].meta.isLoading = true;
    this.messagesByConversation[conversationId].next(this.messagesByConversationStore[conversationId]);

    this.loadMessagesByConversation(conversationId, this.messagesByConversationStore[conversationId].items.length).toPromise().catch((error) => {
      this.messagesByConversationStore[conversationId].meta.error = error;
      this.messagesByConversationStore[conversationId].meta.isLoading = false;

      this.messagesByConversation[conversationId].next(this.messagesByConversationStore[conversationId]);
    });
  }

  public createNewMessage(conversationId: string, content: string) {
    const url = `${C.urls.conversations}/${conversationId}/messages`;

    return this.http.post<MessageSource>(url, { conversationId, content })
      .pipe(
        map((message) => new MessageModel(message)),
        tap((message) => {
          this.messagesByConversationStore[conversationId].items.unshift(message);
          this.messagesByConversationStore[conversationId].meta.totalCount++;

          this.messagesByConversation[conversationId].next(this.messagesByConversationStore[conversationId]);
        }),
      )
      .toPromise();
  }

  private loadMessagesByConversation(conversationId: string, skip = 0, limit = DEFAULT_LIMIT) {
    const filter = {
      skip: skip,
      limit: limit,
    };

    const url = `${C.urls.conversations}/${conversationId}/messages?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((messages: MessageSource[]) => messages.map((conversation) => new MessageModel(conversation))),
        tap((messages) => {
          const items = skip ? this.messagesByConversationStore[conversationId].items.concat(messages) : messages;
          const hasMore = items.length < totalCount;
          this.messagesByConversationStore[conversationId] = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

          if (!this.messagesByConversation[conversationId]) {
            this.messagesByConversation[conversationId] = new BehaviorSubject(null);
          }

          this.messagesByConversation[conversationId].next(this.messagesByConversationStore[conversationId]);
        }),
      );
  }
}
