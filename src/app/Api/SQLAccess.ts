import { IRenewalForm } from './../Models/renewalForm';
import { IDuplicateForm } from './../Models/duplicateForm';
import { IapplicationForm } from './../Models/applicationForm';
import { Constants } from '../Constants/Constants';

import CommonService from './CommonService';
import { ApiService } from './api.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';

export default class SQLAccess  {
  constructor(private apiservice: ApiService, private authService: MsalService) {}
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  public getLoginUserValidations(applicateType:any,certificateType:any):Promise<any> {
    try{
    let url = Constants.CheckLoginUserValidations;
    var body = {
      "LoginUserEmailId": Constants.userEmail,
      "applicateTypeId": applicateType,
      "certificate_type_id": certificateType
    }
    return this.apiservice?this.apiservice.postMethodAxios(url, body).then( (response: any) => {
      var element = response.data.table[0]
      if (applicateType === "Initial") {
        if (element.status != null && (element.status === "NoRecords" || element.status === "Failed") && element.isApplicationValid === "1") {
          return true;
        }
        else if (element.status != null && element.status === "HasValidCertificate" && element.isApplicationValid === "0") {
          return false;
        }
        else if (element.isApplicationValid === "1") {
          return true;
        }
        else if (element.status != null && element.status === "AboutToExpire" && element.isApplicationValid === "0") {
          return false;
        }
         else if (element.status != null && element.status === "CertificateSuspended" && element.isApplicationValid === "0") {
          return false;
          }
        else if (element.isApplicationValid === "0") {
          return false
        }
      }
      else if (applicateType === "Duplicate") {
        debugger
        if (element.status != null && element.status === "NoRecords" && element.isApplicationValid === "1") {
          return true;
        }
        else if (element.reqId) {
          return true;
        }
        else if (element.isApplicationValid === "0" && element.status === "CertificateNotAvailableForAppID") {
          return false;
        }
        else if (element.isApplicationValid === "0" && element.status === "NoActiveCertificate") {
          return false;
        }
        else if (element.isApplicationValid === "0" && element.status === "ApplicationRejected") {
          return false;
        }
         else if (element.status != null && element.status === "CertificateSuspended" && element.isApplicationValid === "0") {
          return false;
          }
        else if (element.isApplicationValid === "0") {
         return false;
        }
        else if (element.isApplicationValid === "1") {
          return true;
        }
      }
      else if (applicateType === "Renewal") {
        if (element.status != null && element.status === "NoRecords" && element.isApplicationValid === "1") {
          return true;
        }
        else if (element.reqId) {
          return true;
        }
        else if (element.isApplicationValid === "0" && element.status === "CertificateNotAvailableForAppID") {
          return false;
        }
          else if(element.isApplicationValid === "0" && element.status === "CertificateExpired") {
            return false;
        }
        else if (element.isApplicationValid === "0" && element.status === "NoActiveCertificate") {
          return false;
        }
        else if (element.isApplicationValid === "0" && element.status === "ApplicationRejected") {
          return false;
        }
        else if (element.isApplicationValid === "0" && element.status === "ExamFailed") {
          return false;
        }
        else if (element.status != null && element.status === "CertificateSuspended" && element.isApplicationValid === "0") {
        return false;
        }
        else if (element.isApplicationValid === "0") {
          return false;
        }
        else if (element.isApplicationValid === "1") {
          return true;
        }
      }
    }).catch((err: any) => { console.log(err);
      this.commonServObj.logErrors(null,"SQLAccess.ts - getLoginUserValidations - inner catch",err,new Error().stack);
      return Promise.reject();
    }):Promise.reject();
} catch (err) {
  this.commonServObj.logErrors(null,"SQLAccess.ts - getLoginUserValidations - outer catch",err,new Error().stack);
  return Promise.reject();
}
  }
  public getMasterDataBAL():Promise<any> {
    try {
      let url = Constants.getMasterData;
      let masterData: any[] = [];
      let certificateTypesArray: any[] = [];
      let applicatecateTypesArray: any[] = [];
      return this.apiservice?this.apiservice.getMethodAxios(url).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table1) {
          var certificateTypeData = response.data.table;
          var applicateTypeData = response.data.table1;
          for (let item = 0; item < certificateTypeData.length; item++) {
            certificateTypesArray.push({ value: certificateTypeData[item].certificateName, label: certificateTypeData[item].certificateName });
          }
          for (let item = 0; item < applicateTypeData.length; item++) {

            applicatecateTypesArray.push(applicateTypeData[item].applicationTypeName);
          }
          masterData.push(certificateTypesArray);
          masterData.push(applicatecateTypesArray);
          return masterData;
        }
      }).catch((err:any) => {
        console.log(err);
        this.commonServObj.logErrors(null, "SQLAccess.ts - getMasterDataBAL - inner catch", err, new Error().stack);
        return Promise.reject();
      }):Promise.reject();

    } catch (err) {
      this.commonServObj.logErrors(null, "SQLAccess.ts - getMasterDataBAL - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }
  public getSASTokenForAppendixBAL(): Promise<any> {
    try {
      let url = Constants.getAppendixToken;
      return this.apiservice?this.apiservice.getMethodAxios(url).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          return response.data.table[0].blobSASToken;
        }
      })
        .catch((err:any) => {
          console.log(err);
          this.commonServObj.logErrors(null, "SQLAccess.ts - getSASTokenForAppendixBAL - inner catch", err, new Error().stack);
          return Promise.reject();
        }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null, "SQLAccess.ts - getSASTokenForAppendixBAL - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }
  public getFeeAmount(certificateType: any, applicateType: any):Promise<any> {
    try {
      let url = Constants.GetFeeAmount;
      var body = {
        "certificate_type_id": certificateType,
        "name": applicateType
      };
      return this.apiservice?this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          return response.data.table[0].fee;
        }
      })
        .catch((err:any) => {
          console.log(err);
          this.commonServObj.logErrors(null, "SQLAccess.ts - getFeeAmount - inner catch", err, new Error().stack);
          return Promise.reject();
        }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null, "SQLAccess.ts - getFeeAmount - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }

  public InsertDraftBAL(data: IapplicationForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let appendixLinks = "";
    let comma;
    for (let i = 0; i < data.attachmentAppendixLinks.length; i++) {
      comma = i === data.attachmentAppendixLinks.length - 1 ? "" : ',';
      appendixLinks += data.attachmentAppendixLinks[i].link.split("?")[0] + comma;
    }
    let url = Constants.InsertApplication;
    var body = {
      "LoginUserEmailId": Constants.userEmail,

      "ApplicateTypeId": props.applicateType,

      "certificate_type_id": props.certificateType,

      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",

      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",

      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",

      "Applicant_ssn": data.SSN ? data.SSN.trim():"",

      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",

      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",

      "Applicant_height": height ? height : "",

      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",

      "Applicant_gender": data.gender,

      "Applicant_apartment": data.apartment,

      "Applicant_city": data.city,

      "Applicant_state":data.state? data.state.value:"",

      "Applicant_ZipCode": data.zipCode,

      //"payment_amount": data.feeAmount,

      "WorkTelephoneNumber": workNumber,

      "HomeTelephoneNumber": homeNumber,


      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,

      "CurrentEmployerName": data.employerName,

      "EmployerCity": data.employerCity,

      "EmployerState":data.employerState? data.employerState.value:"",

      "EmployerZipcode": data.employerZipCode,

      "EmployerStreetAddress": data.employerAddress,

      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",
      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState?data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State":data.schoolState? data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": data.attachmentDMVFrontLinks.length > 0 ? data.attachmentDMVFrontLinks[0].link.split("?")[0] : "",
      "DMVBackLink": data.attachmentDMVEndLinks.length > 0 ? data.attachmentDMVEndLinks[0].link.split("?")[0] : "",
      "ReceiptLink": data.attachmentReceiptLinks.length > 0 ? data.attachmentReceiptLinks[0].link.split("?")[0] : "",
      "SSCLink": data.attachmentSSCLinks.length > 0 ? data.attachmentSSCLinks[0].link.split("?")[0] : "",
      "NYSLink": data.attachmentDYSLinks.length > 0 ? data.attachmentDYSLinks[0].link.split("?")[0] : "",
      "AppendixLinks": appendixLinks,
      "OCSELink": data.attachmentOCSELinks.length > 0 ? data.attachmentOCSELinks[0].link.split("?")[0] : "",
      "ExperienceLinks": data.attachmentReferenceLinks.length > 0 ? data.attachmentReferenceLinks[0].link.split("?")[0] : "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CourseCompletionLink": data.attachmentCourseLinks.length > 0 ? data.attachmentCourseLinks[0].link.split("?")[0] : "",
      "BackgroundChekedLink": data.attachmentBackgroundCheckLinks.length > 0 ? data.attachmentBackgroundCheckLinks[0].link.split("?")[0] : "",
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {
        }
        else if (type === Constants.Save) {
          if(!hide|| hide==undefined){
        Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body, "SQLAccess.ts - InsertDraftBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - InsertDraftBAL - outer catch",err,new Error().stack);
        return Promise.reject();
    }
  }
  public saveDraftBAL(data: IapplicationForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let appendixLinks = "";
    let comma;
    for (let i = 0; i < data.attachmentAppendixLinks.length; i++) {
      comma = i === data.attachmentAppendixLinks.length - 1 ? "" : ',';
      appendixLinks += data.attachmentAppendixLinks[i].link.split("?")[0] + comma;
    }
    let url = Constants.SaveApplication;
    var body = {

      "DraftReqId": data.draftReqId,

      "LoginUserEmailId": Constants.userEmail,

      "ApplicateTypeId": props.applicateType,

      "certificate_type_id": props.certificateType,

      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",

      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",

      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",

      "Applicant_ssn": data.SSN ? data.SSN.trim():"",

      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",

      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",

      "Applicant_height": height ? height : "",

      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",

      "Applicant_gender": data.gender,

      "Applicant_apartment": data.apartment,

      "Applicant_city": data.city,

      "Applicant_state":data.state? data.state.value:"",

      "Applicant_ZipCode": data.zipCode,

      "WorkTelephoneNumber": workNumber,

      "HomeTelephoneNumber": homeNumber,

      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,

      "CurrentEmployerName": data.employerName,

      "EmployerCity": data.employerCity,

      "EmployerState":data.employerState? data.employerState.value:"",

      "EmployerZipcode": data.employerZipCode,

      "EmployerStreetAddress": data.employerAddress,

      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",
      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState?data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State":data.schoolState? data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": data.attachmentDMVFrontLinks.length > 0 ? data.attachmentDMVFrontLinks[0].link.split("?")[0] : "",
      "DMVBackLink": data.attachmentDMVEndLinks.length > 0 ? data.attachmentDMVEndLinks[0].link.split("?")[0] : "",
      "ReceiptLink": data.attachmentReceiptLinks.length > 0 ? data.attachmentReceiptLinks[0].link.split("?")[0] : "",
      "SSCLink": data.attachmentSSCLinks.length > 0 ? data.attachmentSSCLinks[0].link.split("?")[0] : "",
      "NYSLink": data.attachmentDYSLinks.length > 0 ? data.attachmentDYSLinks[0].link.split("?")[0] : "",
      "AppendixLinks": appendixLinks,
      "OCSELink": data.attachmentOCSELinks.length > 0 ? data.attachmentOCSELinks[0].link.split("?")[0] : "",
      "ExperienceLinks": data.attachmentReferenceLinks.length > 0 ? data.attachmentReferenceLinks[0].link.split("?")[0] : "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CourseCompletionLink": data.attachmentCourseLinks.length > 0 ? data.attachmentCourseLinks[0].link.split("?")[0] : "",
      "BackgroundChekedLink": data.attachmentBackgroundCheckLinks.length > 0 ? data.attachmentBackgroundCheckLinks[0].link.split("?")[0] : "",
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {
        } else if (type === Constants.Save) {
          if(!hide|| hide==undefined){
        Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body.DraftReqId, "SQLAccess.ts - saveDraftBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - saveDraftBAL - outer catch",err,new Error().stack);
        return Promise.reject();
    }
  }
  public submitApplicationBAL(data: IapplicationForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let appendixLinks = "";
    let comma;
    for (let i = 0; i < data.attachmentAppendixLinks.length; i++) {
      comma = i === data.attachmentAppendixLinks.length - 1 ? "" : ',';
      appendixLinks += data.attachmentAppendixLinks[i].link.split("?")[0] + comma;
    }
    let url = Constants.SubmitApplication;
    var body = {
      "DraftReqId": data.draftReqId,

      "LoginUserEmailId": Constants.userEmail,

      "ApplicateTypeId": props.applicateType,

      "certificate_type_id": props.certificateType,


      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",

      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",

      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",

      "Applicant_ssn": data.SSN ? data.SSN.trim():"",

      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",

      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",

      "Applicant_height": height ? height : "",

      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",

      "Applicant_gender": data.gender,

      "Applicant_apartment": data.apartment,

      "Applicant_city": data.city,

      "Applicant_state":data.state? data.state.value:"",

      "Applicant_ZipCode": data.zipCode,

      "WorkTelephoneNumber": workNumber,

      "HomeTelephoneNumber": homeNumber,


      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,

      "CurrentEmployerName": data.employerName,

      "EmployerCity": data.employerCity,

      "EmployerState":data.employerState? data.employerState.value:"",

      "EmployerZipcode": data.employerZipCode,

      "EmployerStreetAddress": data.employerAddress,

      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",
      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState?data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State":data.schoolState? data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": data.attachmentDMVFrontLinks.length > 0 ? data.attachmentDMVFrontLinks[0].link.split("?")[0] : "",
      "DMVBackLink": data.attachmentDMVEndLinks.length > 0 ? data.attachmentDMVEndLinks[0].link.split("?")[0] : "",
      "ReceiptLink": data.attachmentReceiptLinks.length > 0 ? data.attachmentReceiptLinks[0].link.split("?")[0] : "",
      "SSCLink": data.attachmentSSCLinks.length > 0 ? data.attachmentSSCLinks[0].link.split("?")[0] : "",
      "NYSLink": data.attachmentDYSLinks.length > 0 ? data.attachmentDYSLinks[0].link.split("?")[0] : "",
      "AppendixLinks": appendixLinks,
      "OCSELink": data.attachmentOCSELinks.length > 0 ? data.attachmentOCSELinks[0].link.split("?")[0] : "",
      "ExperienceLinks": data.attachmentReferenceLinks.length > 0 ? data.attachmentReferenceLinks[0].link.split("?")[0] : "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CourseCompletionLink": data.attachmentCourseLinks.length > 0 ? data.attachmentCourseLinks[0].link.split("?")[0] : "",
      "BackgroundChekedLink": data.attachmentBackgroundCheckLinks.length > 0 ? data.attachmentBackgroundCheckLinks[0].link.split("?")[0] : "",
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
          if(data.ocseStatus=="Approved"){
          await this.SendEmailForApproval(data, props).then((res:any)=>{
              Swal.fire({
                title: "Success!",
                text: "Application is submitted successfully!",
                icon: "success",
              }).then(() => {
                 window.location.href = "/dashboard";
              }).catch((err:any) => console.log(err));
            });
          }else{
            Swal.fire({
              title: "Success!",
              text: "Application is submitted successfully!",
              icon: "success",
            }).then(() => {
               window.location.href = "/dashboard";
            }).catch((err:any) => console.log(err));
          }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body.DraftReqId, "SQLAccess.ts - submitApplicationBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - submitApplicationBAL - outer catch",err,new Error().stack);
        return Promise.reject();
    }
  }

  public InsertDraftRenewalBAL(data: IRenewalForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let appendixLinks = "";
    let comma;
    for (let i = 0; i < data.attachmentAppendixLinks.length; i++) {
      comma = i === data.attachmentAppendixLinks.length - 1 ? "" : ',';
      appendixLinks += data.attachmentAppendixLinks[i].link.split("?")[0] + comma;
    }
    let url = Constants.InsertApplication;
    var body = {

      "LoginUserEmailId": Constants.userEmail,

      "ApplicateTypeId": props.applicateType,

      "certificate_type_id": props.certificateType,

      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",

      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",

      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",

      "Applicant_ssn": data.SSN ? data.SSN.trim():"",

      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",

      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",

      "Applicant_height": height ? height : "",

      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",

      "Applicant_gender": data.gender,

      "Applicant_apartment": data.apartment,

      "Applicant_city": data.city,

      "Applicant_state":data.state? data.state.value:"",

      "Applicant_ZipCode": data.zipCode,

       //"payment_amount": data.feeAmount,

      "WorkTelephoneNumber": workNumber,

      "HomeTelephoneNumber": homeNumber,

      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,

      "CurrentEmployerName": data.employerName,

      "EmployerCity": data.employerCity,

      "EmployerState":data.employerState? data.employerState.value:"",

      "EmployerZipcode": data.employerZipCode,

      "EmployerStreetAddress": data.employerAddress,

      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",

      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState? data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State":data.schoolState? data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": data.attachmentDMVFrontLinks.length > 0 ? data.attachmentDMVFrontLinks[0].link.split("?")[0] : "",
      "DMVBackLink": data.attachmentDMVEndLinks.length > 0 ? data.attachmentDMVEndLinks[0].link.split("?")[0] : "",
      "ReceiptLink": data.attachmentReceiptLinks.length > 0 ? data.attachmentReceiptLinks[0].link.split("?")[0] : "",
      "SSCLink": data.attachmentSSCLinks.length > 0 ? data.attachmentSSCLinks[0].link.split("?")[0] : "",
      "NYSLink": data.attachmentDYSLinks.length > 0 ? data.attachmentDYSLinks[0].link.split("?")[0] : "",
      "AppendixLinks": appendixLinks,
      "OCSELink": data.attachmentOCSELinks.length > 0 ? data.attachmentOCSELinks[0].link.split("?")[0] : "",
      "ExperienceLinks": "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CertificateNumber": data.certificateNoRenewal,
      "CertificateExpiryDate": data.expiryDateRenewal ? moment(data.expiryDateRenewal).format('MM/DD/YYYY') : "",
      //"IsPhysicalApplication": !data.hasCertificate
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {
        } else if (type === Constants.Save) {
          if(!hide || hide==undefined){
          Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body, "SQLAccess.ts - InsertDraftRenewalBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - InsertDraftRenewalBAL - outer catch",err,new Error().stack);
       return Promise.reject();

    }
  }
  public saveDraftRenewalBAL(data: IRenewalForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let appendixLinks = "";
    let comma;
    for (let i = 0; i < data.attachmentAppendixLinks.length; i++) {
      comma = i === data.attachmentAppendixLinks.length - 1 ? "" : ',';
      appendixLinks += data.attachmentAppendixLinks[i].link.split("?")[0] + comma;
    }
    let url = Constants.SaveApplication;
    var body = {
      "DraftReqId": data.draftReqId,

      "LoginUserEmailId": Constants.userEmail,

      "ApplicateTypeId": props.applicateType,

      "certificate_type_id": props.certificateType,

      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",

      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",

      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",

      "Applicant_ssn": data.SSN ? data.SSN.trim():"",

      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",

      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",

      "Applicant_height": height ? height : "",

      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",

      "Applicant_gender": data.gender,

      "Applicant_apartment": data.apartment,

      "Applicant_city": data.city,

      "Applicant_state":data.state? data.state.value:"",

      "Applicant_ZipCode": data.zipCode,

      "WorkTelephoneNumber": workNumber,

      "HomeTelephoneNumber": homeNumber,

      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,

      "CurrentEmployerName": data.employerName,

      "EmployerCity": data.employerCity,

      "EmployerState":data.employerState? data.employerState.value:"",

      "EmployerZipcode": data.employerZipCode,

      "EmployerStreetAddress": data.employerAddress,

      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",

      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState? data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State":data.schoolState? data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": data.attachmentDMVFrontLinks.length > 0 ? data.attachmentDMVFrontLinks[0].link.split("?")[0] : "",
      "DMVBackLink": data.attachmentDMVEndLinks.length > 0 ? data.attachmentDMVEndLinks[0].link.split("?")[0] : "",
      "ReceiptLink": data.attachmentReceiptLinks.length > 0 ? data.attachmentReceiptLinks[0].link.split("?")[0] : "",
      "SSCLink": data.attachmentSSCLinks.length > 0 ? data.attachmentSSCLinks[0].link.split("?")[0] : "",
      "NYSLink": data.attachmentDYSLinks.length > 0 ? data.attachmentDYSLinks[0].link.split("?")[0] : "",
      "AppendixLinks": appendixLinks,
      "OCSELink": data.attachmentOCSELinks.length > 0 ? data.attachmentOCSELinks[0].link.split("?")[0] : "",
      "ExperienceLinks": "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CertificateNumber": data.certificateNoRenewal,
      "CertificateExpiryDate": data.expiryDateRenewal ? moment(data.expiryDateRenewal).format('MM/DD/YYYY') : "",
      //"IsPhysicalApplication": !data.hasCertificate
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {
        } else if (type === Constants.Save) {
          if(!hide || hide==undefined){
          Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body.DraftReqId, "SQLAccess.ts - InsertDraftRenewalBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - InsertDraftRenewalBAL - outer catch",err,new Error().stack);
       return Promise.reject();

    }
  }
  public submitRenewalBAL(data: IRenewalForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let appendixLinks = "";
    let comma;
    for (let i = 0; i < data.attachmentAppendixLinks.length; i++) {
      comma = i === data.attachmentAppendixLinks.length - 1 ? "" : ',';
      appendixLinks += data.attachmentAppendixLinks[i].link.split("?")[0] + comma;
    }
    let url = Constants.SubmitApplication;
    var body = {

      "DraftReqId": data.draftReqId,

      "LoginUserEmailId": Constants.userEmail,

      "ApplicateTypeId": props.applicateType,

      "certificate_type_id": props.certificateType,


      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",

      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",

      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",

      "Applicant_ssn": data.SSN ? data.SSN.trim():"",

      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",

      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",

      "Applicant_height": height ? height : "",

      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",

      "Applicant_gender": data.gender,

      "Applicant_apartment": data.apartment,

      "Applicant_city": data.city,

      "Applicant_state":data.state? data.state.value:"",

      "Applicant_ZipCode": data.zipCode,

      "WorkTelephoneNumber": workNumber,

      "HomeTelephoneNumber": homeNumber,

      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,

      "CurrentEmployerName": data.employerName,

      "EmployerCity": data.employerCity,

      "EmployerState":data.employerState? data.employerState.value:"",

      "EmployerZipcode": data.employerZipCode,

      "EmployerStreetAddress": data.employerAddress,

      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",

      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState? data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State":data.schoolState? data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": data.attachmentDMVFrontLinks.length > 0 ? data.attachmentDMVFrontLinks[0].link.split("?")[0] : "",
      "DMVBackLink": data.attachmentDMVEndLinks.length > 0 ? data.attachmentDMVEndLinks[0].link.split("?")[0] : "",
      "ReceiptLink": data.attachmentReceiptLinks.length > 0 ? data.attachmentReceiptLinks[0].link.split("?")[0] : "",
      "SSCLink": data.attachmentSSCLinks.length > 0 ? data.attachmentSSCLinks[0].link.split("?")[0] : "",
      "NYSLink": data.attachmentDYSLinks.length > 0 ? data.attachmentDYSLinks[0].link.split("?")[0] : "",
      "AppendixLinks": appendixLinks,
      "OCSELink": data.attachmentOCSELinks.length > 0 ? data.attachmentOCSELinks[0].link.split("?")[0] : "",
      "ExperienceLinks": "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CertificateNumber": data.certificateNoRenewal,
      "CertificateExpiryDate": data.expiryDateRenewal ? moment(data.expiryDateRenewal).format('MM/DD/YYYY') : "",
      //"IsPhysicalApplication": !data.hasCertificate
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
          if(data.ocseStatus=="Approved"){
         await this.SendEmailForApproval(data, props).then((res:any)=>{
            Swal.fire({
              title: "Success!",
              text: "Application is submitted successfully!",
              icon: "success",
            }).then(() => {
               window.location.href = "/dashboard";
            }).catch((err:any) => console.log(err));
          });
        }else{
          Swal.fire({
            title: "Success!",
            text: "Application is submitted successfully!",
            icon: "success",
          }).then(() => {
             window.location.href = "/dashboard";
          }).catch((err:any) => console.log(err));
        }
        }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body, "SQLAccess.ts - submitRenewalBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - submitRenewalBAL - outer catch",err,new Error().stack);
       return Promise.reject();
    }
  }
  public InsertDraftDuplicateBAL(data: IDuplicateForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let url = Constants.InsertApplication;
    var body = {
      "LoginUserEmailId": Constants.userEmail,
      "ApplicateTypeId": props.applicateType,
      "certificate_type_id": props.certificateType,
      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",
      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",
      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",
      "Applicant_ssn": data.SSN ? data.SSN.trim():"",
      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",
      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",
      "Applicant_height": height ? height : "",
      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",
      "Applicant_gender": data.gender,
      "Applicant_apartment": data.apartment,
      "Applicant_city": data.city,
      "Applicant_state":data.state? data.state.value:"",
      "Applicant_ZipCode": data.zipCode,
      //"payment_amount": data.feeAmount,
      "WorkTelephoneNumber": workNumber,
      "HomeTelephoneNumber": homeNumber,
      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,
      "CurrentEmployerName": data.employerName,
      "EmployerCity": data.employerCity,
      "EmployerState":data.employerState? data.employerState.value:"",
      "EmployerZipcode": data.employerZipCode,
      "EmployerStreetAddress": data.employerAddress,
      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",
      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState? data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State": data.schoolState?data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": "",
      "DMVBackLink": "",
      "ReceiptLink": "",
      "SSCLink": "",
      "NYSLink": "",
      "AppendixLinks": "",
      "OCSELink": "",
      "ExperienceLinks": "",
      "ReasonLink": data.attachmentReasonLinks.length > 0 ? data.attachmentReasonLinks[0].link.split("?")[0] : "",
      "RequestChangeLink": data.attachmentRequestChangeLinks.length > 0 ? data.attachmentRequestChangeLinks[0].link.split("?")[0] : "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CertificateNumber": data.CertificateDuplicate,
      "CertificateExpiryDate": data.expiryDateDuplicate ? moment(data.expiryDateDuplicate).format('MM/DD/YYYY') : "",
      //"IsPhysicalApplication": !data.hasCertificate
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {

        } else if (type === Constants.Save) {
          if(!hide || hide==undefined){
          Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body, "SQLAccess.ts - InsertDraftDuplicateBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - InsertDraftDuplicateBAL - outer catch",err,new Error().stack);
       return Promise.reject();
    }
  }
  public saveDraftDuplicateBAL(data: IDuplicateForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let url = Constants.SaveApplication;
    var body = {
      "DraftReqId": data.draftReqId,
      "LoginUserEmailId": Constants.userEmail,
      "ApplicateTypeId": props.applicateType,
      "certificate_type_id": props.certificateType,
      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",
      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",
      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",
      "Applicant_ssn": data.SSN ? data.SSN.trim():"",
      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",
      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",
      "Applicant_height": height ? height : "",
      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",
      "Applicant_gender": data.gender,
      "Applicant_apartment": data.apartment,
      "Applicant_city": data.city,
      "Applicant_state":data.state? data.state.value:"",
      "Applicant_ZipCode": data.zipCode,
      "WorkTelephoneNumber": workNumber,
      "HomeTelephoneNumber": homeNumber,
      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,
      "CurrentEmployerName": data.employerName,
      "EmployerCity": data.employerCity,
      "EmployerState":data.employerState? data.employerState.value:"",
      "EmployerZipcode": data.employerZipCode,
      "EmployerStreetAddress": data.employerAddress,
      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",
      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState? data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State": data.schoolState?data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": "",
      "DMVBackLink": "",
      "ReceiptLink": "",
      "SSCLink": "",
      "NYSLink": "",
      "AppendixLinks": "",
      "OCSELink": "",
      "ExperienceLinks": "",
      "ReasonLink": data.attachmentReasonLinks.length > 0 ? data.attachmentReasonLinks[0].link.split("?")[0] : "",
      "RequestChangeLink": data.attachmentRequestChangeLinks.length > 0 ? data.attachmentRequestChangeLinks[0].link.split("?")[0] : "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CertificateNumber": data.CertificateDuplicate,
      "CertificateExpiryDate": data.expiryDateDuplicate ? moment(data.expiryDateDuplicate).format('MM/DD/YYYY') : "",
      //"IsPhysicalApplication": !data.hasCertificate
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {

        } else if (type === Constants.Save) {
          if(!hide || hide==undefined){
          Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body.DraftReqId, "SQLAccess.ts - saveDraftDuplicateBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - saveDraftDuplicateBAL - outer catch",err,new Error().stack);
       return Promise.reject();
    }
  }
  public submitDuplicateBAL(data: IDuplicateForm, props: any, type: any,hide?:boolean):Promise<any> {
    try{
    var homeNumber = data.homeNumber ? "(" + data.homeNumber.substring(0, 3) + ") " + data.homeNumber.substring(3, 6) + "-" + data.homeNumber.substring(6, 10) : "";
    var workNumber = data.workNumber ? "(" + data.workNumber.substring(0, 3) + ") " + data.workNumber.substring(3, 6) + "-" + data.workNumber.substring(6, 10) : "";
    let height = 0;
    if (data.feet) {
      height = data.feet.trim() ? parseInt(data.feet.trim()) * 12 : 0;
    } if (data.inches) {
      height += data.inches.trim() ? parseInt(data.inches.trim()) : 0;
    }
    let url = Constants.SubmitApplication;
    var body = {
      "DraftReqId": data.draftReqId,
      "LoginUserEmailId": Constants.userEmail,
      "ApplicateTypeId": props.applicateType,
      "certificate_type_id": props.certificateType,
      "Applicant_first_name": data.firstName ? data.firstName.trim() : "",
      "Applicant_last_name": data.lastName ? data.lastName.trim() : "",
      "Applicant_middle_name": data.middleName ? data.middleName.trim() : "",
      "Applicant_ssn": data.SSN ? data.SSN.trim():"",
      "Applicant_dmv_number": data.DMV ? data.DMV.trim() : "",
      "Applicant_dob": data.birthDay ? moment(data.birthDay).format('MM/DD/YYYY') : "",
      "Applicant_height": height ? height : "",
      "applicant_weight": data.weight ? parseInt(data.weight.trim()) : "",
      "Applicant_gender": data.gender,
      "Applicant_apartment": data.apartment,
      "Applicant_city": data.city,
      "Applicant_state":data.state? data.state.value:"",
      "Applicant_ZipCode": data.zipCode,
      "WorkTelephoneNumber": workNumber,
      "HomeTelephoneNumber": homeNumber,
      "PostingTelephoneNumber": data.postOnWebsite === "No" || data.postOnWebsite === "" ? 0 : 1,
      "CurrentEmployerName": data.employerName,
      "EmployerCity": data.employerCity,
      "EmployerState":data.employerState? data.employerState.value:"",
      "EmployerZipcode": data.employerZipCode,
      "EmployerStreetAddress": data.employerAddress,
      "StartDateofEmployment": data.employmentStartDate ? moment(data.employmentStartDate).format('MM/DD/YYYY') : "",
      "AsbestosCertificatecheck": data.hasHandlerCertificate === "" ? null : data.hasHandlerCertificate === "No" ? 0 : 1,
      "AsbestosHandlingState": data.hasHandlerCertificateOtherState === "" ? null : data.hasHandlerCertificateOtherState === "No" ? 0 : 1,
      "AsbestosCertificateStateName": data.certificateState? data.certificateState.value:"",
      "AsbestosHandlingExpiry": data.certificateExpiryDate ? moment(data.certificateExpiryDate).format('MM/DD/YYYY') : "",
      "Anyjurisdictioncheck": data.hasMisconductCharges === "" ? null : data.hasMisconductCharges === "No" ? 0 : 1,
      "criminalchargescheck": data.IsCriminalCharged === "" ? null : data.IsCriminalCharged === "No" ? 0 : 1,
      "guiltyTrialCheck": data.IsGuilty === "" ? null : data.IsGuilty === "No" ? 0 : 1,
      "licensingcheck": data.IsDisciplined === "" ? null : data.IsDisciplined === "No" ? 0 : 1,
      "Applicant_Address": data.address,
      "AsbestosCertificatevalue": data.oldCertificate,
      "AsbestosCertificatecheckexpiry": data.certificateExpiryDateOtherState ? moment(data.certificateExpiryDateOtherState).format('MM/DD/YYYY') : "",
      "School_Name": data.schoolName,
      "School_Street": data.schoolAddress,
      "School_State": data.schoolState?data.schoolState.value:"",
      "School_City": data.schoolCity,
      "School_ZipCode": data.schoolZipCode,
      "DMVFrontLink": "",
      "DMVBackLink": "",
      "ReceiptLink": "",
      "SSCLink": "",
      "NYSLink": "",
      "AppendixLinks": "",
      "OCSELink": "",
      "ExperienceLinks": "",
      "ReasonLink": data.attachmentReasonLinks.length > 0 ? data.attachmentReasonLinks[0].link.split("?")[0] : "",
      "RequestChangeLink": data.attachmentRequestChangeLinks.length > 0 ? data.attachmentRequestChangeLinks[0].link.split("?")[0] : "",
      "PhotoLink": data.attachmentPhotoLinks.length > 0 ? data.attachmentPhotoLinks[0].link.split("?")[0] : "",
      "SignatureLink": data.attachmentSignatureLinks.length > 0 ? data.attachmentSignatureLinks[0].link.split("?")[0] : "",
      "CertificateNumber": data.CertificateDuplicate,
      "CertificateExpiryDate": data.expiryDateDuplicate ? moment(data.expiryDateDuplicate).format('MM/DD/YYYY') : "",
      //"IsPhysicalApplication": !data.hasCertificate
    }

    return this.apiservice?this.apiservice.postMethodAxios(url, body).then(async (res: any) => {
      if (res && res.status === 200) {
        if (type === Constants.Next) {

        } else if (type === Constants.Save) {
          if(!hide || hide==undefined){
          Swal.fire({
            title: "Success!",
            text: "Saved successfully!",
            icon: "success",
          })
        }
        } else {
          await this.SendEmailForApproval(data, props).then((res)=>{
            Swal.fire({
              title: "Success!",
              text: "Application is submitted successfully!",
              icon: "success",
            }).then(() => {
              window.location.href = "/dashboard";
            }).catch((err:any) => console.log(err));
          });
        }
      }
      return res;
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(body.DraftReqId, "SQLAccess.ts - submitDuplicateBAL - inner catch", err, new Error().stack);
      return Promise.reject();
    }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null,"SQLAccess.ts - submitDuplicateBAL - outer catch",err,new Error().stack);
       return Promise.reject();
    }
  }
  public SendEmailForApproval(data: any, props: any):Promise<any> {
    try {
      let url = Constants.getAdminDetails;
      let url1 = Constants.SendMail
      var body = {}
      var emailString: any[] = []
      return this.apiservice?this.apiservice.postMethodAxios(url, body).then( (response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          let resArr = response.data.table;
          for (let i = 0; i < resArr.length; i++) {
            const element = resArr[i];
            emailString.push(element.loginUserEmailId);
          }
          var EmailIDs = emailString.toString()
          var EmailArray = EmailIDs.split(',')
          var body = {
            "UserEmailId": EmailArray,
            "EmailEventName": "AdminApprovalRequestEmail",
            "UserFisrtName": data.firstName.trim(),
            "UserMiddleName": data.middleName.trim(),
            "UserLastName": data.lastName.trim(),
            "CertificateType": props.certificateType,
            "PaymentStatus": "PAID",
            "ExamHallTicketLink": "",
            "AdminFisrtName": ""
          }
          return this.apiservice?this.apiservice.postMethodAxios(url1, body).then((response: any) => {
          }).catch((err:any) => { console.log(err) }):Promise.reject();
        }
      }).catch((err:any) => {
        console.log(err);
        this.commonServObj.logErrors(null, "SQLAccess.ts - SendEmailForApproval - inner catch", err, new Error().stack);
        return Promise.reject();
      }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null, "SQLAccess.ts - SendEmailForApproval - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }
  public GetStateListBAL():Promise<any> {
    try {
      let url = Constants.GetListOfState;
      let stateData: any[] = [];
      let stateTypesArray: any[] = [];
      var body = {}
      return this.apiservice?this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.table) {
          var stateTypeData = response.data.table;
          for (let item = 0; item < stateTypeData.length; item++) {
            stateTypesArray.push({ value: stateTypeData[item].stateCode, label: stateTypeData[item].stateCode });
          }
          stateData.push(stateTypesArray);
          return stateData;
        }
      }).catch((err:any) => {
        console.log(err);
        this.commonServObj.logErrors(null, "SQLAccess.ts - GetStateListBAL - inner catch", err, new Error().stack);
        return Promise.reject();
      }):Promise.reject();
    } catch (err) {
      this.commonServObj.logErrors(null, "SQLAccess.ts - GetStateListBAL - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }
  public scrollToTop() {
    try {
      document.querySelectorAll('body')[0].scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (err) {
      this.commonServObj.logErrors(null, "SQLAccess.ts - scrollToTop", err, new Error().stack);
    }
  }
}
