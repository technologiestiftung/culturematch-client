import { Injectable } from '@angular/core';
import { C } from 'src/app/@shared/constants';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { map, tap } from 'rxjs/operators';

import { StorageService } from 'src/app/@core/storage.service';
import { UserModel, UserSource } from './user.model';

interface UserDetailsStore {
  [key: string]: UserModel,
};

interface UserDetails {
  [key: string]: BehaviorSubject<UserModel>,
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public currentUser: BehaviorSubject<UserModel | null> = new BehaviorSubject(null);
  private userDetailsStore: UserDetailsStore = {};
  private userDetails: UserDetails = {};

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {
    const currentUser = this.getCurrentUser();

    if (!currentUser) { return; }
    this.currentUser.next(currentUser);
  }

  public getUserDetail(userId: string): Observable<UserModel> {
    if (this.userDetails[userId]) {
      this.loadUserDetail(userId).toPromise().catch();

      return this.userDetails[userId].asObservable();
    }

    return this.loadUserDetail(userId).pipe(
      concatMap(() => {
        return this.userDetails[userId].asObservable();
      }),
    );
  }

  public refreshCurrentUser(): Promise<UserModel> {
    const currentUser = this.getCurrentUser();

    if (!currentUser) { return; }

    const url = `${C.urls.users}/${currentUser.id}`;

    return this.http.get<UserSource>(url)
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
        }),
        map((user) => new UserModel(user)),
      )
      .toPromise();
  }

  public getCurrentUser(): UserModel {
    const user: UserSource = this.storage.get('user');
    if (user) {
      return new UserModel(user);
    }

    return null;
  }

  public getCurrentUserSource(): UserSource {
    return this.storage.get('user');
  }

  public setCurrentUser(user: UserSource) {
    this.storage.set('user', user);
    this.currentUser.next(new UserModel(user));
  }

  public removeCurrentUser() {
    this.storage.remove('user');
    this.currentUser.next(null);
  }

  public getUserById(id: string): Observable<UserModel> {
    const url = `${C.urls.users}/${id}/`;

    return this.http.get<UserSource>(url)
      .pipe(
        map((user: UserSource) => new UserModel(user)),
      );
  }

  public updateUserAttributes(attributes: any) {
    const user = this.getCurrentUser();
    if (!user) { return Promise.reject('No user logged in yet'); }
    const url = `${C.urls.url}/users/${user.id}/`;

    return this.http.patch<UserSource>(url, attributes)
      .pipe(
        tap((user: UserSource) => {
          this.storage.set('user', user);
          this.currentUser.next(new UserModel(user));
        }),
        map((user: UserSource) => new UserModel(user)),
      )
      .toPromise();
  }

  public destroyCurrentUser() {
    const url = `${C.urls.users}/${this.getCurrentUser().id}`;

    return this.http.delete(url)
      .toPromise();
  }

  public blockUserById(blockedUserId: string): Promise<any> {
    const currentUser = this.getCurrentUser();

    const url = `${C.urls.users}/${currentUser.id}/blockedUsers`;

    const data = {
      blockedUserId: blockedUserId,
    };

    return this.http.post(url, data)
      .toPromise();
  }

  private loadUserDetail(userId: string): Observable<UserModel> {
    const url = `${C.urls.users}/${userId}`;

    return this.http.get(url)
      .pipe(
        tap((user: any) => {
          this.userDetailsStore[userId] = user;

          if (!this.userDetails[userId]) {
            this.userDetails[userId] = new BehaviorSubject(null);
          }
          
          this.userDetails[userId].next(this.userDetailsStore[userId]);
        }),
      );
  }
}
