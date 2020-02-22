import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { EventModel } from 'src/app/event/shared/event.model';
import { AdModel } from 'src/app/ad/shared/ad.model';
import { AdService } from 'src/app/ad/shared/ad.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'page-ad-edit',
  templateUrl: './ad-edit.page.html',
  styleUrls: ['./ad-edit.page.scss'],
})
export class AdEditPage implements OnInit {
  @Input() public event: EventModel;
  @Input() public eventId: string;
  @Input() public eventTitle: string;
  @Input() public ad: AdModel;

  public editForm: FormGroup;
  public isLoading = false;

  constructor(
    private adService: AdService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) {
    this.editForm = this.formBuilder.group({
      description: ['', Validators.required],
    });
  }

  public ngOnInit() {
    if (this.ad) {
      this.editForm.patchValue(this.ad);
    }
  }

  public editFormIsValid() {
    return this.editForm.valid;
  }

  public async save() {
    if (!this.editFormIsValid) { return; }

    this.isLoading = true;

    try {
      if (!this.ad) {
        if (!this.event) {
          return console.warn('Didnt receive event');
        }
        await this.adService.createAd(this.event, this.editForm.value.description);
      }

      if (this.ad) {
        await this.adService.updateAttributes(this.ad.id, this.eventId, this.editForm.value);
      }

      this.isLoading = false;

      this.modalController.dismiss().catch();
    } catch (error) {
      console.error(error);

      this.isLoading = false;
    } finally {
      // temp since modal doesn't close on mobil otherwise because it's throwing an error
      this.modalController.dismiss().catch();
    }
  }
}
