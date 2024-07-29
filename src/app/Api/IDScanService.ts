import axios from 'axios';
import CommonService from './CommonService';
import { ApiService } from './api.service';
import { MsalService } from '@azure/msal-angular';

export default class IDScanService {
  constructor(private apiservice: ApiService, private authService: MsalService) { }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  public verifyID(url: any, body: any): Promise<any> {
    try {
      return axios({
        method: "post",
        url: url,
        data: JSON.stringify(body),
        headers: {
          "Authorization": "Bearer sk_0f278770-78f1-4d31-825f-78ffdbddbc03",
          "Content-Type": "application/json"
        },
      })
        .then((response: any) => {
          return response;
        }, (error) => {
          console.log(error);
          this.commonServObj.logErrors(null, "IDScanservice.tsx - IDScanservice - inner catch", error, new Error().stack);
        }).catch((err) => {
          this.commonServObj.logErrors(null, "IDScanservice.tsx - IDScanservice - outer catch", err, new Error().stack);
        })
    } catch (error) {
      this.commonServObj.logErrors(null, "IDScanservice.tsx - IDScanService - outer catch", error, new Error().stack);
      return Promise.reject();
    }
  }

}
