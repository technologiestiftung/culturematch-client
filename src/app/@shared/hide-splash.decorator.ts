// hide html splash image
export function HideSplash(): ClassDecorator {
  return function (constructor: any) {
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function (...args: any[]) {
      document.body.classList.add('page-ready');
      /* tslint:disable-next-line */
      ionViewDidEnter && ionViewDidEnter.apply(this, args);
    }
  }
}
