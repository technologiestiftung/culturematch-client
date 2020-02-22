import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Component, OnInit, Directive, HostListener } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'proto-menu-popover',
  templateUrl: './menu-popover.component.html',
  styleUrls: ['./menu-popover.component.scss'],
})
export class MenuPopoverComponent implements OnInit {

  constructor(public authService: AuthService,
              private popoverController: PopoverController,
              private router: Router) { }

  public ngOnInit() { }

  public async logout() {
    await this.authService.logout()
    await this.navigateTo('/');
  }

  public async navigateTo(route: string) {
    await this.router.navigate([route]);
    await this.dismiss();
  }

  public async dismiss() {
    await this.popoverController.dismiss();
  }
}