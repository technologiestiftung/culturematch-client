import { Directive, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AppHelper } from 'src/app/@shared/app-helper';

@Directive({
  selector: '[handle-internal-links]',
})
export class HandleInternalLinksDirective {
  constructor(
    private element: ElementRef,
    private router: Router,
  ) { }

  public ngOnInit() {
    this.element.nativeElement.addEventListener('click', this.onElementClicked.bind(this));
  }

  private onElementClicked(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();

    const elem: any = ev.srcElement;
    if (!elem) { return; }
    if (elem.tagName.toUpperCase() !== 'A') { return; }

    let url = elem.getAttribute('href');
    if (!url) { return; }

    const urlParams = url.split('?')[1];
    url = url.split('?')[0];

    let queryParams = {};

    if (urlParams) {
      queryParams = AppHelper.objectFromUrlParams(urlParams);
    }

    this.router.navigate([url], { queryParams: queryParams }).catch();
  }
}
