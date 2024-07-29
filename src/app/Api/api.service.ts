import { Injectable } from '@angular/core';
import axios from 'axios';
import { Constants } from '../Constants/Constants';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

var myWindow: Window | null;

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private authService?: MsalService) { }
  getMethodAxios = (url: any) => new Promise((resolve, reject) => {
    if (Constants.IsLoggedIn) {
      const accessTokenRequest = {
        scopes: [Constants.GetAccessToken],
        account: Constants.CurrentLogin,
      };
      if (this.authService) {
        var msalInstance=this.authService.instance;
        msalInstance.acquireTokenSilent(accessTokenRequest)
          .then(function (accessTokenResponse) {
            // Acquire token silent success
            Constants.accessToken = accessTokenResponse.idToken;
            // Call your API with token
            axios.get(url, { headers: { Authorization: `Bearer ${Constants.accessToken}` } })
              .then((response) => {
                resolve(response);
              }).catch((error) => {
                console.log(error);
                reject(error);
              });
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
               msalInstance.acquireTokenRedirect(accessTokenRequest)
                .then(function (accessTokenResponse: any) {
                  // Acquire token interactive success
                  // Call your API with token
                  //callApi(accessToken);
                })
                .catch( (error: any) => {
                  console.log(error);
                });
              },3000);
            }
            });
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
  postMethodAxios = (url: any, body: any) => new Promise((resolve, reject) => {
    if (Constants.IsLoggedIn) {
      //Get Access Token From MSAL
      const accessTokenRequest = {
        scopes: [Constants.GetAccessToken],
        account: Constants.CurrentLogin,
      };
      if (this.authService) {
        var msalInstance=this.authService.instance;
        msalInstance.acquireTokenSilent(accessTokenRequest)
          .then(function (accessTokenResponse) {
            // Acquire token silent success
            Constants.accessToken = accessTokenResponse.idToken;
            // Call your API with token
            axios.post(url, body, { headers: { Authorization: `Bearer ${Constants.accessToken}` } })
              .then((response) => {
                resolve(response);
              }).catch((error) => {
                console.log(error);
                reject(error);
              });
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
               msalInstance.acquireTokenRedirect(accessTokenRequest)
                .then(function (accessTokenResponse: any) {
                  // Acquire token interactive success
                  // Call your API with token
                  //callApi(accessToken);
                })
                .catch( (error: any) => {
                  console.log(error);
                });
              },3000);
            }
            });
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

}
