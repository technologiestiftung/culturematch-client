import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LanguageService } from 'src/app/@core/language.service';
import { StorageService } from 'src/app/@core/storage.service';

@HideSplash()
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slider', { static: true }) public slider: IonSlides;

  public slideOptions = {};
  public slides: any[] = [];
  public lastSlideActive = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private router: Router,
    private storage: StorageService,
  ) { }

  public ngOnInit() {
    this.languageService.getTranslation('VIEW.ONBOARDING.SLIDES').subscribe((slides) => {
      this.slides = slides;
    });
  }

  public ionSlideReachEnd() {
    this.lastSlideActive = true;
  }

  public ionSlidePrevStart() {
    this.lastSlideActive = false;
  }

  public skip() {
    this.slider.slideTo(this.slides.length - 1).catch();
  }

  public proceed(allowPush = false) {
    this.storage.set('hasOnboardingRun', true);

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.returnUrl) {
        this.router.navigate([queryParams.returnUrl]).catch();

        return;
      }

      this.router.navigate(['/login']).catch();
    });
  }
}
