import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../Api/api.service';
import CommonService from 'src/app/Api/CommonService';
import SQLAccess from 'src/app/Api/SQLAccess';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../Constants/Constants';
import { MsalService } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ddlCertificate: any = "";
  appType: any;
  validationMsg : any;
  CertificateTypes:any;
  userEmail: string;
  userName: string;
  userRole:any;
  startPnl:boolean=false;
  constructor(private router: Router, private apiservice: ApiService, private authService: MsalService, private http: HttpClient,private app:AppComponent,private toast:NgToastService) {
    this.userEmail=Constants.userEmail;
    this.userName=Constants.userName;
    this.userRole=Constants.UserRole;
  }

  sqlAccessObj= new SQLAccess(this.apiservice, this.authService);
  commonServObj = new CommonService(this.apiservice, this.authService);

  ngOnInit(): void {
    this.getMasterData();
    this.validationMsg = '';
    if(this.userRole=='Admin'|| this.userRole=='Inspector'|| this.userRole=='Contractor'){
      this.startPnl=false;
      $('#logo').addClass('dash-board-logo-application')
    }
    else{
      this.startPnl=true;
    }
  }
  public getMasterData() {
    try {
      this.sqlAccessObj.getMasterDataBAL().then((data: any) => {
        this.CertificateTypes = data[0];
      }).catch((err: any) => {
        console.log(err);
        this.commonServObj.logErrors(null, "home.component.ts - getMasterData - inner catch", err, new Error().stack);
      });
    } catch (err) {
      this.commonServObj.logErrors(null, "home.component.ts - getMasterData - outer catch", err, new Error().stack);

    }
  }
  startApplication() {

    let url = Constants.CheckLoginUserValidations;
    var body = {
      "LoginUserEmailId": this.userEmail,
      "applicateTypeId": this.appType,
      "certificate_type_id": this.ddlCertificate
    }
    this.apiservice.postMethodAxios(url, body).then((response: any) => {
      var element = response.data.table[0]
      if(this.appType=="Initial"){
          if (element.status != null && (element.status == "NoRecords" || element.status == "Failed") && element.isApplicationValid == 1) {
            this.router.navigate(['/application'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':"0"}})
          }
          else if (element.status != null && element.status == "HasValidCertificate" && element.isApplicationValid == 0) {
            this.validationMsg = 'You already have a valid certificate. In case of any loss please apply for duplicate certificate';
          }
          else if (element.status != null && element.status == "ValidForRenewal" && element.isApplicationValid == 0) {
            this.validationMsg = 'You already have a valid certificate. Please apply for renewal certificate instead of Initial.';
          }
          else if (element.isApplicationValid == 1) {
            this.router.navigate(['/application'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':"0"}})
          }
          else if (element.status != null && element.status == "AboutToExpire" && element.isApplicationValid == 0) {
            this.validationMsg = 'Your existing certificate is about to expire. Please apply for renewal certificate instead of initial.';
          }
          else if (element.status != null && element.status == "CertificateSuspended" && element.isApplicationValid == 0) {
            this.validationMsg ='Your existing certificate is suspended, kindly reach out to the admin to resume your certificate.'
            }
            else if (element.status != null && element.status == "NotPossible" && element.isApplicationValid == 0) {
              this.validationMsg = 'You cannot apply for this certificate as you already have other certificate(s).';
            }
          else if (element.isApplicationValid == 0) {
            this.validationMsg='One application is still under process. Please complete that first before applying the new request.';
          }
      }
      else if (this.appType == "Duplicate") {
        debugger
        if (element.status != null && element.status == "NoRecords" && element.isApplicationValid == 1) {
          this.router.navigate(['/duplicateApplication'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':'0'}})
          $("#ValidationMessage").hide();

        }
        else if (element.reqId) {
          this.router.navigate(['/duplicateApplication'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':'0'}})
          $("#ValidationMessage").hide();
        }
        else if (element.isApplicationValid == 0 && element.status == "CertificateNotAvailableForAppID") {
          this.validationMsg='You do not have any active certificate for selected certificate type.';
        }
        else if (element.isApplicationValid == 0 && element.status == "NoActiveCertificate") {
          this.validationMsg='You do not have any active certificate for selected certificate type.';
        }
        else if (element.isApplicationValid == 0 && element.status == "ApplicationRejected") {
          this.validationMsg='You do not have any active certificate for selected certificate type.';
        }
         else if (element.status != null && element.status == "CertificateSuspended" && element.isApplicationValid == 0) {
          this.validationMsg='Your existing certificate is suspended, kindly reach out to the admin to resume your certificate.';
          }
          else if (element.status != null && element.status == "ValidForRenewal" && element.isApplicationValid == 0 ) {
            this.validationMsg='Your existing certificate is about to expire. Please apply for renewal certificate.';
          }
        else if (element.isApplicationValid == 0) {
          this.validationMsg='One application is still under process. Please complete that first before applying the new request.';
        }
        else if (element.isApplicationValid == 1) {
          this.router.navigate(['/duplicateApplication'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':'0'}});
        }
      }
      else if (this.appType == "Renewal") {
        if (element.status != null && element.status == "NoRecords" && element.isApplicationValid == 1) {
          this.router.navigate(['/renewalApplication'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':'0'}});
        }
        else if (element.reqId) {
          this.router.navigate(['/renewalApplication'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':'0'}});
        }
        else if (element.isApplicationValid == 0 && element.status == "CertificateNotAvailableForAppID") {
          this.validationMsg='You do not have any active certificate for selected certificate type.';
        }
          else if(element.isApplicationValid == 0 && element.status == "CertificateExpired") {
            this.validationMsg='Your certificate has been expired. Please apply for initial certificate.';
        }
        else if (element.isApplicationValid == 0 && element.status == "NoActiveCertificate") {
          this.validationMsg='You can renew your certificate only before two months of expiry. In case of loss of certificate apply for duplicate.';
        }
        else if (element.isApplicationValid == 0 && element.status == "ApplicationRejected") {
          this.validationMsg='You do not have any active certificate for selected certificate type.';
       }
        else if (element.isApplicationValid == 0 && element.status == "ExamFailed") {
          this.validationMsg='You do not have any active certificate for selected certificate type.';
        }
        else if (element.status != null && element.status == "CertificateSuspended" && element.isApplicationValid == 0) {
          this.validationMsg='Your existing certificate is suspended, kindly reach out to the admin to resume your certificate.';
        }
        else if (element.isApplicationValid == 0) {
          this.validationMsg='One application is still under process. Please complete that first before applying the new request.';
        }
        else if (element.isApplicationValid == 1) {
          this.router.navigate(['/renewalApplication'],{queryParams:{'certificateType':this.ddlCertificate,'applicateType':this.appType,'id':'0'}})
        }
      }
    });
  }

  RulesAndRegulations(){
    window.open(Constants.RulesAndRegulations,"_blank");
  }
}
