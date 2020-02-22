import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AdModel } from 'src/app/ad/shared/ad.model';
import { NewMessagePage } from 'src/app/conversation/new-message/new-message.page';
import { UserModel } from 'src/app/user/shared/user.model';
import { UserService } from 'src/app/user/shared/user.service';
import { AdEditPage } from 'src/app/ad/ad-edit/ad-edit.page';

@Component({
  selector: 'proto-ad-preview',
  templateUrl: './ad-preview.component.html',
  styleUrls: ['./ad-preview.component.scss'],
})
export class AdPreviewComponent implements OnInit {
  @Input() public ad: AdModel;

  public currentUser: UserModel;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private translate: TranslateService,
    private userService: UserService,
  ) { }

  public ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }

  public async openNewMessage() {
    if (!this.userService.getCurrentUser()) {
      return this.showUnauthorizedAlert();
    }

    const modal = await this.modalController.create({
      component: NewMessagePage,
      componentProps: {
        ad: this.ad,
      },
    });

    return await modal.present();
  }

  public async openAdEdit(event: CustomEvent) {
    const modal = await this.modalController.create({
      component: AdEditPage,
      componentProps: {
        ad: this.ad,
      },
    });

    return await modal.present();
  }

  private async showUnauthorizedAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERT.UNAUTHORIZED.HEADER'),
      message: this.translate.instant('ALERT.UNAUTHORIZED.MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          handler: () => { },
        },
      ],
    });

    await alert.present();
  }
}
