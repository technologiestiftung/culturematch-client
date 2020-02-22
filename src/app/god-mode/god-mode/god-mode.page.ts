import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { C } from 'src/app/@shared/constants';
import { StorageService } from 'src/app/@core/storage.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'page-god-mode',
  templateUrl: './god-mode.page.html',
  styleUrls: ['./god-mode.page.scss'],
})
export class GodModePage implements OnInit {
  public storageItems: any[];
  public storagePrefix: string;

  constructor(
    private router: Router,
    private storage: StorageService,
  ) {
    this.getStorage();

    this.storagePrefix = C.STORAGE_PREFIX;
  }

  public ngOnInit() { }

  public clearAndReload() {
    this.storage.clear();

    this.router.navigate(['/']).then(() => {
      window.location.reload();
    }).catch();
  }

  public getStorage() {
    const allStorageItems = this.storage.getAllItems();

    this.storageItems = Object.keys(allStorageItems).map((key) => ({ key: key.replace(C.STORAGE_PREFIX, ''), value: allStorageItems[key], type: typeof allStorageItems[key] }));
  }
}
