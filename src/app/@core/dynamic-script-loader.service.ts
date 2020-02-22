import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'facebooksdk', src: 'https://connect.facebook.net/en_US/sdk.js' },
];

declare var document: any;

@Injectable({
  providedIn: 'root',
})
export class DynamicScriptLoaderService {
  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
      };
    });
  }

  public load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));

    return Promise.all(promises);
  }

  public loadScript(name: string) {
    return new Promise((resolve) => {
      if (!this.scripts[name].loaded) {
        //load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({ script: name, loaded: true, status: 'Loaded' });
                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({ script: name, loaded: true, status: 'Loaded' });
            };
        }
        script.onerror = () => resolve({ script: name, loaded: false, status: 'Failed' });
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }
}
