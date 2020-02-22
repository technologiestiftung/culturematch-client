import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { C } from 'src/app/@shared/constants';
import { ConversationModel, ConversationSource } from './conversation.model';
import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { UserService } from 'src/app/user/shared/user.service';

export interface Conversations extends ProtoItems {
  items: ConversationModel[],
}

interface ConversationsByIdStore {
  [key: string]: ConversationModel,
}

interface ConversationsById {
  [key: string]: BehaviorSubject<ConversationModel>,
}

const DEFAULT_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private conversationsStore: Conversations = null;
  private conversations: BehaviorSubject<Conversations> = new BehaviorSubject(null);
  private conversationsByIdStore: ConversationsByIdStore = {};
  private conversationsById: ConversationsById = {};

  constructor(
    private http: HttpClient,
    private userServie: UserService,
  ) { }

  public getConversationById(conversationId: string): Observable<ConversationModel> {
    if (this.conversationsById[conversationId]) {
      return this.conversationsById[conversationId].asObservable();
    }

    return this.loadConversationById(conversationId).pipe(mergeMap(() => {
      return this.conversationsById[conversationId].asObservable();
    }));
  }

  public refreshConversationById(conversationId: string) {
    this.loadConversationById(conversationId).toPromise().catch((error) => {
      console.error(`Error refreshing conversation ${conversationId}`);
      console.error(error);
    });
  }

  public getConversations(): Observable<Conversations> {
    this.conversationsStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
    this.conversations.next(this.conversationsStore);

    this.loadConversations().toPromise().catch((error) => {
      this.conversationsStore.meta.error = error;
      this.conversationsStore.meta.isLoading = false;

      this.conversations.next(this.conversationsStore);
    });

    return this.conversations.asObservable();
  }

  public getMoreConversations() {
    this.conversationsStore.meta.isLoading = true;
    this.conversations.next(this.conversationsStore);

    this.loadConversations(this.conversationsStore.items.length).toPromise().catch((error) => {
      this.conversationsStore.meta.error = error;
      this.conversationsStore.meta.isLoading = false;

      this.conversations.next(this.conversationsStore);
    });
  }

  public refreshConversations() {
    if (!this.conversationsStore) { return; }

    this.conversationsStore.meta.isLoading = true;
    this.conversations.next(this.conversationsStore);

    this.loadConversations().toPromise().catch((error) => {
      this.conversationsStore.meta.error = error;
      this.conversationsStore.meta.isLoading = false;

      this.conversations.next(this.conversationsStore);
    });
  }

  public startNewConversation(adId: string, message: string) {
    const url = `${C.urls.conversations}/start`;

    return this.http.post<ConversationSource>(url, { adId, message })
      .pipe(
        map((conversation) => new ConversationModel(conversation)),
        tap(() => {
          this.refreshConversations();
        }),
      )
      .toPromise();
  }

  private loadConversations(skip = 0, limit = DEFAULT_LIMIT) {
    const currentUser = this.userServie.getCurrentUser();

    const filter = {
      skip: skip,
      limit: limit,
      include: ['ad', 'owner', 'prospect', 'lastMessage'],
    };

    const url = `${C.urls.conversations}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    let totalCount = 0;

    return this.http.get(url, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((conversations: ConversationSource[]) => conversations.map((conversation) => new ConversationModel(conversation, currentUser.id))),
        tap((conversations: ConversationModel[]) => {
          const items = skip ? this.conversationsStore.items.concat(conversations) : conversations;
          const hasMore = items.length < totalCount;
          this.conversationsStore = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

          this.conversations.next(this.conversationsStore);
        }),
        tap((conversations) => {
          this.updateConversationsById(conversations);
        }),
      );
  }

  private loadConversationById(conversationId: string) {
    const currentUser = this.userServie.getCurrentUser();

    const filter = {
      include: ['ad', 'owner', 'prospect', 'lastMessage'],
    };

    const url = `${C.urls.conversations}/${conversationId}?filter=${encodeURIComponent(JSON.stringify(filter))}`;

    return this.http.get<ConversationSource>(url)
      .pipe(
        map((conversation) => new ConversationModel(conversation, currentUser.id)),
        tap((conversation) => {
          this.conversationsByIdStore[conversation.id] = conversation;

          if (!this.conversationsById[conversation.id]) {
            this.conversationsById[conversation.id] = new BehaviorSubject(null);
          }

          this.conversationsById[conversation.id].next(this.conversationsByIdStore[conversation.id]);
        }),
      );
  }

  private updateConversationsById(conversations: ConversationModel[]) {
    conversations.forEach((conversation) => {
      this.conversationsByIdStore[conversation.id] = conversation;
      
      if (!this.conversationsById[conversation.id]) {
        this.conversationsById[conversation.id] = new BehaviorSubject(null);
      }

      this.conversationsById[conversation.id].next(this.conversationsByIdStore[conversation.id]);
    });
  }
}
