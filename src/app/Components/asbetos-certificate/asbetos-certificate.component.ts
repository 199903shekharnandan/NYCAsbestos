import { Component, OnDestroy, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Constants';
import { IasbestosCertificate } from '../../Models/asbestosCertificate';
import { ApiService } from 'src/app/Api/api.service';
import * as $ from 'jquery';
import CommonService from 'src/app/Api/CommonService';
import * as moment from 'moment';
import VCService from 'src/app/Models/VCService';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-asbetos-certificate',
  templateUrl: './asbetos-certificate.component.html',
  styleUrls: ['./asbetos-certificate.component.scss']
})
export class AsbetosCertificateComponent implements OnInit,OnDestroy {
  asbestosCertificateData = {} as IasbestosCertificate;
  NewDate = moment(new Date()).format('YYYY-MM-DD');
  intervalId?: NodeJS.Timeout;
  currentLogin:any;
  IsQRCode:boolean=false;
  IsMsg:boolean=true;
  QrMsg:boolean=false;
  UserRole:any;
  constructor(private apiservice: ApiService, private authService: MsalService,) {

  }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  vcService = new VCService(this.apiservice, this.authService);
  ngOnInit(): void {
    this.asbestosCertificateData.statusMessage = "Please wait!";
    this.UserRole=Constants.UserRole;
   if (Constants.UserRole == "User" || Constants.UserRole == "Supervisor") {
            this.getUserCertificates();
        } else {
            $('.user-dashboard.navigation').css("display", "none");
        }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.intervalId){
      clearInterval(this.intervalId);
    }
  }
  getUserCertificates() {
    try {
      let url = Constants.GetCertificateTypesForUser;
      var body = {
        "LoginUserEmailId": Constants.userEmail,
    }
     this.apiservice.postMethodAxios(url, body).then(async (response: any) => {
        var resArr = response.data.table;
        var certificateTypeArrayvalues: any[] = [];
        for (var item = 0; item < resArr.length; item++) {
          if (resArr[item].scanningStatus != 'issuance_successful') {
            certificateTypeArrayvalues.push({ value: resArr[item].certificateType, label: resArr[item].certificateType });
          }
        }
        if (certificateTypeArrayvalues.length > 0) {
          this.Checkuserdetails(certificateTypeArrayvalues[0].value);
          this.asbestosCertificateData.selectedCertificateType = certificateTypeArrayvalues[0];
          this.asbestosCertificateData.certificateTypeValues = certificateTypeArrayvalues;
          this.asbestosCertificateData.disableDropdown = false;
        }
        else if (resArr.length > 0) {
          this.asbestosCertificateData.statusMessage = "Credentials has been already issued."
          this.IsQRCode = false;
          this.IsMsg = true;
        } else {
          this.asbestosCertificateData.statusMessage = "Please apply for the certification exam to recieve the Asbestos certificate."
          this.IsQRCode = false;
          this.IsMsg = true;
        }
    })
    .catch((err)=>{console.log(err);
            this.commonServObj.logErrors(null,"asbetos-certificate.component.ts - getUserCertificates - inner catch",err,new Error().stack);
            return Promise.reject();
        })

} catch (error) {
    this.commonServObj.logErrors(null,"asbetos-certificate.component.ts - getUserCertificates - outer catch",error,new Error().stack);
    return Promise.reject();
}
}
Updatecertificatedetails(){
  try {
   if (this.asbestosCertificateData.qrURL != '') {
      let url = Constants.UpdateCertificateStatus;
      var body ={
          "IssuedOn":moment(new Date()).format('MM/DD/YYYY HH:mm:ss'),
          "CertificateStatus":"Issued",
          "RequestGUID":this.asbestosCertificateData.certificateId,
          "ReqId":this.asbestosCertificateData.reqId
      }
      this.apiservice.postMethodAxios(url, body).then((data: any) => {
          return data
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - Updatecertificatedetails - inner catch", err, new Error().stack);
          return Promise.reject();
        });
      }
      return Promise.resolve();
    } catch (error) {
      this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - Updatecertificatedetails - outer catch", error, new Error().stack);
      return Promise.reject();
    }
  }
  Checkuserdetails(certificatetypeId?: any) {
    debugger;
    try {
      let url = Constants.checkuserStatus;
      var body = {
        "LoginUserEmailId":Constants.userEmail,
        "Certificate_type_id": certificatetypeId,
      }
      this.apiservice.postMethodAxios(url, body).then((data: any) => {
        if (data && data.data && data.data.table && data.data.table.length > 0) {
          let dataArr = data.data.table[0];
            this.asbestosCertificateData.ExamStatus= dataArr.examStatus ? dataArr.examStatus : "";
            this.asbestosCertificateData.ApprovalStatus = dataArr.status;
            this.asbestosCertificateData.Certificatenumber = dataArr.certificateNumber;
            this.asbestosCertificateData.FirstName = dataArr.applicantFirstName;
            this.asbestosCertificateData.LastName = dataArr.applicantLastName;
            this.asbestosCertificateData.Gender = dataArr.applicantGender;
            this.asbestosCertificateData.CertificateType = dataArr.certificateType;
            this.asbestosCertificateData.Photolink = dataArr.photoLink;
            this.asbestosCertificateData.Token = dataArr.sasToken;
            this.asbestosCertificateData.Address = dataArr.applicantAddress;
            this.asbestosCertificateData.ApplicationType = dataArr.applicationType;
            this.asbestosCertificateData.OldCertficateType = dataArr.oldCertificateType;
            this.asbestosCertificateData.expiresOn = dataArr.expiresOn ? moment(dataArr.expiresOn).format('YYYY-MM-DD') : "";
            this.asbestosCertificateData.scanningStatus = dataArr.scanningStatus;
            this.asbestosCertificateData.oldReqId = dataArr.oldReqId;
            this.asbestosCertificateData.reqId = dataArr.reqId;
            this.asbestosCertificateData.duplicateExpiryDate = dataArr.oldCertificateExpiryDate;

          this.asbestosCertificateData.statusMessage = (this.asbestosCertificateData.ExamStatus == "Failed" || this.asbestosCertificateData.ExamStatus == "" || this.asbestosCertificateData.ExamStatus == "Incompleted" || this.asbestosCertificateData.ExamStatus == "Scheduled") && (this.asbestosCertificateData.ApplicationType == "Initial") && (this.asbestosCertificateData.Certificatenumber == "" || this.asbestosCertificateData.Certificatenumber == null)
            ? "Please apply for the certification exam to recieve the Asbestos certificate."
            : (this.asbestosCertificateData.ExamStatus == null || this.asbestosCertificateData.ExamStatus == "") && this.asbestosCertificateData.ApplicationType == "Renewal" && moment(this.NewDate).isSameOrBefore(this.asbestosCertificateData.expiresOn) && (this.asbestosCertificateData.reqId == this.asbestosCertificateData.oldReqId && this.asbestosCertificateData.scanningStatus == "issuance_successful")
              ? "Credentials has been already issued."
              : this.asbestosCertificateData.ExamStatus == "Passed" && this.asbestosCertificateData.ApplicationType == "Initial" && (this.asbestosCertificateData.reqId == this.asbestosCertificateData.oldReqId && this.asbestosCertificateData.scanningStatus == "issuance_successful")
                ? "Credentials has been already issued."
                : (this.asbestosCertificateData.ExamStatus == null || this.asbestosCertificateData.ExamStatus == "") && this.asbestosCertificateData.ApplicationType == "Duplicate" && (this.asbestosCertificateData.reqId == this.asbestosCertificateData.oldReqId && this.asbestosCertificateData.scanningStatus == "issuance_successful")
                  ? "Credentials has been already issued."
                  : this.asbestosCertificateData.statusMessage

          if (dataArr.reqId == dataArr.oldReqId) {
            if (dataArr.scanningStatus == "issuance_successful") {
            } else {
              this.generateQr();
            }
          } else {
            this.generateQr();
          }
        } else {
          this.asbestosCertificateData.statusMessage = "Please apply for the certification exam to recieve the Asbestos certificate.";
        }
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - Checkuserdetails -  inner catch", err, new Error().stack);
        return Promise.reject();
      })

    } catch (error) {
      this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - Checkuserdetails - outer catch", error, new Error().stack);
      return Promise.reject();
    }
  }
  generateQr() {
    try {
      // TODO: Define and Load Claims Details
      var user_data = {
        "applicant_first_name": this.asbestosCertificateData.FirstName,
        "applicant_last_name": this.asbestosCertificateData.LastName,
        "applicant_gender": this.asbestosCertificateData.Gender,
        "applicant_Address": this.asbestosCertificateData.Address,
        "certificate_type_id": this.asbestosCertificateData.CertificateType,
        "loginUserEmailId": Constants.userEmail,
        "ExamStatus": this.asbestosCertificateData.ExamStatus,
        "certificateNumber": this.asbestosCertificateData.Certificatenumber,
        "expiry_date":moment(this.asbestosCertificateData.expiresOn).format("MMMM DD, YYYY")
      }
      this.vcService.issueVCQR(user_data).then((response: any) => {
        this.asbestosCertificateData.pin = response.data.pin;
          this.asbestosCertificateData.qrURL = response.data.url;
         this.IsMsg=false; this.IsQRCode=true;
          this.asbestosCertificateData.certificateId = response.data.requestId;
        this.Updatecertificatedetails().then((res) => {
          var url = Constants.GetScanningStatus;
          var body = {
            "RequestGUID": this.asbestosCertificateData.certificateId
          };
          this.intervalId = setInterval(() => {
            this.apiservice.postMethodAxios(url, body).then((res: any) => {
              const element = res.data.table[0];
              if (element) {
                if (element.scanningStatus == "request_retrieved") {
                  this.asbestosCertificateData.status = "request_retrieved";
                    this.asbestosCertificateData.message = "QR Code is scanned. Waiting for issuance...";
                    this.asbestosCertificateData.disableDropdown = true;
                  this.QrMsg = true;
                }
                if (element.scanningStatus == "issuance_successful") {
                  this.asbestosCertificateData.status = "issuance_successful";
                    this.asbestosCertificateData.message = "Credential successfully issued";
                    this.IsQRCode=false;
                    this.QrMsg=true;
                  this.getUserCertificates();
                  clearInterval(this.intervalId);
                }
              }
            }).catch((err) => {
              this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - postMethodAxios - inner catch", err, new Error().stack);
              console.log(err)
            });
          }, 1500);
        }).catch((err) => {
          this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - generateqr - inner catch", err, new Error().stack);
          console.log(err);
        })
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "asbetos-certificate.component.ts - generateqr - outer catch", error, new Error().stack);
    }
  }
}
