import { Component, OnInit, ViewChild, Input, ElementRef, Renderer2 } from '@angular/core';

import { C } from '../constants';
import {
  ProtoImageConfig as Config,
  ProtoImageType as imageType,
} from './proto-image.config';

@Component({
  selector: 'proto-image',
  host: {
    class: 'proto-image',
  },
  templateUrl: './proto-image.component.html',
  styleUrls: ['./proto-image.component.scss'],
})
// tslint:disable:no-magic-numbers
export class ProtoImageComponent implements OnInit {
  @ViewChild('imageSrc', { static: true }) public imageSrc: ElementRef;
  @Input() public showFallbackImage = false;
  @Input() public imageType: imageType = 'default';

  @Input() set imageId(id: string) {
    // prevent setting fallback image
    if (!id && !this.showFallbackImage) {
      this.hasLoaded = false;

      return;
    }

    this.setImageSource(id);
  }

  public largeImage: string;
  public isFallbackImage = false;
  public hasLoaded = false;

  constructor(
    private renderer: Renderer2,
  ) {
  }

  public ngOnInit() {
  }

  public onImageLoaded() {
    this.renderer.removeAttribute(this.imageSrc.nativeElement, 'data-src');

    // probably not necessary, needs more testing
    //requestAnimationFrame(() => {
      this.hasLoaded = true;
    //});
  }

  private setImageSource(imageId: string) {
    const ratio: number = Config.ratio[this.imageType] || Config.ratio.default;
    const width: number = 2 * (Config.width[this.imageType] || Config.width.default);

    this.largeImage = this.getImage(imageId, width, Math.ceil(width / ratio));

    this.renderer.setAttribute(this.imageSrc.nativeElement, 'src', this.largeImage);
    this.onImageLoaded();
  }

  private getImage(id: string, width?: number, height?: number): string {
    this.isFallbackImage = false;

    // default fallback image
    if (!id) { return this.getFallbackImage('fallback_default'); }

    // external image
    if (id.includes('http://')) { return id; }

    // specific fallback image, defined in related model (e.g. 'fallback_user')
    if (id.includes('fallback')) { return this.getFallbackImage(id, width); }

    // original size
    if (!width) { return `${C.urls.files}/${id}/download`; }

    // squared image
    if (!height) { return `${C.urls.files}/${id}/download?square=${width}`; }

    return `${C.urls.files}/${id}/download?width=${width}&height=${height}`;
  }

  private getFallbackImage(name: string, width?: number): string {
    this.isFallbackImage = true;

    let key: string = name.substring(name.indexOf('_') + 1);

    if (!key || !Config.fallback[key]) {
      key = 'default';
    }

    // for smaller images like thumbnails use small fallback image if available
    if (width && width < Config.width.default) {
      return Config.fallback[key + '-small'] || Config.fallback[key];
    }

    return Config.fallback[key];
  }
}
