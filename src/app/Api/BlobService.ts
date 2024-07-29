import axios from 'axios';
import { Constants } from '../Constants/Constants';
import CommonService from './CommonService';
import { MsalService } from "@azure/msal-angular";
import { ApiService } from "./api.service";
import Swal from 'sweetalert2';

export default class BlobService {
  constructor(private apiservice: ApiService, private authService: MsalService) { }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);

  postFileToBlob = (url: any, body: any) => new Promise((resolve, reject) => {
    if (Constants.IsLoggedIn) {
      const accessTokenRequest = {
        scopes: [Constants.GetAccessToken],
        account: Constants.CurrentLogin,
      };
      if (this.authService) {
        this.authService.instance.acquireTokenSilent(accessTokenRequest)
          .then(function (accessTokenResponse) {
            // Acquire token silent success
            Constants.accessToken = accessTokenResponse.idToken;
            // Call your API with token
            axios.post(url, body, { headers: { Authorization: `Bearer ${Constants.accessToken}` } })
              .then((response) => {
                resolve(response);
              }).catch((error) => {
                console.log(error);
                // this.commonServObj.logErrors(body.ReqId,"Blobservice.tsx - postFileToBlob - inner catch",error,new Error().stack);
                reject(error);
              });
          })
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: "Oops..",
        text: "You are not Logged in."
      })
    }
  })
}
