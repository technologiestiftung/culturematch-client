import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GeolocationService } from 'src/app/@core/geolocation.service';
import { LikeService, Likes } from 'src/app/like/shared/like.service';
import { LikeModel } from 'src/app/like/shared/like.model';

@Component({
  selector: 'page-like-list',
  templateUrl: './like-list.page.html',
  styleUrls: ['./like-list.page.scss'],
})
export class LikeListPage implements OnInit {
  public likedLocations: Likes = {
    items: [],
    meta: { isFirstLoad: true, isLoading: true },
  };

  public likedEvents: Likes = {
    items: [],
    meta: { isFirstLoad: true, isLoading: true },
  }

  public currentSection = 'events';
  public currentPosition: Position;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private geolocationService: GeolocationService,
    private likeService: LikeService,
  ) { }

  public ngOnInit() {
    this.likeService.getLikedLocations()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((likedLocations) => {
        this.likedLocations.meta = likedLocations.meta;

        if (this.likedLocations.meta.isLoading) { return; }

        this.likedLocations.items = likedLocations.items;

        // remove items without entity from list
        this.likedLocations.items = likedLocations.items.filter((item: LikeModel) => item.entity);
      });

    this.likeService.getLikedEvents()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((likedEvents) => {
        this.likedEvents.meta = likedEvents.meta;

        if (this.likedEvents.meta.isLoading) { return; }

        // remove items without entity from list
        this.likedEvents.items = likedEvents.items.filter((item: LikeModel) => item.entity);
      });

    this.geolocationService.getCurrentPosition()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentPosition) => {
        this.currentPosition = currentPosition;
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public trackByFunction(index: number, item: any) {
    return item ? item.id : index;
  }

  public loadMore(type: 'event' | 'location') {
    if (type === 'location') {
      return this.likeService.getMoreLikedLocations();
    }

    this.likeService.getMoreLikedEvents();
  }
}
