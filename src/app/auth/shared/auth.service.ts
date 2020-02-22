import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { C } from 'src/app/@shared/constants';
import { StorageService } from 'src/app/@core/storage.service';
import { UserService } from 'src/app/user/shared/user.service';

export interface LoginData {
  email: string,
  password: string,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private userService: UserService,
  ) { }

  public getAccessToken() {
    return this.storage.get('accessToken', null);
  }

  public isAuthenticated() {
    return !!this.getAccessToken();
  }

  public register(registerData: any) {
    const url = `${C.urls.url}/users`;

    return new Promise((resolve, reject) => {
      this.http.post(url, registerData).subscribe(() => {
        const loginData = {
          email: registerData.email,
          password: registerData.password,
        }

        this.login(loginData).then((accessToken) => {
          resolve(accessToken);
        }).catch();
      }, (error) => {
        reject(error);
      });
    });
  }

  public async login(loginData: any) {
    try {
      const url = `${C.urls.url}/users/login?include=user`;

      const response = await this.http.post<any>(url, loginData).toPromise();
      const accessToken: any = Object.assign({}, response);
      const user = response.user;

      delete accessToken.user;

      this.userService.setCurrentUser(response.user);
      this.storage.set('accessToken', accessToken);

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public logout() {
    const url = `${C.urls.users}/logout`;

    return this.http.post(url, {})
      .pipe(
        tap(() => {
          this.userService.removeCurrentUser();
          this.storage.remove('accessToken');
        }),
      )
      .toPromise();
  }

  public requestPasswordReset(email: string) {
    const url = `${C.urls.users}/reset`;

    return this.http.post(url, { email: email })
      .toPromise();
  }

  public resetPassword(token: string, newPassword: string) {
    const url = `${C.urls.users}/reset-password`;

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.post(url, { newPassword: newPassword }, { headers: headers })
      .toPromise();
  }
}
