import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'page-more-menu',
  templateUrl: './more-menu.page.html',
  styleUrls: ['./more-menu.page.scss'],
})
export class MoreMenuPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private navController: NavController,
    private translate: TranslateService,
  ) { }

  public ngOnInit() {}

  public async logout() {
    const confirmation = await this.confirmLogout();

    if (!confirmation) { return; }

    this.authService.logout().then(() => {
      this.navController.navigateRoot(['/login']).then(() => {
        window.location.reload();
      }).catch();
    }).catch();
  }

  private confirmLogout() {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: this.translate.instant('ALERT.LOGOUT.HEADER'),
        message: this.translate.instant('ALERT.LOGOUT.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.CANCEL'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              return resolve(false);
            },
          }, {
            text: this.translate.instant('BUTTON.OK'),
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }
}
