
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import * as moment from 'moment';
import { msalConfig } from '../auth-config';
import { Constants } from '../Constants/Constants';
// import ApiService from './SQLService';
import { ApiService } from './api.service';
import Swal from 'sweetalert2';

var myWindow: Window | null;

const msalInstance = new PublicClientApplication(msalConfig);

export default class CommonService {
  constructor(private apiService: ApiService, private authService: MsalService ) {}
  public async checkCameraAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("This browser does not support the API yet");
      return false;
    } else {

      return await navigator.mediaDevices.getUserMedia({ video: true }).then((res) => {
        if (res.active) {
          return true;
        }
        else return false;
      }).catch((err) => {
        console.log(err);
        this.logErrors(null, "CommonService.ts - checkCameraAccess - inner catch", err, new Error().stack);
        return false
      })
    }

  }
  public logErrors(ReqId: any, methodName: any, err: any, trace: any) {
    let url = Constants.ErrorLogger;

    var body = {
      "ReqId": ReqId,
      "UserEmailId": Constants.userEmail,
      "MethodName": methodName,
      "APIRequestBody": err && err.config ? err.config.data : null,
      "ErrorCode": err && err.response ? err.response.status : null,
      "StackTrace": trace,
      "ExceptionMessage": err && err.response ? err.response.statusText : null,
      "InnerException": JSON.stringify(err),
      "ExceptionOccured": "AngularApp"
    }
    if(this.apiService){
      this.apiService
      .postMethodAxios(url, body)
      .then(async (response: any) => {
      }).catch((err) => {
        console.log(err);
      })
    }
  }
  public getNameForDelete(url: any) {
    try {
      let urlArr: any[] = [];
      let name = "";
      if (url) {
        if (url.includes("?")) {
          urlArr = url.split("?")[0].split("/");
        } else {
          urlArr = url.split("/");
        }
        name = urlArr[urlArr.length - 1];
      }
      return name;
    } catch (error) {
      this.logErrors(null, "CommonService.ts - getNameForDelete - inner catch", error, new Error().stack);
      return null;
    }
  }
  public isFileSizeValid(file: File, type: any) {
    try {
      if (typeof (file) != "undefined") {
        var size = file.size;
        var sizeInMB = +(size / (1024 * 1024)).toFixed(2);
        let maxSize;
        if (type == "DMVFront" || type == "DMVEnd" || type == "Photo") {
          maxSize = 4;
        } else {
          maxSize = 10;
        }
        if (sizeInMB > maxSize) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      this.logErrors(null, "constants.tsx - filtervalid - inner catch", error, new Error().stack);
      return null;
    }

  }
  public toBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => {
      this.logErrors(null, "constants.tsx - toBase64", error, new Error().stack);
      reject(error);
    }
  });
  public validate(val: any, type: any) {
    let regex;
    if (type === "SSN") {
      regex = new RegExp(/^[0-9]{9}$/);
    }
    else if (type === "Work PhoneNumber" || type === "Home PhoneNumber") {
      regex = new RegExp(/^[0-9]{10}$/);
    }
    else if (type === "ZipCode") {
      regex = new RegExp(/^[0-9]{9}$|^[0-9]{5}$/);
    } else if (type === "Weight") {
      regex = new RegExp(/^[1-9][0-9]{0,2}(?:\.[0-9]{1,3})?$/);
    } else {
      regex = new RegExp(/^[0-9]{9}$/);
    }
    if (!regex.test(val)) {
      return false;
    }
    else {
      return true;
    }
  }
  public logout() {
    localStorage.clear()
    if (Constants.loginType && Constants.loginType.includes("google")) {
      this.createPopupWin();
      setTimeout(() => {
        myWindow?.close();
        Constants.IsLoggedIn = false;
        this.authService?.logoutRedirect({
          postLogoutRedirectUri: '/'
        });
      }, 2000);
    } else {
      Constants.IsLoggedIn = false;
      this.authService?.logoutRedirect({
        postLogoutRedirectUri: '/'
      });
    }
  }
  public createPopupWin() {
    let pageURL = Constants.gmailLogoutUrl;
    let pageTitle = "";
    let popupWinWidth: any = "500";
    let popupWinHeight: any = "500";
    var left = (window.screen.width - popupWinWidth) / 2;
    var top = (window.screen.height - popupWinHeight) / 4;
    myWindow = window.open(pageURL, pageTitle,
      'resizable=yes, width=' + popupWinWidth
      + ', height=' + popupWinHeight + ', top='
      + top + ', left=' + left);
  }
  public checkLoginTime() {
    try {
      let date = moment.unix(parseInt(Constants.tokenExp));
      let UserLoggedInTime = date.format('YYYY-MM-DD HH:mm:ss');
      let TimeNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      var duration: any = moment.duration(moment(TimeNow).diff(moment(UserLoggedInTime)));
      let checkLoginTime=[{"hours":duration._data.hours, "minutes":duration._data.minutes}];
      if(checkLoginTime && checkLoginTime.length>0){
        if((checkLoginTime[0].hours>0) || (checkLoginTime[0].hours===0 && checkLoginTime[0].minutes >0)){
          this.getAccessToken();
        }
      }
    } catch(ex) {
      this.logErrors(null, "CommonService.ts - checkLoginTime - outer catch", ex, new Error().stack);
      console.log(ex);
    }
  }
  public getAccessToken() {
    try{
    const accessTokenRequest = {
      scopes: [Constants.GetAccessToken],
      account: Constants.CurrentLogin,
    };
    msalInstance.setActiveAccount(Constants.CurrentLogin);
    msalInstance
      .acquireTokenSilent(accessTokenRequest)
      .then(function (accessTokenResponse) {
        // Acquire token silent success
        let account: any = accessTokenResponse.account;
        Constants.tokenExp = account ? account.idTokenClaims.exp : "";
        // Call your API with token
        //callApi(accessToken);
      })
      .catch( (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          Swal.fire({
            title: 'Session Expired',
            text: "Logging out",
            showCancelButton: false,
            showConfirmButton: false
          });
          setTimeout(()=>{
            this.logout();
          msalInstance
            .acquireTokenRedirect(accessTokenRequest)
            .then(function (accessTokenResponse: any) {
              // Acquire token interactive success
              // Call your API with token
              //callApi(accessToken);
            })
            .catch( (error: any) => {
              this.logErrors(null, "CommonService.ts - getAccessToken - authtokenRedirect", error, new Error().stack);
              // Acquire token interactive failure
              console.log(error);
            });
          },3000);
        }
        this.logErrors(null, "CommonService.ts - getAccessToken - aquireSilentToken catch2", error, new Error().stack);
        console.log(error);
      });
    }catch(ex){
      this.logErrors(null, "CommonService.ts - getAccessToken - outer catch", ex, new Error().stack);
    }
  }
}
