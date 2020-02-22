import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { MenuPopoverComponent } from 'src/app/@shared/menu-popover/menu-popover.component';
import { PopoverController, ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { EventService } from 'src/app/event/shared/event.service';
import { AuthService } from 'src/app/auth/shared/auth.service';

const KEYCODE_ENTER = 13;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
// tslint:disable-next-line
export class MainComponent implements OnInit {

  public searchValue: string;
  public searchbarVisibleOnMobile = false;
  public searchResultsLoading = false;
  public activeRoute: string;

  private readonly ngUnsubscribe = new Subject();

  constructor(
    public eventService: EventService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public navController: NavController,
    public router: Router,
    public location: Location,
    public authService: AuthService) {
  }

  public ngOnInit() { 
    this.router.events
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    })
  } 

  public goBack() {
    return this.location.back();
  }

  public async presentMenuPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      event: ev,
      translucent: true,
      mode: 'md',
      cssClass: 'popover',
    });

    return await popover.present();
  }

  public onKeyUp(ev: any) {
    if (ev.keyCode !== KEYCODE_ENTER) { return; }

    requestAnimationFrame(() => {
      ev.target.blur();

      return this.search();
    });
  }

  private ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private search() {
    this.searchResultsLoading = true;
    if (!this.searchValue) {
      return this.eventService.clearSearch();
    }

    this.eventService.searchEvents({ q: this.searchValue });

    if (this.router.url === '/events') { return; }
    this.navController.navigateForward('/events').catch();
  }

}
