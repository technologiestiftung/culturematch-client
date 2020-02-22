import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { C } from 'src/app/@shared/constants';
import { StorageService } from 'src/app/@core/storage.service';

const STATUS_UNAUTHORIZED = 401;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.indexOf(C.urls.url) > -1 && request.url.indexOf('login') === -1) {
      if (this.storage.get('accessToken')) {
        const accessToken = this.storage.get('accessToken');
        request = request.clone({ headers: request.headers.set('Authorization', `${accessToken.id}`) });
      }

      return next.handle(request).pipe(catchError((error, caught) => {
        this.handleAuthError(error);

        return of(error);
      }) as any);
    }

    return next.handle(request);
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === STATUS_UNAUTHORIZED) {
      this.storage.remove('accessToken');
      this.storage.remove('user');
      this.router.navigate([`/`]).catch();

      return of(error.message);
    }

    throw error;
  }
}
