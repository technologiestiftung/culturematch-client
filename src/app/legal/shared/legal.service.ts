import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AgreementModel } from 'src/app/legal/shared/agreement.model';
import { C } from 'src/app/@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class LegalService {
  constructor(
    private http: HttpClient,
  ) { }

  public getLatestAgreement(agreementType: string): Observable<AgreementModel> {
    return this.http.get<AgreementModel>(`${C.urls.agreements}/${agreementType}/latest`);
  }

  public consentToAgreement(agreementId: string, agreement: AgreementModel, agreementType: string) {
    return this.http.post(`${C.urls.consents}`, {
      agreementId: agreementId,
      agreement: agreement,
      agreementType: agreementType,
    }).toPromise();
  }

  public checkForRequiredActions(): Promise<any[]> {
    return this.http.get<any[]>(`${C.urls.agreements}/require-action`).toPromise();
  }
}
