import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { StorageService } from 'src/app/@core/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: StorageService,
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) { return true; }

    if (!this.storage.get('hasOnboardingRun')) {
      this.router.navigateByUrl('/onboarding').catch();

      return false;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }).catch();
    
    return false;
  }
}
