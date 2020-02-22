import { Component, Input } from '@angular/core';

import { AppHelper } from 'src/app/@shared/app-helper';
import { EventService } from 'src/app/event/shared/event.service';
import { TagModel } from 'src/app/event/shared/tag.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'proto-filter-preview',
  templateUrl: './filter-preview.component.html',
  styleUrls: ['./filter-preview.component.scss'],
})
export class FilterPreviewComponent {
  @Input() public filter: any;
  @Input() public activeSegment: string;
  public sentence: any;
  public tagsString: string;
  public isFilterEmpty = false;

  private _tags: { [key: string]: TagModel };

  constructor(
    private eventService: EventService,
    private navController: NavController,
  ) {
    this.eventService.getTags()
      .subscribe((tags) => {
        this._tags = {};

        for (const tag of tags) {
          this._tags[tag.id] = tag;
        }

        this.createTagsString();
      });
  }

  public ngOnChanges() {
    this.createTagsString();
    this.isFilterEmpty = AppHelper.isEmptyObject(this.filter);
  }

  public onFilterIconClicked() {
    if (this.filter) { return; }

    const queryParams = Object.assign(this.sentence.link[1], { openFilterModal: 1 });
    this.navController.navigateForward(this.sentence.link[0], { queryParams: queryParams }).catch();
  }

  private createTagsString() {
    this.tagsString = '';

    if (!this.filter || !this.filter.tags || !this._tags) { return; }

    let tagsString = '';

    this.filter.tags.forEach((tagId, i) => {
      if (i === this.filter.tags.length - 1) {
        tagsString += `${this._tags[tagId].name}`;

        return;
      }

      tagsString += `${this._tags[tagId].name}, `;
    });

    this.tagsString = tagsString;
  }
}
