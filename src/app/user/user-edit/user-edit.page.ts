import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { C } from 'src/app/@shared/constants';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { ToastService } from 'src/app/@core/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/user/shared/user.service';

@HideSplash()
@Component({
  selector: 'page-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  public editForm: FormGroup;
  public passwordEditForm: FormGroup;

  public passwordMinLength = C.validation.passwordMinLength;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.editForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(C.regex.email), Validators.required])],
    });

    this.passwordEditForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength), Validators.required])],
      passwordConfirmation: ['', Validators.compose([Validators.minLength(C.validation.passwordMinLength), Validators.required])],
    });
  }

  public async ngOnInit() {
    try {
      const user = await this.userService.refreshCurrentUser();

      this.editForm.patchValue(user);
    } catch (error) {
      console.error(error);
    }
  }

  public editFormIsValid() {
    return this.editForm.valid;
  }

  public passwordEditFormIsValid() {
    if (this.passwordEditForm.value.password && this.passwordEditForm.value.password !== this.passwordEditForm.value.passwordConfirmation) {
      return false;
    }

    return this.passwordEditForm.valid;
  }

  public async saveUser() {
    if (!this.editFormIsValid()) { return; }

    try {
      await this.userService.updateUserAttributes(this.editForm.value);

      this.toastService.show(this.translate.instant('TOAST.SAVE_SUCCESS.MESSAGE')).catch();
    } catch (error) {
      console.error(error);
      this.toastService.show(this.translate.instant('TOAST.SAVE_ERROR.MESSAGE'), false).catch();
    }
  }

  public async saveNewPassword() {
    if (!this.passwordEditFormIsValid()) { return; }

    try {
      await this.userService.updateUserAttributes(this.passwordEditForm.value);

      this.toastService.show(this.translate.instant('TOAST.SAVE_SUCCESS.MESSAGE')).catch();

      this.editForm.reset();
    } catch (error) {
      console.error(error);
      this.toastService.show(this.translate.instant('TOAST.SAVE_ERROR.MESSAGE'), false).catch();
    }
  }
}
