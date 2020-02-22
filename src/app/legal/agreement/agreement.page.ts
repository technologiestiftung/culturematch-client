import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { TranslateService } from '@ngx-translate/core';

@HideSplash()
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {
  @Input() public type: 'privacy' | 'terms';

  public content: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
  ) { }

  public ngOnInit() {
    this.type = this.type || this.activatedRoute.snapshot.params.type || 'privacy';

    this.content = this.translate.instant('VIEW.' + this.type.toUpperCase() + '.CONTENT');
  }

  public ngOnDestroy() {
  }
}
