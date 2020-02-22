import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { ToastService } from '../../@core/toast.service';
import { TranslateService } from '@ngx-translate/core';

@HideSplash()
@Component({
  selector: 'page-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  public requestForm: FormGroup;
  public resetForm: FormGroup;
  public isLoading = false;
  public showRequestSuccessMessage = false;
  public showResetSuccessMessage = false;
  public token: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.requestForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
    });

    this.resetForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength), Validators.required])],
    });
  }

  public ngOnInit() {
    this.token = this.activatedRoute.snapshot.params.token;
  }

  public requestFormIsValid() {
    return this.requestForm.valid;
  }

  public resetFormIsValid() {
    return this.resetForm.valid;
  }

  public sendRequest() {
    if (!this.requestFormIsValid()) { return; }

    this.isLoading = true;

    this.authService.requestPasswordReset(this.requestForm.value.email).then(() => {
      this.isLoading = false;
      this.showRequestSuccessMessage = true;
    }).catch((error) => {
      console.error(error);
      this.onSubmitFailed(this.translate.instant('TOAST.EMAIL_NOT_FOUND.MESSAGE'));
      this.isLoading = false;
    });
  }

  public reset() {
    if (!this.resetFormIsValid()) { return; }

    this.isLoading = true;

    this.authService.resetPassword(this.token, this.resetForm.value.password).then(() => {
      this.isLoading = false;
      this.showResetSuccessMessage = true;
    }).catch((error) => {
      console.error(error);
      this.onSubmitFailed(this.translate.instant('TOAST.SAVE_ERROR.MESSAGE'));
      this.isLoading = false;
    });
  }

  private onSubmitFailed(message: string) {
    this.toastService.show(message, false).catch();
  }
}
