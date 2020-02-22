import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { AdModel } from '../shared/ad.model';
import { AdService, Ads } from '../shared/ad.service';

@HideSplash()
@Component({
  selector: 'page-own-ad-list',
  templateUrl: './own-ad-list.page.html',
  styleUrls: ['./own-ad-list.page.scss'],
})
export class OwnAdListPage implements OnInit {
  public ads: Ads;

  private ngUnsubscribe: Subject<any> = new Subject();
  private infiniteScrollEvent: any;
  
  constructor(
    private adService: AdService,
    private router: Router,
  ) { }

  public ngOnInit() {
    this.adService.getOwnAds()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((ads) => {
        this.ads = ads;

        this.completeInfiniteScroll();
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public loadMore(event: any) {
    this.infiniteScrollEvent = event;

    if (!this.ads.meta.hasMore) {
      this.completeInfiniteScroll();

      return;
    }

    this.adService.getMoreOwnAds();
  }

  public trackByFunction(index: number, item: any) {
    return item ? item.id : index;
  }

  private completeInfiniteScroll() {
    if (this.infiniteScrollEvent) {
      this.infiniteScrollEvent.target.complete();
      this.infiniteScrollEvent = null;
    }
  }
}
