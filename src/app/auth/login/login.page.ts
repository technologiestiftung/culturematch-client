import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { ToastService } from '../../@core/toast.service';
import { TranslateService } from '@ngx-translate/core';

@HideSplash()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
      password: ['', Validators.required],
    });
  }

  public ngOnInit() { }

  public async login() {
    if (!this.loginForm.valid || this.isLoading) { return; }

    this.isLoading = true;

    try {
      await this.authService.login({
        email: this.loginForm.get('email').value.toLowerCase(),
        password: this.loginForm.get('password').value,
      });

      this.onLoginSucceeded();
    } catch (error) {
      this.isLoading = false;
      console.error(error);

      return this.onLoginFailed();
    }
  }

  public formIsValid() {
    return this.loginForm.valid;
  }

  private onLoginSucceeded() {
    this.isLoading = false;

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.returnUrl) {
        this.router.navigate([queryParams.returnUrl]).catch();

        return;
      }

      this.router.navigate(['/']).catch();
    });
  }

  private onLoginFailed() {
    const message = this.translate.instant('TOAST.LOGIN_ERROR.MESSAGE');
    this.toastService.show(message, false).catch();
  }
}
