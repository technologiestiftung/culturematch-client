import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { LikeService, LikeStats } from 'src/app/like/shared/like.service';
import { UserService } from 'src/app/user/shared/user.service';

@Component({
  selector: 'proto-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss'],
})
export class LikeComponent implements OnInit {
  @Input() public entityId: string;
  @Input() public entityType: string;
  @Input() public label = '';

  public like: LikeStats;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private alertController: AlertController,
    private likeService: LikeService,
    private translate: TranslateService,
    private userService: UserService,
  ) { }

  public ngOnInit() { }

  public ngOnChanges() {
    if (!this.entityId) { return; }

    this.likeService.getLikeStatsById(this.entityId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((likes) => {
        this.like = likes;
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public async toggleLike(ev: Event) {
    ev.stopPropagation();

    if (!this.userService.getCurrentUser()) {
      return this.showUnauthorizedAlert();
    }

    try {
      if (!this.like.liked) {
        await this.likeService.likeEntity(this.entityId, this.entityType);

        return;
      }

      await this.likeService.revokeLike(this.entityId, this.like.likeId);
    } catch (error) {
      console.error(error);
    }
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
