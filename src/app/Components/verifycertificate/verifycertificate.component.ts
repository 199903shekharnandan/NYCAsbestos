import Swal from 'sweetalert2';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import * as moment from 'moment';
import * as $ from 'jquery';
import { ApiService } from 'src/app/Api/api.service';
import CommonService from 'src/app/Api/CommonService';
import { Constants } from 'src/app/Constants/Constants';
import { IQRClaims } from 'src/app/Models/IVC';
import { IVerifyCertificate } from 'src/app/Models/IVerifyCertificate';
import VCService from 'src/app/Models/VCService';
import { ActivatedRoute } from '@angular/router';
import{VerificationHistoryComponent} from '../verification-history/verification-history.component';
import { AttendanceHistoryComponent } from '../attendance-history/attendance-history.component';
var intervalId: string | number | NodeJS.Timer | undefined;
@Component({
  selector: 'app-verifycertificate',
  templateUrl: './verifycertificate.component.html',
  styleUrls: ['./verifycertificate.component.scss']
})


export class VerifycertificateComponent implements OnInit,OnDestroy {
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  vcService:VCService = new VCService(this.apiservice, this.authService);
  isLoading:boolean=true;
  Constants:any=Constants;
  @ViewChild('auto',{static: false}) auto: any;
  @Input() ParentData: any;
  value = 'This is my barcode secret data';
  keyword = "jobID";
  suggestions: any[] = [];
  ApplicantName:any;
  isQRCode:boolean=true;
  elementType = NgxQrcodeElementTypes.CANVAS;
  currentLogin: any;
  userEmail: any;
  data: any[] = [];
  dataObj:any[]=[];
  email: any;
  verifyObj={}as IVerifyCertificate;

  UserRole:any;
  props:any;
  claims = {
    firstName: '-',
    lastName: '-',
    Address: '-',
    Gender: '-',
    Certificatenumber: '-',
    certificate: '-',
    loginUserEmailId: '-'
  } as IQRClaims;
  responseTime = 0;

  public countries = [
    { id: 1, name: "Twiyo" },
    { id: 2, name: "Demimbu" }]


  constructor(private apiservice: ApiService, private authService: MsalService,public route: ActivatedRoute, public verifyHistory:VerificationHistoryComponent,private attendenceHistory:AttendanceHistoryComponent) {
  }
  removeClass(){
    $('.Inspector-page').removeClass('Inspector-page');
    $('.user-dashboard').removeClass('user-dashboard my-4')
  }

  ngOnInit(): void {
    if(!(window.location.href.includes("verificationHistory") || window.location.href.includes("attendanceHistory"))){
      this.isLoading=false;
     }
    this.UserRole=Constants.UserRole;
    this.getAllPremises();
    if(this.ParentData){

      this.ApplicantName =  this.ParentData.applicantFirstName + " ";
      if ( this.ParentData.applicantMiddleName) {
          this.ApplicantName +=  this.ParentData.applicantMiddleName + " ";
      }
      this.ApplicantName +=  this.ParentData.applicantLastName;
    }

    this.getVerifierQR();
            this.verifyObj.qrURL= '';
            this.verifyObj.requestID= '';
            this.verifyObj.user_data= this.claims;
            this.verifyObj.message= '';
            this.verifyObj.certificateStatus= '-';
            this.verifyObj.photoLink= "";
            this.verifyObj.sasToken= "";
            this.verifyObj.expiryDate= "-";
            this.verifyObj.hideQr= false;
            this.verifyObj.enableCheckIn= true;
            this.verifyObj.openPremisepopup= false;
            this.verifyObj.value= "";
            this.verifyObj.suggestions= [];
            this.verifyObj.errorPremise= false;
            this.verifyObj.certificateNumber= "-";
            this.verifyObj.disableNextVerification=true;
  }
  ngOnDestroy(): void {
    clearInterval(intervalId);
   this.claims = {
      firstName: '-',
      lastName: '-',
      Address: '-',
      Gender: '-',
      Certificatenumber: '-',
      certificate: '-',
      loginUserEmailId: '-'
    } as IQRClaims;
  }

  //--------getVerifierQR()
  getVerifierQR() {
    this.vcService.getVerifierVCQR()
      .then((response: any) => {
        this.verifyObj.qrURL = response.data.url;
        this.verifyObj.requestID = response.data.id;

        intervalId = setInterval(() => {
          this.vcService.getVerifierVCQRResponse(this.verifyObj.requestID)
            .then((response: any) => {
              // QR Code scanned
              if (response.data.status == 'request_retrieved') {
                this.responseTime++;
                if (this.responseTime == 240) {
                  this.verifyObj.message= "Could not fetch certificate details.";
                  this.verifyObj.hideQr= true;

                  clearInterval(intervalId);
                } else {
                  this.verifyObj.message=response.data.message;

                }

              }

              if (response.data.status == 'presentation_verified') {
                this.GetStatusOfCertificate(response.data.loginUserEmailId, response.data.certificate_type_id)
                  .then((res: any) => {
                    if (res.status == 'Suspended') {

                      this.verifyObj.message= "Certificate is suspended.";
                      this.verifyObj.hideQr= true;

                    }
                    else {
                      if (res.applicationType == "Duplicate" && moment(moment(new Date()).format('MM/DD/YYYY')).isAfter(moment(res.expiresOn).format('MM/DD/YYYY'))) {

                        this.verifyObj.message= "Certificate is expired.";
                        this.verifyObj.hideQr= true;

                      } else {
                        const claims = {
                          firstName: response.data.applicant_first_name,
                          lastName: response.data.applicant_last_name,
                          Address: response.data.applicant_Address,
                          Gender: response.data.applicant_gender,
                          Certificatenumber: response.data.certificateNumber,
                          certificate: response.data.certificate_type_id,
                          loginUserEmailId: response.data.loginUserEmailId
                        }
                        this.verifyObj.enableCheckIn= false;
                        this.verifyObj.message='';
                        this.verifyObj.message= "Certificate verified successfully!";
                          this.verifyObj.user_data=claims;
                          this.verifyObj.photoLink= res.photoLink;
                          this.verifyObj.sasToken= res.blobSASToken;
                          this.verifyObj.certificateNumber= res.certificateNumber;
                          this.verifyObj.expiryDate= moment(res.expiresOn).format('MM/DD/YYYY');
                          this.verifyObj.hideQr= true;
                          if (Constants.UserRole == "Contractor") {
                            this.checkInUser();
                          }

                      }
                    }

                  })
                clearInterval(intervalId);
              }
              if (response.data.status == 'presentation_error') {
                  this.verifyObj.message= response.data.message;
                  this.verifyObj.hideQr= true;
                clearInterval(intervalId);

              }
            })
        }, 1500);

      })


  }
  public checkInUser() {
    try {
      $('.autocomplete-container').removeClass('active');
        if ((this.verifyObj.value && Constants.UserRole == "Supervisor") || (Constants.UserRole == "Contractor" || Constants.UserRole == "Inspector")) {
            let url =Constants.InsertAttendanceLog;
            let body = {
                "VerifierEmailID": Constants.userEmail,
                "ScannedUserEmailID": this.verifyObj.user_data.loginUserEmailId,
                "CertificateType": this.verifyObj.user_data.certificate,
                "JobID": this.verifyObj.value
            }
            this.apiservice.postMethodAxios(url, body).then(async (response: any) => {
                if(response.data){
                    if (Constants.UserRole == "Supervisor" || Constants.UserRole == "Inspector") {
                    let msg;
                    if(Constants.UserRole == "Supervisor"){
                        msg=this.verifyObj.user_data.firstName+" has already checked in today with Job ID: "+this.verifyObj.value;
                    }else{
                        msg=this.verifyObj.user_data.firstName+" has already been verified today for Job ID: "+this.verifyObj.value;
                    }
                    Swal.fire({
                        title: "Warning!",
                        text: msg,
                        icon: "warning",
                      });
                      this.verifyObj.value='';this.verifyObj.openPremisepopup= false; this.verifyObj.enableCheckIn= true; this.verifyObj.errorPremise= false;this.verifyObj.disableNextVerification=false;
                    }else{
                      this.verifyObj.disableNextVerification=false;
                    }
                }else{
                this.getAllPremises();
                if (Constants.UserRole == "Supervisor" || Constants.UserRole == "Inspector") {
                    let msg;
                    if(Constants.UserRole == "Supervisor"){
                        msg="User is checked in successfully!";
                    }else{
                        msg="User is verified successfully!";
                    }
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: msg,
                    });
                  this.verifyObj.value= "";
                   this.verifyObj.openPremisepopup= false;
                    this.verifyObj.enableCheckIn= true;
                    this.verifyObj.errorPremise= false;
                    this.verifyObj.disableNextVerification=false;
                    // call to AttendanceHistory component
                  this.attendenceHistory.GetAttendanceHistory();
                }else{
                  this.verifyObj.disableNextVerification=false;
                }
            }
            }).catch((ex) => {
            })
        } else {
          this.verifyObj.errorPremise=true;
        }
    } catch (ex) {
        console.log(ex);
    }
}
public getAllPremises() {
  try {
      let url = Constants.getAllPremises;
      let body = { "VerifierID": Constants.userEmail }
      return this.apiservice.postMethodAxios(url, body).then(async (response: any) => {
         this.suggestions = response.data;
         if(window.location.href.includes("verificationHistory") || window.location.href.includes("attendanceHistory")){
          this.removeClass();
         }
         this.isLoading=false;
         $(".verify-certicate-section").css('display', 'block');
      }).catch((ex) => {

      })
  } catch (ex) {
      console.log(ex);
  }
}
  public GetStatusOfCertificate(email: any, certificate: any): Promise<any> {
    try {
        let url = Constants.GetStatusOfCertificate;

        var body = {
            "UserEmailId": email,
            "CertificateType": certificate
        }
      return this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          return response.data.table[0];
        }
      }).catch((err) => {
        this.commonServObj.logErrors(null, "verifycertificate.component.ts - GetStatusOfCertificate - inner catch", err, new Error().stack);
        console.log(err);
        return Promise.reject();
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "verifycertificate.component.ts - GetStatusOfCertificate - outer catch", error, new Error().stack);
      return Promise.reject();
    }
  }
  public updateVerificationStatus() {
    try {
        let url;
        var body;
        url = Constants.InsertVerifiedInspectorDetails;
        body = {
            "IsVerified": 1,
            "VerifierEmailId": Constants.userEmail,
            "Id":this.ParentData.id
        }
        this.apiservice.postMethodAxios(url, body).then((response: any) => {
            Swal.fire("Verification is done successfully!");
            // call to  verification history component
            this.verifyHistory.GetVerificationHistory()
            if (response && response.data && response.data.length > 0) {
                let resArr = response.data;
            }
        }).catch((err) => {
            this.commonServObj.logErrors(null, "verifycertificate.component.ts - updateVerificationStatus - inner catch", err, new Error().stack);
        })
    } catch (error) {
        this.commonServObj.logErrors(null, "verifycertificate.component.ts - updateVerificationStatus - outer catch", error, new Error().stack);
    }
}
openpopup(){

  this.verifyObj.openPremisepopup=true;
}
closePopup(){
  this.verifyObj.openPremisepopup=false;
  this.verifyObj.errorPremise=false;
}
selectEvent(item:any) {
  if(item){
  this.verifyObj.value=item.jobID;
  }else{
    this.verifyObj.value="";
  }
 $('.autocomplete-container').removeClass('active');
 this.verifyObj.errorPremise=false;
}
onCleared(e:any) {
  this.auto.close();
  this.verifyObj.value="";
  this.verifyObj.errorPremise=false;
}

onChangeSearch(val: string) {
  this.verifyObj.value=val;
  $('.autocomplete-container').removeClass('active');
  this.verifyObj.errorPremise=false;
}

}


