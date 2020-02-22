import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private toastController: ToastController,
  ) { }

  public async show(message: string, success = true) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      color: success ? 'dark' : 'danger',
      cssClass: `proto-toast ${!success ? 'error' : 'success'}`,
    });

    toast.present().catch();
  }
}
