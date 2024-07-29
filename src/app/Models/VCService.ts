import axios from 'axios';
import { ICreateQR, IVerifyQR } from '../Models/IVC';
import { Constants } from '../Constants/Constants';
import CommonService from 'src/app/Api/CommonService';
import { ApiService } from '../Api/api.service';
import { MsalService } from '@azure/msal-angular';

export default class VCService {
  constructor(private apiservice: ApiService, private authService: MsalService) {}
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  issueVCQR = (data: any) => new Promise((resolve, reject) => {
    axios.post<ICreateQR>(Constants.IssueVCQR, data).then((response) => {
      resolve(response);
    }).catch((error) => {
      console.log(error);
      this.commonServObj.logErrors(null, "VCService.tsx - vcservice - inner catch", error, new Error().stack);
      reject(error);
    });
  }).catch((err) => {
    console.log(err);
    this.commonServObj.logErrors(null, "VCService.tsx - vcservice - outer catch", err, new Error().stack);
  })
  getVerifierVCQR = () => new Promise((resolve, reject) => {
    axios.get<ICreateQR>(Constants.VerifyVCQR).then((response) => {
      resolve(response);
    }).catch((error) => {
      console.log(error)
      this.commonServObj.logErrors(null, "VCService.tsx - getVerifierVCQR - inner catch", error, new Error().stack);
      reject(error);
    });
  }).catch((err) => {
    console.log(err);
    this.commonServObj.logErrors(null, "VCService.tsx - getVerifierVCQR - outer catch", err, new Error().stack);
  })

  getVerifierVCQRResponse = (requestID: string) => new Promise((resolve, reject) => {
    axios.get<IVerifyQR>(Constants.VerifyVCQRResponse + requestID).then((response) => {
      resolve(response);
    }).catch((error) => {
      console.log(error);
      this.commonServObj.logErrors(null, "VCService.tsx - getVerifierVCQRResponse - inner catch", error, new Error().stack);
      reject(error);

    });

  }).catch((err) => {
    console.log(err);
    this.commonServObj.logErrors(null, "VCService.tsx - getVerifierVCQRResponse - outer catch", err, new Error().stack);
  })
}
