
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/Api/api.service';
import CommonService from 'src/app/Api/CommonService';
import SQLAccess from 'src/app/Api/SQLAccess';
import { Constants } from 'src/app/Constants/Constants';
import { IPaymentDetails } from 'src/app/Models/paymentDetails';
import { IRenewalForm } from 'src/app/Models/renewalForm';
import BlobAccess from 'src/app/Api/BlobAccess';
import Swal from 'sweetalert2';
import PaymentAccess from 'src/app/Api/PaymentAccess';
import IDScanAccess from 'src/app/Api/IDScanAccess';

@Component({
  selector: 'app-renewal-form',
  templateUrl: './renewal-form.component.html',
  styleUrls: ['./renewal-form.component.scss']
})
export class RenewalFormComponent implements OnInit,OnDestroy {
  renewalFormData = {} as IRenewalForm;
  expDate:any=moment(new Date()).format("YYYY-MM-DD");
  today:any=moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
  props:any;
  currentLogin:any;
  isLoading:boolean=false;
  showPI:boolean=true;
  showAI:boolean=false;
  showRD:boolean=false;
  showSM:boolean=false;
  ddlselectedState:boolean=true;
  ddlCertificateState:boolean=false;
  certificatePnl:boolean=false;
  statePnl:boolean=false;
  public isDMVFrontUploaded = false;
  public isDMVBackUploaded = false;
  public isReceiptUploaded = false;
  public isSSCUploaded = false;
  public isAppendixUploaded = false;
  public isSignatureUploaded = false;
  public isDYSUploaded = false;
  public isOCSEUploaded = false;
  public isReferenceUploaded = false;
  public isPhotoUploaded = false;
  public isCourseUploaded = false;
  public isBackgroundCheckUploaded = false;
  public isDMVFrontConverted = false;
  public isDMVBackConverted = false;
  public isPhotoConverted = false;
  AppendixPleacholder:any;

  pictureImage={
    isCameraPopup:false,
    attachmentPhoto:[],
    title:"Your Picture"
  }
  frontImage={
    isCameraPopup:false,
    attachmentPhoto:[],
    title:"Front of NYS Driver’s License or Non-Driver’s Identification Card"
  }
  backImage={
    isCameraPopup:false,
    attachmentPhoto:[],
    title:"Back of NYS Driver’s License or Non-Driver’s Identification Card"
  }
  constructor(private apiservice: ApiService,private route: ActivatedRoute, private authService: MsalService) {
    this.route.queryParams.subscribe(params => {this.props=params; });
  }
  sqlAccessObj = new SQLAccess(this.apiservice, this.authService);
  commonServObj = new CommonService(this.apiservice, this.authService);
  blobAccessObj = new BlobAccess(this.apiservice, this.authService);
  idScanAccessObj = new IDScanAccess(this.apiservice, this.authService);
  paymentAccessObj = new PaymentAccess(this.apiservice, this.authService);

  ngOnInit(): void {
    $('.nav-link').removeClass('active');
    $("#top-navigation li:eq(1)").after('<li class="nav-item" id="nav-app-form"><a class="nav-link active" id="nav-form" data-bs-toggle="tab" href="javascript:void(0);"}>Application Form</a></li>');
    $('#nav-form').attr('onClick', `window.location.href = # `);
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
    Constants.userEmail= this.currentLogin.username;
    this.GetStateList();
    this.getSASTokenForAppendix();
    this.getFeeAmount();
    if (this.props.id!="0") {
     this.getRequestDetailsForDraft();
      this.getVerifyStatus();
    } else {
      this.getUserDetailsForRenewalRequest();
    }
      this.renewalFormData.SSN= "";
      this.renewalFormData.DMV= "";
      this.renewalFormData.lastName= "";
      this.renewalFormData.firstName= "";
      this.renewalFormData.middleName= "";
      this.renewalFormData.address= "";
      this.renewalFormData.apartment= "";
      this.renewalFormData.city= "";
      this.renewalFormData.state= [];
      this.renewalFormData.zipCode= "";
      this.renewalFormData.postOnWebsite= "No";
      this.renewalFormData.feet= "";
      this.renewalFormData.inches= "";
      this.renewalFormData.weight= "";
      this.renewalFormData.birthDay= "";
      this.renewalFormData.gender= "";
      this.renewalFormData.homeNumber= "";
      this.renewalFormData.workNumber= "";
      this.renewalFormData.SSNValidation= "";
      this.renewalFormData.IsValidated= true;
      this.renewalFormData.employerName= "";
      this.renewalFormData.employerAddress= "";
      this.renewalFormData.employerCity= "";
      this.renewalFormData.employerState= [];
      this.renewalFormData.employerZipCode= "";
      this.renewalFormData.employmentStartDate= "";
      this.renewalFormData.IsGuilty= "";
      this.renewalFormData.IsDisciplined= "";
      this.renewalFormData.IsCriminalCharged= "";
      this.renewalFormData.hasHandlerCertificate= "";
      this.renewalFormData.hasMisconductCharges= "";
      this.renewalFormData.hasHandlerCertificateOtherState= "";
      this.renewalFormData.certificateExpiryDate= "";
      this.renewalFormData.oldCertificate= "";
      this.renewalFormData.certificateState= [];
      this.renewalFormData.certificateExpiryDateOtherState= "";
      this.renewalFormData.errorSSN= false;
      this.renewalFormData.errorDMV= false;
      this.renewalFormData.errorLastName= false;
      this.renewalFormData.errorFirstName= false;
      this.renewalFormData.errorAddress= false;
      this.renewalFormData.errorCity= false;
      this.renewalFormData.errorState= false;
      this.renewalFormData.errorZipCode= false;
      this.renewalFormData.errorBirthDay= false;
      this.renewalFormData.errorGender= false;
      this.renewalFormData.errorFeet= false;
      this.renewalFormData.errorInches= false;
      this.renewalFormData.errorWeight= false;
      this.renewalFormData.schoolName= "";
      this.renewalFormData.schoolAddress= "";
      this.renewalFormData.schoolCity= "";
      this.renewalFormData.schoolState= [];
      this.renewalFormData.schoolZipCode= "";
      this.renewalFormData.attachmentSSC= [];
      this.renewalFormData.attachmentSSCLinks= [];
      this.renewalFormData.attachmentDMVFront= [];
      this.renewalFormData.attachmentDMVFrontLinks= [];
      this.renewalFormData.attachmentDMVEnd= [];
      this.renewalFormData.attachmentDMVEndLinks= [];
      this.renewalFormData.attachmentPhoto= [];
      this.renewalFormData.attachmentPhotoLinks= [];
      this.renewalFormData.attachmentAppendices= [];
      this.renewalFormData.attachmentAppendixLinks= [];
      this.renewalFormData.attachmentSignature= [];
      this.renewalFormData.attachmentSignatureLinks= [];
      this.renewalFormData.base64DMVFront= "";
      this.renewalFormData.base64DMVBack= "";
      this.renewalFormData.base64Photo= "";
      this.showPI= this.props.payment && this.props.payment == "cancel" ? false : true;
      this.renewalFormData.showOtherInfo= false;
      this.renewalFormData.showRequiredDoc= false;
      this.renewalFormData.openCapturePhoto= false;
      this.renewalFormData.attachmentReceiptLinks= [];
      this.renewalFormData.errorHomeNumber= false;
      this.renewalFormData.errorWorkNumber= false;
      this.renewalFormData.errorSchoolName= false;
      this.renewalFormData.attachmentReceipt= [];
      this.renewalFormData.errorIsGuilty= false;
      this.renewalFormData.errorIsDisciplined= false;
      this.renewalFormData.errorIsCriminalCharged= false;
      this.renewalFormData.errorHasMisConductCharges= false;
      this.renewalFormData.errorHasHandlerCertificate= false;
      this.renewalFormData.errorOldCertificate= false;
      this.renewalFormData.errorCertificateExpiryDate= false;
      this.renewalFormData.errorHasHandlerCertificateOtherState= false;
      this.renewalFormData.errorCertificateState= false;
      this.renewalFormData.errorCertificateExpiryDateOtherState= false;
      this.renewalFormData.errorDMVIDFront= false;
      this.renewalFormData.errorDMVIDBack= false;
      this.renewalFormData.errorReceipt= false;
      this.renewalFormData.errorSSNCard= false;
      this.renewalFormData.errorNYSDOH= false;
      this.renewalFormData.errorOCSE= false;
      this.renewalFormData.errorPhoto= false;
      this.renewalFormData.errorSignature= false;
      this.renewalFormData.errorAppendix= false;
      this.isLoading= true;
      this.renewalFormData.loaderMessage="Loading...";
      this.renewalFormData.openCaptureDMVFront= false;
      this.renewalFormData.openCatureDMVBack= false;
      this.renewalFormData.showPaymentGateway= false;
      this.renewalFormData.certificateNoRenewal= "";
      this.renewalFormData.expiryDateRenewal= "";
      this.renewalFormData.attachmentDYS= [];
      this.renewalFormData.attachmentDYSLinks= [];
      this.renewalFormData.attachmentOCSE=[];
      this.renewalFormData.attachmentOCSELinks= [];
      this.renewalFormData.stateTypeValues= [];
      this.renewalFormData.selectedState= "";
      this.renewalFormData.selectedEmployerState= "";
      this.renewalFormData.selectedSchoolState= "";
      this.renewalFormData.selectedCertificateState= "";
      this.renewalFormData.hasCertificate= false;
      this.renewalFormData.draftReqId= "";
      this.showSM= this.props.payment && this.props.payment == "cancel" ? true : false;
      this.renewalFormData.feeAmount= "0";
      this.renewalFormData.nextState= true;
      this.renewalFormData.IsPaymentComplete= false;
      this.renewalFormData.errorCertificateRenewal= false;
      this.renewalFormData.errorExpiryDateRenewal= false;
      this.renewalFormData.blobSASTokenForAppendix= "";
      this.AppendixPleacholder=this.renewalFormData.attachmentAppendices.length > 0 ? "" : ((Constants.Renewal == this.props.applicateType) && (this.props.certificateType == Constants.InvestigatorCertificate || this.props.certificateType == Constants.InvestigatorRestrictedCertificate)) ? "Appendices A and B" : ""

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    $('#nav-app-form').remove();
    if (this.renewalFormData.draftReqId) {
      this.saveAsDraft(Constants.Documents, Constants.Save, true);
    }
  }

  public GetStateList() {
    try {
      this.sqlAccessObj.GetStateListBAL().then((data: any) => {
         this.renewalFormData.stateTypeValues= data[0];

      }).catch((ex) => {
        this.commonServObj.logErrors(null, "renewal-form.component.ts - GetStateList - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - GetStateList - outer catch", err, new Error().stack);

    }
  }
  alphabetsOnly (e:any) {  // Accept only alpha numerics, not special characters
    var regex = new RegExp("^[a-z A-Z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
  }
  dobError: boolean = false;
  validDOB(event: any) {
    let todayDate = moment(new Date(), 'YYYY-MM-DD').subtract(1, "days");
    let futureDate = moment(event.target.value, 'YYYY-MM-DD');
    if (futureDate.toString() == "Invalid date") {
    }
    else if (!todayDate.isAfter(futureDate)) {
      this.dobError = true;
    } else {
      this.dobError = false;
    }
  }
   disabledDate(){
    return false;
  }
  validateInput(e: any, len: any) {
    var inp = String.fromCharCode(e.keyCode);
    if (len == "9") {
      if (e.target.value.length == 9 || e.key == 'e' || e.key == '.') return false;
      if (/[0-9]/.test(inp)) { return true; }
      else {e.preventDefault(); return false; }
    }
    if (len == "25") {
      if (e.target.value.length == 25) return false;
    }
    if (len == "Name") {
      if (e.target.value.length == 25) return false;
      if (/[A-Za-z-]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
    if (len == "2") {
      if (e.target.value.length == 2 || e.key == 'e' || e.key == '.'|| (e.target.value +e.key) > 11) return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
    if (len == "1") {
      if (e.target.value.length == 1 || e.key == 'e' || e.key == '.') return false;
      if (/[1-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
    if (len == "6") {
      if (e.target.value.length == 6 || e.key == 'e' || e.key == '.') return false;
      if (/[0-9]/.test(inp)) { return true; }
      else {e.preventDefault(); return false; }
    }
    if (len == "5") {
      if (e.target.value.length == 5 || e.key == 'e') return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
    if (len == "N") {
      if ( (e.key == '/')|| (e.key == 'Enter')) return false;
    }
    if (len == "10") {
      if (e.target.value.length == 10) return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
  }
  NumbersOnly (evt:any) {  // Accept only alpha numerics, not special characters
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
  }
  public async getSASTokenForAppendix() {
    try {
      this.sqlAccessObj.getSASTokenForAppendixBAL().then((blobSASToken) => {
       this.renewalFormData.blobSASTokenForAppendix= blobSASToken;
      }).catch((ex) => {
        console.log(ex);
        this.commonServObj.logErrors(null, "renewal-form.component.ts - getSASTokenForAppendix - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - getSASTokenForAppendix - outer catch", err, new Error().stack);
    }
  }
  public async getFeeAmount() {
    try {
      this.sqlAccessObj.getFeeAmount(this.props.certificateType, this.props.applicateType).then((fee) => {
        this.renewalFormData.feeAmount= fee;
      }).catch((ex) => {
        console.log(ex);
        this.commonServObj.logErrors(null, "renewal-form.component.ts - getFeeAmount - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - getFeeAmount - outer catch", err, new Error().stack);

    }
  }
  public getRequestDetailsForDraft() {
    try {
      let url = Constants.GetDraftRequestData;
      var body = {
        "ReqId": this.props.id=="0"? this.renewalFormData.draftReqId:this.props.id,
      };
      this.isLoading= true; this.renewalFormData.loaderMessage= "Loading...";
      this.apiservice.postMethodAxios(url, body).then(async (response: any) => {
          if (
            response &&
            response.data &&
            response.data.table &&
            response.data.table.length > 0
          ) {
            let resArr = response.data.table[0];
            let calcinches = resArr.applicantHeight ? resArr.applicantHeight % 12 : 0
            let inches = resArr.applicantHeight ? resArr.applicantHeight % 12 : "";
            let feet = resArr.applicantHeight ? (resArr.applicantHeight - calcinches) / 12 : "";
            let appendicesArr = resArr.appendixLinks ? resArr.appendixLinks.split(",") : "";
            let attachmentAppendicesArr: any[] = [];
            let attachmentAppendixLinksArr: any[] = [];
            if (appendicesArr.length > 0) {
              for (var i = 0; i < appendicesArr.length; i++) {
                attachmentAppendicesArr.push({ name: this.getName(appendicesArr[i]) });
                attachmentAppendixLinksArr.push({ link: appendicesArr[i] });
              }
            }
            if (resArr.dmvFrontLink) {
              await this.ConvertBlobtoBase64(resArr.dmvFrontLink + resArr.blobSASToken, Constants.DMVFront).then((res) => {
              }).catch((err) => { console.log(err); this.isDMVFrontConverted = true; this.IsGetDataForEditComplete(); })
            } else {
              this.isDMVFrontConverted = true;
              this.IsGetDataForEditComplete();
            }
            if (resArr.dmvBackLink) {
              await this.ConvertBlobtoBase64(resArr.dmvBackLink + resArr.blobSASToken, Constants.DMVBack).then((res) => {
              }).catch((err) => { console.log(err); this.isDMVBackConverted = true; this.IsGetDataForEditComplete(); })
            } else {
              this.isDMVBackConverted = true;
              this.IsGetDataForEditComplete();
            }
            if (resArr.photoLink) {
              await this.ConvertBlobtoBase64(resArr.photoLink + resArr.blobSASToken, Constants.Photo).then((res) => {
              }).catch((err) => { console.log(err); this.isPhotoConverted = true; this.IsGetDataForEditComplete(); })
            } else {
              this.isPhotoConverted = true;
              this.IsGetDataForEditComplete();
            }
            let todayDate = moment(new Date(), 'YYYY-MM-DD');
            let futureDate = moment(resArr.applicantDOB, 'YYYY-MM-DD');
            var error = false;
            if (futureDate.toString() == "Invalid date") {

            }
            else if (!todayDate.isAfter(futureDate)) {
              error = true;
            } else {
              error = false;
            }
              this.renewalFormData.certificateNoRenewal= resArr.oldCertificateNumber ? resArr.oldCertificateNumber.trim() : "";
              this.renewalFormData.expiryDateRenewal= resArr.oldCertificateExpiryDate ? moment(resArr.oldCertificateExpiryDate).format("YYYY-MM-DD") : "";
              this.renewalFormData.DMV= resArr.applicantDMVNumber ? resArr.applicantDMVNumber : "";
              this.renewalFormData.SSN= resArr.applicantSSN ? resArr.applicantSSN : "";
              this.renewalFormData.lastName= resArr.applicantLastName ? resArr.applicantLastName : "";
              this.renewalFormData.firstName= resArr.applicantFirstName ? resArr.applicantFirstName : "";
              this.renewalFormData.middleName= resArr.applicantMiddleName ? resArr.applicantMiddleName : "";
              this.renewalFormData.address= resArr.applicantAddress ? resArr.applicantAddress : "";
              this.renewalFormData.apartment= resArr.applicantApartment ? resArr.applicantApartment : "";
              this.renewalFormData.city= resArr.applicantCity ? resArr.applicantCity : "";
              if(resArr.applicantState){
                let obj={'value':resArr.applicantState,'label':resArr.applicantState}
                this.renewalFormData.state= obj;
                this.ddlselectedState=false;
                }
                else{
                  this.renewalFormData.state=[];
                  this.ddlselectedState=true;
                }
              this.renewalFormData.zipCode= resArr.applicantZipCode ? resArr.applicantZipCode.replace("-", "") : "";
              this.renewalFormData.postOnWebsite= resArr.postingTelephoneNumber ? "Yes" : "No";
              this.renewalFormData.feet= feet.toString();
              this.renewalFormData.inches= inches.toString();
              this.renewalFormData.weight= resArr.applicantWeight ? resArr.applicantWeight.toString() : "";
              this.renewalFormData.birthDay= resArr.applicantDOB ? moment(resArr.applicantDOB).format("YYYY-MM-DD") : "";
              this.renewalFormData.errorBirthDay= error;
              this.renewalFormData.gender= resArr.applicantGender ? resArr.applicantGender : "";
              this.renewalFormData.homeNumber= resArr.homeTelephoneNumber ? resArr.homeTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "") : "";
              this.renewalFormData.workNumber= resArr.workTelephoneNumber ? resArr.workTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "") : "";
              this.renewalFormData.selectedState= resArr.applicantState ? { value: resArr.applicantState, label: resArr.applicantState } : "";
              this.renewalFormData.employerName= resArr.currentEmployerName ? resArr.currentEmployerName : "";
              this.renewalFormData.employerAddress= resArr.employerStreetAddress ? resArr.employerStreetAddress : "";
              this.renewalFormData.employerCity= resArr.employerCity ? resArr.employerCity : "";
              if(resArr.employerState){
                let obj={'value':resArr.employerState,'label':resArr.employerState}
                this.renewalFormData.employerState= obj;
                }
                else{
                  this.renewalFormData.employerState={};
                }
              this.renewalFormData.employerZipCode= resArr.employerZipcode ? resArr.employerZipcode.replace("-", "") : "";
              this.renewalFormData.employmentStartDate= resArr.startDateOfEmployment ? moment(resArr.startDateOfEmployment).format("YYYY-MM-DD") : "";
              this.renewalFormData.IsGuilty= resArr.guiltyTrialCheck == null ? "" : resArr.guiltyTrialCheck ? "Yes" : "No";
              this.renewalFormData.IsDisciplined= resArr.licensingCheck == null ? "" : resArr.licensingCheck ? "Yes" : "No";
              this.renewalFormData.IsCriminalCharged= resArr.criminalChargesCheck == null ? "" : resArr.criminalChargesCheck ? "Yes" : "No";
              this.renewalFormData.hasHandlerCertificate= resArr.asbestosCertificateCheck == null ? "" : resArr.asbestosCertificateCheck ? "Yes" : "No";
           if( this.renewalFormData.hasHandlerCertificate=="Yes") this.certificatePnl=true; else this.certificatePnl=false;
              this.renewalFormData.hasMisconductCharges= resArr.anyJurisdictionCheck == null ? "" : resArr.anyJurisdictionCheck ? "Yes" : "No";
              this.renewalFormData.hasHandlerCertificateOtherState= resArr.asbestosHandlingState == null ? "" : resArr.asbestosHandlingState ? "Yes" : "No";
            if (this.renewalFormData.hasHandlerCertificateOtherState == "Yes" && resArr.asbestosCertificateStateName=="") {
              this.ddlCertificateState = true;
            }
            else {
               this.ddlCertificateState = false;
            }
            if (this.renewalFormData.hasHandlerCertificateOtherState == "Yes") {
              this.statePnl = true;
            }
            else {
              this.statePnl = false;
            }
              this.renewalFormData.certificateExpiryDate= resArr.asbestosHandlingExpiry ? moment(resArr.asbestosHandlingExpiry).format("YYYY-MM-DD") : "";
              this.renewalFormData.oldCertificate= resArr.asbestosCertificateValue;
              if( resArr.asbestosCertificateStateName){
                let obj={'value': resArr.asbestosCertificateStateName,'label': resArr.asbestosCertificateStateName}
                this.renewalFormData.certificateState= obj;
                }
                else{
                  this.renewalFormData.certificateState={};
                }
              this.renewalFormData.certificateExpiryDateOtherState= resArr.asbestosCertificateCheckExpiry ? moment(resArr.asbestosCertificateCheckExpiry).format("YYYY-MM-DD") : "";
              this.renewalFormData.schoolName= resArr.schoolName ? resArr.schoolName : "";
              this.renewalFormData.schoolAddress= resArr.schoolStreet ? resArr.schoolStreet : "";
              this.renewalFormData.schoolCity= resArr.schoolCity ? resArr.schoolCity : "";
              if(resArr.schoolState){
                let obj={'value':resArr.schoolState,'label':resArr.schoolState}
                this.renewalFormData.schoolState= obj;
                }
                else{
                  this.renewalFormData.schoolState={};
                }
              this.renewalFormData.schoolZipCode= resArr.schoolZipCode ? resArr.schoolZipCode.replace("-", "") : "";
              this.renewalFormData.selectedEmployerState= resArr.employerState ? { value: resArr.employerState, label: resArr.employerState } : "";
              this.renewalFormData.selectedSchoolState= resArr.schoolState ? { value: resArr.schoolState, label: resArr.schoolState } : "";
              this.renewalFormData.selectedCertificateState= resArr.asbestosCertificateStateName;
              this.renewalFormData.draftReqId= this.props.id;
              this.renewalFormData.hasCertificate= resArr.isPhysicalApplication ? false : true;
              this.renewalFormData.attachmentSSC= resArr.sscLink ? [{ name: this.getName(resArr.sscLink) }] : [];
              this.renewalFormData.attachmentDMVFront= resArr.dmvFrontLink ? [this.getName(resArr.dmvFrontLink)] : [];
              this.renewalFormData.attachmentDMVEnd= resArr.dmvBackLink ? [this.getName(resArr.dmvBackLink)] : [];
              this.renewalFormData.attachmentPhoto= resArr.photoLink ? [this.getName(resArr.photoLink)] : [];
              this.renewalFormData.attachmentAppendices= attachmentAppendicesArr.length > 0 ? attachmentAppendicesArr : [];
              this.renewalFormData.attachmentOCSE= resArr.ocseLink ? [{ name: this.getName(resArr.ocseLink) }] : [];
              this.renewalFormData.attachmentDYS= resArr.nysLink ? [{ name: this.getName(resArr.nysLink) }] : [];
              this.renewalFormData.attachmentSignature= resArr.signatureLink ? [{ name: this.getName(resArr.signatureLink) }] : [];
              this.renewalFormData.attachmentReceipt= resArr.receiptLink ? [{ name: this.getName(resArr.receiptLink) }] : [];
              this.renewalFormData.attachmentSSCLinks= resArr.sscLink ? [{ link: resArr.sscLink }] : [];
              this.renewalFormData.attachmentDMVFrontLinks= resArr.dmvFrontLink ? [{ link: resArr.dmvFrontLink }] : [];
              this.renewalFormData.attachmentDMVEndLinks= resArr.dmvBackLink ? [{ link: resArr.dmvBackLink }] : [];
              this.renewalFormData.attachmentPhotoLinks= resArr.photoLink ? [{ link: resArr.photoLink }] : [];
              this.renewalFormData.attachmentAppendixLinks= attachmentAppendixLinksArr;
              this.renewalFormData.attachmentOCSELinks= resArr.ocseLink ? [{ link: resArr.ocseLink }] : [];
              this.renewalFormData.attachmentDYSLinks= resArr.nysLink ? [{ link: resArr.nysLink }] : [];
              this.renewalFormData.attachmentSignatureLinks= resArr.signatureLink ? [{ link: resArr.signatureLink }] : [];
              this.renewalFormData.attachmentReceiptLinks= resArr.receiptLink ? [{ link: resArr.receiptLink }] : [];
              this.renewalFormData.IsPaymentComplete= resArr.paymentStatus.toLowerCase() == "paid" ? true : false;
              this.renewalFormData.ocseStatus=resArr.ocseStatus?resArr.ocseStatus:""
          }
          else {
            this.isLoading= false ;
          }
        })
        .catch((err:any) => {
          this.isLoading= false ;
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "renewal-form.component.ts - getRequestDetailsForDraft - inner catch", err, new Error().stack);
        });
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - getRequestDetailsForDraft - outer catch", error, new Error().stack);
    }
  }
  public IsGetDataForEditComplete() {
    if (this.isDMVFrontConverted && this.isDMVBackConverted && this.isPhotoConverted) {
      this.isLoading= false ;
    }
  }
  public getName(url: any) {
    try {
      let urlArr: any[] = [];
      let name = "";
      if (url) {
        if (url.includes("?")) {
          urlArr = url.split("?")[0].split("/");
        } else {
          urlArr = url.split("/");
        }
        let extArr = urlArr[urlArr.length - 1].split(".");
        let ext = extArr[extArr.length - 1];
        name = urlArr[urlArr.length - 1].split("_")[0] + "." + ext;
      }
      return name;
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - getName - inner catch", error, new Error().stack);

    }
  }
  public async ConvertBlobtoBase64(blobUrl: any, type: any) {
    try {
      var headers = { "Access-Control-Allow-Origin": Constants.WebAppUrl }
      fetch(blobUrl, {
        method: "GET",
        mode: 'cors',
        headers: headers
      }).then((res) => {
        res.blob().then((blob) => {
          this.commonServObj.toBase64(blob).then((base: any) => {
            if (type == Constants.DMVFront) {
              this.renewalFormData.base64DMVFront= base.split(",")[1] ;
                this.isDMVFrontConverted = true;
                this.IsGetDataForEditComplete();
            } else if (type == Constants.DMVBack) {
              this.renewalFormData.base64DMVBack= base.split(",")[1];
                this.isDMVBackConverted = true; this.IsGetDataForEditComplete();
            } else if (type == Constants.Photo) {
              this.renewalFormData.base64Photo= base.split(",")[1];
                this.isPhotoConverted = true;
                this.IsGetDataForEditComplete();
            }
          }).catch((err) => {
            console.log(err);
            this.commonServObj.logErrors(null, "renewal-form.component.ts - ConvertBlobtoBase64 - tobase64", err, new Error().stack);
          })
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "renewal-form.component.ts - ConvertBlobtoBase64 - blob", err, new Error().stack);
        })
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "renewal-form.component.ts - ConvertBlobtoBase64 - fetch", err, new Error().stack);
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - ConvertBlobtoBase64 - outer catch", error, new Error().stack);
    }
  }
  public getVerifyStatus() {
    try {
      let url = Constants.GetDocumentVerifiedStatus;
      var body = {
        "ReqId": this.props.id=="0"? this.renewalFormData.draftReqId:this.props.id,
      }
      this.apiservice.postMethodAxios(url, body)
        .then(async (response: any) => {
          if (response && response.data && response.data.table && response.data.table.length > 0) {
            this.renewalFormData.nextState= !response.data.table[0].isVerified;
          }
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "renewal-form.component.ts - getVerifyStatus - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - getVerifyStatus - outer catch", err, new Error().stack);

    }
  }
  public getUserDetailsForRenewalRequest() {
    try {
      this.isLoading= true;
      this.renewalFormData.loaderMessage="Loading...";
      let url = Constants.getDataForRenewalForm;
      var body = {
        "LoginUserEmailId": Constants.userEmail,
        "certificate_type_id": this.props.certificateType
      };

      this.apiservice.postMethodAxios(url, body)
        .then((response: any) => {
          if (
            response &&
            response.data &&
            response.data.table &&
            response.data.table.length > 0
          ) {
            let resArr = response.data.table[0];
            let calcinches = resArr.applicantHeight ? resArr.applicantHeight % 12 : 0;
            let inches = resArr.applicantHeight ? resArr.applicantHeight % 12 : "";
            let feet = resArr.applicantHeight ? (resArr.applicantHeight - calcinches) / 12 : "";

              this.renewalFormData.certificateNoRenewal= resArr.certificateNumber.trim();
              this.renewalFormData.expiryDateRenewal= moment(resArr.expiresOn).format("YYYY-MM-DD");
              this.renewalFormData.DMV= resArr.applicantDMVNumber ? resArr.applicantDMVNumber : "";
              this.renewalFormData.SSN= resArr.applicantSSN ? resArr.applicantSSN : "";
              this.renewalFormData.lastName= resArr.applicantLastName ? resArr.applicantLastName : "";
              this.renewalFormData.firstName= resArr.applicantFirstName ? resArr.applicantFirstName : "";
              this.renewalFormData.middleName= resArr.applicantMiddleName ? resArr.applicantMiddleName : "";
              this.renewalFormData.address= resArr.applicantAddress ? resArr.applicantAddress : "";
              this.renewalFormData.apartment= resArr.applicantApartment ? resArr.applicantApartment : "";
              this.renewalFormData.city= resArr.applicantCity ? resArr.applicantCity : "";
              // this.renewalFormData.state= resArr.applicantState;
              if(resArr.applicantState){
                let obj={'value':resArr.applicantState,'label':resArr.applicantState}
                this.renewalFormData.state= obj;
                this.ddlselectedState=false;
                }
                else{
                  this.renewalFormData.state=[];
                  this.ddlselectedState=true;
                }

              this.renewalFormData.zipCode= resArr.applicantZipCode.replace("-", "");
              this.renewalFormData.postOnWebsite= resArr.postingTelephoneNumber ? "Yes" : "No";
              this.renewalFormData.feet= feet.toString();
              this.renewalFormData.inches= inches.toString();
              this.renewalFormData.weight= resArr.applicantWeight.toString();
              this.renewalFormData.birthDay= moment(resArr.applicantDOB).format("YYYY-MM-DD");
              this.renewalFormData.gender= resArr.applicantGender;
              this.renewalFormData.homeNumber= resArr.homeTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
              this.renewalFormData.workNumber= resArr.workTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
              this.renewalFormData.selectedState= { value: resArr.applicantState, label: resArr.applicantState };
              this.renewalFormData.hasCertificate= true;
              this.isLoading= false;
          }
          else {
            this.renewalFormData.hasCertificate= false;
            this.isLoading= false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.isLoading= false;
          this.commonServObj.logErrors(null, "renewal-form.component.ts - getUserDetailsForDuplicateRequest - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - getUserDetailsForDuplicateRequest - outer catch", err, new Error().stack);

    }
  }
  saveAsDraftforPI(){
    this.saveAsDraft(Constants.Personal, Constants.Save);
  }

  changeState(e:any){
  if(e){
    this.ddlCertificateState=false;
    }
    else{
      this.ddlCertificateState=true;
    }
  }

  changeStates(e: any) {
    if(e){
    this.ddlselectedState=false;
    }
    else{
      this.ddlselectedState=true;
    }
  }
  public checkValidationsOI() {
    try {
      this.renewalFormData.oldCertificate=this.renewalFormData.oldCertificate.toString();
      if ((this.renewalFormData.schoolName.trim().length == 0 ||
        this.renewalFormData.IsGuilty.length == 0 ||
        this.renewalFormData.IsDisciplined.length == 0 ||
        this.renewalFormData.IsCriminalCharged.length == 0 ||
        this.renewalFormData.hasMisconductCharges.length == 0 ||
        this.renewalFormData.hasHandlerCertificate.length == 0 ||
        this.renewalFormData.hasHandlerCertificateOtherState.length == 0) ||
        (this.renewalFormData.hasHandlerCertificate == "Yes" && (this.renewalFormData.oldCertificate.trim().length == 0 || this.renewalFormData.certificateExpiryDate == ""))
        || (this.renewalFormData.hasHandlerCertificateOtherState == "Yes" && (this.renewalFormData.certificateState.value.trim().length == 0 || this.renewalFormData.certificateExpiryDateOtherState == ""))) {

      } else {
        $(window).scrollTop(0);
        this.saveAsDraft(Constants.Additional, Constants.Next);

      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - checkValidationsOI", ex, new Error().stack);
    }
  }
  backPI(){
    this.showAI=false;
    this.showPI=true;
    this.showRD=false;
    this.showSM=false;
    this.renewalFormData.showPaymentGateway= false;
    this.renewalFormData.showSummary=false ;
  }
  backAI(){
    this.showAI=true;
    this.showPI=false;
    this.showRD=false;
    this.showSM=false;
   this.renewalFormData.showPaymentGateway= false;
   this.renewalFormData.showSummary=false ;
  }
  backRD(){
    this.showAI=false;
    this.showPI=false;
    this.showRD=true;
    this.showSM=false;
   this.renewalFormData.showPaymentGateway= false;
   this.renewalFormData.showSummary=false ;
  }
  showcertificatePnl(){
    this.certificatePnl=true;
  }
  hidecertificatePnl(){
    this.certificatePnl=false;
    this.renewalFormData.certificateExpiryDate="";
    this.renewalFormData.oldCertificate="";
  }
  showstatePnl(){
    this.statePnl=true;
    this.renewalFormData.selectedCertificateState="";
    this.renewalFormData.certificateState=[];
    this.ddlCertificateState=false;
  }
  hidestatePnl(){
    this.statePnl=false;
    this.renewalFormData.certificateExpiryDateOtherState="";
    this.renewalFormData.selectedCertificateState="";
    this.renewalFormData.certificateState=[];
    this.ddlCertificateState=false;
  }
  savePI(){
    this.checkValidationsPI();
  }
  public saveAsDraft(type: any, button: any, hideMessage?: any) {
    try {
     this.renewalFormData.DMV= this.renewalFormData.DMV.toString();
     this.renewalFormData.SSN= this.renewalFormData.SSN.toString();
     this.renewalFormData.feet= this.renewalFormData.feet.toString();
     this.renewalFormData.inches= this.renewalFormData.inches.toString();
     this.renewalFormData.weight= this.renewalFormData.weight.toString();
     this.renewalFormData.zipCode= this.renewalFormData.zipCode.toString();
     this.renewalFormData.homeNumber= this.renewalFormData.homeNumber.toString();
     this.renewalFormData.workNumber=  this.renewalFormData.workNumber.toString();
      if (type != Constants.Documents) {
        if (type == Constants.Personal) {
          if (
            this.renewalFormData.certificateNoRenewal.trim().length != 0 ||
            this.renewalFormData.expiryDateRenewal != "" ||
            this.renewalFormData.firstName.trim().length != 0 ||
            this.renewalFormData.lastName.trim().length != 0 ||
            this.renewalFormData.DMV.trim().length != 0 ||
            this.renewalFormData.SSN.trim().length != 0 ||
            this.renewalFormData.birthDay != "" ||
            this.renewalFormData.feet.trim().length != 0 ||
            this.renewalFormData.inches.trim().length != 0 ||
            this.renewalFormData.weight.trim().length != 0 ||
            this.renewalFormData.gender != "" ||
            this.renewalFormData.address.trim().length != 0 ||
            this.renewalFormData.zipCode.trim().length != 0 ||
            this.renewalFormData.city.trim().length != 0 ||
            (this.renewalFormData.state != null &&
              this.renewalFormData.state.length != 0) ||
            this.renewalFormData.homeNumber.trim().length != 0
          ) {
            this.isLoading= true; this.renewalFormData.loaderMessage= "Saving...";
            if (this.props.id!="0" || this.renewalFormData.draftReqId) {

            this.sqlAccessObj.saveDraftRenewalBAL(this.renewalFormData, this.props, button).then((res: any) => {
              this.isLoading= false;
              if (res && res.data) {
                if(button=="Next"){
                  this.showPI=false; this.showAI=true;this.showRD=false; this.showSM=false;
                }
                this.renewalFormData.draftReqId= res.data ;
              }

            }).catch((err: any) => {
              this.isLoading=false;
              console.log(err);
              this.commonServObj.logErrors(null, "renewal-form.component.ts - saveAsDraft - personal", err, new Error().stack);

            });
          }else{
            this.sqlAccessObj.InsertDraftRenewalBAL(this.renewalFormData, this.props, button).then((res) => {
              this.isLoading= false;
              if(res && res.data=="InProgress"){
                Swal.fire({
                  title: "Warning!",
                  text: Constants.RestrictMessage,
                  icon: "warning",
                })
              }
              else if (res && res.data) {
                if(button=="Next"){
                  this.showPI=false; this.showAI=true;this.showRD=false; this.showSM=false;
                }
                this.renewalFormData.draftReqId=res.data;
              }

            }).catch((err:any) => {
              this.isLoading= false;
              this.commonServObj.logErrors(null, "renewal-form.component.ts - saveAsDraft - Insert - personal", err, new Error().stack);
            });
          }
          } else {
            Swal.fire({
              title: "Warning!",
              text: "Please provide values for atleast one of the mandatory fields to save as draft!",
              icon: "warning"
            }).then(() => {

            }).catch((err:any) => console.log(err));
          }
        } else {
          this.isLoading= true; this.renewalFormData.loaderMessage= "Saving...";
          this.sqlAccessObj.saveDraftRenewalBAL(this.renewalFormData, this.props, button).then((res) => {
           this.isLoading= false ;
            if (res && res.data) {
              if(button=="Next" && type=="Additional"){
                this.showPI=false; this.showAI=false;this.showRD=true; this.showSM=false;
              }
              this.renewalFormData.draftReqId=res.data ;
            }

          }).catch((err) => {
           this.isLoading= false ;
            console.log(err);
            this.commonServObj.logErrors(null, "renewal-form.component.ts - saveAsDraft - Additional", err, new Error().stack);
          });
        }
      } else {
        this.isLoading= true ;
        this.uploadDocumentsToBlob(false, button, hideMessage);
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - saveAsDraft - outer catch", error, new Error().stack);

    }
  }
  public async uploadDocumentsToBlob(scan: boolean, reqType: any, hideMessage?: boolean) {
    try {
      let receiptUrl: any[] = []; let sscUrl: any[] = []; let dysUrl: any[] = [];
      let appendicesUrl: any[] = this.renewalFormData.attachmentAppendixLinks;
      let ocseUrl: any[] = [];
      let referenceUrl: any[] = [];
      let signatureUrl: any[] = [];
      let photoUrl: any[] = [];
      let dmvFrontUrl: any[] = [];
      let dmvBackUrl: any[] = [];
      if (!scan) {
        if (this.renewalFormData.base64Photo && this.renewalFormData.attachmentPhotoLinks.length == 0) {
          await this.blobAccessObj.uploadToBlobBALID(Constants.Photo, this.renewalFormData.base64Photo).then((url:any) => {
            if (url) {
              photoUrl.push({ link: url });
            }
            this.renewalFormData.attachmentPhotoLinks= photoUrl;
              this.isPhotoUploaded = true;
              this.postRequest(reqType, hideMessage);
          });
        } else {
          this.isPhotoUploaded = true;
          this.postRequest(reqType, hideMessage);
        }
      } else {
        this.isPhotoUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (reqType == Constants.Save) {
        if (this.renewalFormData.base64DMVFront && this.renewalFormData.attachmentDMVFrontLinks.length == 0) {
          await this.blobAccessObj.uploadToBlobBALID(Constants.DMVFront, this.renewalFormData.base64DMVFront).then((url) => {
            if (url) {
              dmvFrontUrl.push({ link: url });
            }
            this.renewalFormData.attachmentDMVFrontLinks= dmvFrontUrl;
              this.isDMVFrontUploaded = true;
              this.postRequest(reqType, hideMessage);
          });
        }
        else {
          this.isDMVFrontUploaded = true;
          this.postRequest(reqType, hideMessage);
        }
      } else {
        this.isDMVFrontUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (reqType == Constants.Save) {
        if (this.renewalFormData.base64DMVBack && this.renewalFormData.attachmentDMVEndLinks.length == 0) {
          await this.blobAccessObj.uploadToBlobBALID(Constants.DMVBack, this.renewalFormData.base64DMVBack).then((url) => {
            if (url) {
              dmvBackUrl.push({ link: url });
            }
            this.renewalFormData.attachmentDMVEndLinks= dmvBackUrl ;
              this.isDMVBackUploaded = true;
              this.postRequest(reqType, hideMessage);
          });
        }
        else {
          this.isDMVBackUploaded = true;
          this.postRequest(reqType, hideMessage);
        }
      } else {
        this.isDMVBackUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (this.renewalFormData.attachmentSSC.length > 0 && this.renewalFormData.attachmentSSCLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.renewalFormData.attachmentSSC[0], Constants.SSC).then((url) => {
          if (url) {
            sscUrl.push({ link: url });
          }
          this.renewalFormData.attachmentSSCLinks= sscUrl;
            this.isSSCUploaded = true;
            this.postRequest(reqType, hideMessage);
        }).catch((err) => {
          console.log(err);
          this.isSSCUploaded = true;
          this.postRequest(reqType, hideMessage);
        })
      } else {
        this.isSSCUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (this.renewalFormData.attachmentDYS.length > 0 && this.renewalFormData.attachmentDYSLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.renewalFormData.attachmentDYS[0], Constants.DYS).then((url) => {
          if (url) {
            dysUrl.push({ link: url });
          }
        this.renewalFormData.attachmentDYSLinks= dysUrl ;
            this.isDYSUploaded = true;
            this.postRequest(reqType, hideMessage);
        }).catch((err) => {
          console.log(err);
          this.isDYSUploaded = true;
          this.postRequest(reqType, hideMessage);
        });
      } else {
        this.isDYSUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (this.renewalFormData.attachmentOCSE.length > 0 && this.renewalFormData.attachmentOCSELinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.renewalFormData.attachmentOCSE[0], Constants.OCSE).then((url) => {
          if (url) {
            ocseUrl.push({ link: url });
          }
          this.renewalFormData.attachmentOCSELinks = ocseUrl;
            this.isOCSEUploaded = true;
            this.postRequest(reqType, hideMessage);
        }).catch((err) => {
          console.log(err);
          this.isOCSEUploaded = true;
          this.postRequest(reqType, hideMessage);
        })
      } else {
        this.isOCSEUploaded = true;
        this.postRequest(reqType, hideMessage);
      }

      if (this.renewalFormData.attachmentSignature.length > 0 && this.renewalFormData.attachmentSignatureLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.renewalFormData.attachmentSignature[0], Constants.Signature).then((url) => {
          if (url) {
            signatureUrl.push({ link: url });
          }
          this.renewalFormData.attachmentSignatureLinks= signatureUrl ;
            this.isSignatureUploaded = true;
            this.postRequest(reqType, hideMessage);
        }).catch((err) => {
          console.log(err);
          this.isSignatureUploaded = true;
          this.postRequest(reqType, hideMessage);
        })
      } else {
        this.isSignatureUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (this.renewalFormData.attachmentAppendices.length > 0) {
        if (this.renewalFormData.attachmentAppendices.length != this.renewalFormData.attachmentAppendixLinks.length) {
          for (let i = this.renewalFormData.attachmentAppendixLinks.length; i < this.renewalFormData.attachmentAppendices.length; i++) {
            if (this.renewalFormData.attachmentAppendices.length != this.renewalFormData.attachmentAppendixLinks.length && this.renewalFormData.attachmentAppendices[i].type) {
              await this.blobAccessObj.uploadToBlobBAL(this.renewalFormData.attachmentAppendices[i], Constants.Appendix).then((url) => {
                if (url) {
                  appendicesUrl.push({ link: url });
                }

              }).catch((err) => {
                console.log(err);
                this.isAppendixUploaded = true;
              });
            }
          }
          this.renewalFormData.attachmentAppendixLinks= appendicesUrl;
            this.isAppendixUploaded = true;
            this.postRequest(reqType, hideMessage);
        } else {
          this.isAppendixUploaded = true;
          this.postRequest(reqType, hideMessage);
        }


      } else {
        this.isAppendixUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (this.renewalFormData.attachmentReceipt.length > 0 && this.renewalFormData.attachmentReceiptLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.renewalFormData.attachmentReceipt[0], Constants.Receipt).then((url) => {
          if (url) {
            receiptUrl.push({ link: url });
          }
          this.renewalFormData.attachmentReceiptLinks= receiptUrl;
            this.isReceiptUploaded = true;
            this.postRequest(reqType, hideMessage);
        }).catch((err) => {
          console.log(err);
          this.isReceiptUploaded = true;
          this.postRequest(reqType, hideMessage);
        });
      } else {
        this.isReceiptUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - uploadDocumentsToBlob outer catch", error, new Error().stack);
    }
  }
  public postRequest(reqType: any, hideMessage?: boolean) {
    try {
      if (this.isReceiptUploaded && this.isSSCUploaded && this.isAppendixUploaded
        && this.isSignatureUploaded && this.isDYSUploaded && this.isOCSEUploaded && this.isDMVFrontUploaded
        && this.isDMVBackUploaded && this.isPhotoUploaded) {
          this.renewalFormData.loaderMessage= reqType == Constants.Submit ? "Submitting..." : "Saving..." ;
          if(reqType == Constants.Submit){
            this.sqlAccessObj.submitRenewalBAL(this.renewalFormData, this.props, reqType, hideMessage).then((res) => {
              this.isLoading=false;
             }).catch((err) => {
               this.isLoading=false;
               console.log(err);
               this.commonServObj.logErrors(null, "renewal-form.component.ts - submitRenewalBAL", err, new Error().stack);
             });
          }
          else{
          this.sqlAccessObj.saveDraftRenewalBAL(this.renewalFormData, this.props, reqType, hideMessage).then((res) => {
         this.isLoading= false;
          this.renewalFormData.draftReqId= res && res.data ? res.data : "";
         if (res && res.data){
          if(reqType==="Next"){
          this.showAI=false; this.showPI=false; this.showRD=false; this.showSM=true;
          }
        }
        }).catch((err) => {
          this.isLoading= false;
          console.log(err)
          this.commonServObj.logErrors(null, "renewal-form.component.ts - saveDraftBAL", err, new Error().stack);
        });
      }
        this.isReceiptUploaded = false;
        this.isSSCUploaded = false;
        this.isAppendixUploaded = false;
        this.isSignatureUploaded = false;
        this.isDYSUploaded = false;
        this.isOCSEUploaded = false;
        this.isReferenceUploaded = false;
        this.isPhotoUploaded = false;
        this.isCourseUploaded = false;
        this.isBackgroundCheckUploaded = false;
        this.isDMVFrontUploaded = false;
        this.isDMVBackUploaded = false;
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - postRequest outer catch", error, new Error().stack);
    }
  }
  public checkValidationsPI() {
    try {
      this.renewalFormData.DMV= this.renewalFormData.DMV.toString();
      this.renewalFormData.SSN= this.renewalFormData.SSN.toString();
      this.renewalFormData.feet= this.renewalFormData.feet.toString();
      this.renewalFormData.inches= this.renewalFormData.inches.toString();
      this.renewalFormData.weight= this.renewalFormData.weight.toString();
      this.renewalFormData.zipCode= this.renewalFormData.zipCode.toString();
      this.renewalFormData.homeNumber= this.renewalFormData.homeNumber.toString();
      this.renewalFormData.workNumber=  this.renewalFormData.workNumber.toString();
      if (
        this.renewalFormData.certificateNoRenewal.trim().length == 0 ||
        this.renewalFormData.expiryDateRenewal == "" ||
        this.renewalFormData.firstName.trim().length == 0 ||
        this.renewalFormData.lastName.trim().length == 0 ||
        this.renewalFormData.DMV.trim().length == 0 ||
        this.renewalFormData.SSN.trim().length == 0 ||
        this.renewalFormData.birthDay == "" ||
        this.renewalFormData.feet.trim().length == 0 ||
        this.renewalFormData.inches.trim().length == 0 ||
        this.renewalFormData.weight.trim().length == 0 ||
        this.renewalFormData.gender == "" ||
        this.renewalFormData.address.trim().length == 0 ||
        this.renewalFormData.zipCode.trim().length == 0 ||
        this.renewalFormData.city.trim().length == 0 ||
        this.renewalFormData.state.value.trim().length == 0 ||
        this.renewalFormData.homeNumber.trim().length == 0
      ) {

      } else {
        $(window).scrollTop(0);
        this.saveAsDraft(Constants.Personal, Constants.Next);

      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - checkValidationsPI", ex, new Error().stack);
    }
  }
  public updateVerifyStatus() {
    try {
      let url = Constants.UpdateDocumentVerifiedStatus;
      var body = {
        "ReqId": this.props.id=="0" ? this.renewalFormData.draftReqId:this.props.id,
        //"IsVerified": verifiedValue
      }
      this.apiservice
        .postMethodAxios(url, body)
        .then(async (response: any) => {
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "renewal-form.component.ts - updateVerifyStatus - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - updateVerifyStatus - outer catch", err, new Error().stack);
    }
  }
  public updateDocumentVerifiedStatus() {
    try {
      let url = Constants.UpdateDocumentStatus;
      var body = {
        "ReqId": this.props.id=="0" ? this.renewalFormData.draftReqId:this.props.id,
      }
      this.apiservice
        .postMethodAxios(url, body)
        .then(async (response: any) => {
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "renewal-form.component.ts - updateDocumentVerifiedStatus - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - updateDocumentVerifiedStatus - outer catch", err, new Error().stack);
    }
  }
  changeImg(e:any, type:any){
    this.handleAttachments(e, type);
  }
  handleAttachments(e: any, type: any) {
    try {
      let errorType = "";
      var isValid = true;
      for (let i = 0; i < e.target.files.length; i++) {
        if (Constants.fileExtensionsAllowed.indexOf(e.target.files[0].name.split('.').pop().toLowerCase()) == -1) {
          isValid = false;
          errorType = "filetype";
          break;
        }
      }
      for (let i = 0; i < e.target.files.length; i++) {
        if (this.commonServObj.isFileSizeValid(e.target.files[i], type)) {
        } else {
          errorType = "filesize";
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        if (errorType == "filetype") {
          if (type == "DMVFront" || type == "DMVEnd" || type == "Photo") {
            Swal.fire("Only the attachments with these extensions are allowed(.png, .jpeg, .jpg )!")
          } else {
            Swal.fire("Only the attachments with these extensions are allowed(.png, .jpeg, .jpg, .pdf )!")
          }        } else {
          if (type == "DMVFront" || type == "DMVEnd" || type == "Photo") {
            Swal.fire("Attachment size should not exceed 4mb!");
          } else {
            Swal.fire("Attachment size should not exceed 10mb!");
          }
        }
        return false;
      } else {
        if (type == "DMVFront" || type == "DMVEnd" || type == "Photo") {
          this.renewalFormData.nextState=true;
          this.updateVerifyStatus();
          this.validateID(e, type);
        } else {
          this.FileAttach(e, type);
        }
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - handleAttachments - outer catch", error, new Error().stack);

    }
  }
  public async validateID(e: any, type: any) {
    try {
      this.commonServObj.toBase64(e.target.files[0]).then(async (result: any) => {
        let name = e.target.files[0].name;
        let nameArr: any[] = [];
        nameArr.push(name);
        if (type == "DMVFront") {
          this.renewalFormData.base64DMVFront= result.split(",")[1];this.renewalFormData.attachmentDMVFront= nameArr;
        } else if (type == "DMVEnd") {
          this.renewalFormData.base64DMVBack= result.split(",")[1]; this.renewalFormData.attachmentDMVEnd= nameArr;
        } else if (type == "Photo") {
          this.renewalFormData.base64Photo= result.split(",")[1]; this.renewalFormData.attachmentPhoto= nameArr;
        }
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "renewal-form.component.ts - validateID - inner catch", err, new Error().stack);
      })
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - validateID - outer catch", ex, new Error().stack);
    }
  }
  public async FileAttach(e: any, type: any) {
    try {
      let files = e.target.files;
      let data: any[] = [];
      for (let i = 0; i < files.length; i++) {
        let name = e.target.files[i];
        data.push(name);
      }
      if (type == "SSC") {
        this.renewalFormData.attachmentSSC= data;
      } else if (type == "DYS") {
        this.renewalFormData.attachmentDYS= data;
      } else if (type == "Appendix") {
        let duplicateAttachments: any[] = [];
        if (this.renewalFormData.attachmentAppendices && this.renewalFormData.attachmentAppendices.length > 0) {
          this.renewalFormData.attachmentAppendices.forEach((p: any) => {
            for (let i = 0; i < files.length; i++) {
              if (e.target.files[i].name == p.name) {
                duplicateAttachments.push(p.name);
              }
            }
          });
        }
        if (duplicateAttachments.length > 0) {
          let msg = duplicateAttachments.length > 1 ? "The selected files " + duplicateAttachments.toString() + " have already been attached!" : "The selected file " + duplicateAttachments.toString() + " has already been attached!"
          Swal.fire(msg);
          $("#attachment-appendix").val("");
        }
        else {
          this.renewalFormData.attachmentAppendices= this.renewalFormData.attachmentAppendices.concat(data);
        }
      } else if (type == "OCSE") {
        this.renewalFormData.attachmentOCSE= data;
      } else if (type == "Receipt") {
        this.renewalFormData.attachmentReceipt= data;
      } else if (type == "Signature") {
        this.renewalFormData.attachmentSignature= data;
      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - FileAttach", ex, new Error().stack);
    }
  }
  public removeAttachment(index: any, type: any) {
    try {
      let attachments: String[] = type == "SSC" ? this.renewalFormData.attachmentSSC : type == "DYS" ? this.renewalFormData.attachmentDYS
        : type == "Appendix" ? this.renewalFormData.attachmentAppendices : type == "OCSE" ? this.renewalFormData.attachmentOCSE : type == "DMVFront" ?
          this.renewalFormData.attachmentDMVFront : type == "DMVEnd" ? this.renewalFormData.attachmentDMVEnd : type == "Photo" ? this.renewalFormData.attachmentPhoto :
            type == "Receipt" ? this.renewalFormData.attachmentReceipt :
              type == "Signature" ? this.renewalFormData.attachmentSignature : [];
      let attachmentLinks = type == "SSC" ? this.renewalFormData.attachmentSSCLinks : type == "DYS" ? this.renewalFormData.attachmentDYSLinks
        : type == "Appendix" ? this.renewalFormData.attachmentAppendixLinks : type == "OCSE" ? this.renewalFormData.attachmentOCSELinks : type == "DMVFront" ?
          this.renewalFormData.attachmentDMVFrontLinks : type == "DMVEnd" ? this.renewalFormData.attachmentDMVEndLinks : type == "Photo" ? this.renewalFormData.attachmentPhotoLinks :
            type == "Receipt" ? this.renewalFormData.attachmentReceiptLinks : type == "Signature" ? this.renewalFormData.attachmentSignatureLinks : [];

      attachments.splice(index, 1);
      let deleteFile = attachmentLinks.length > 0 ? attachmentLinks[index] : "";
      if ((type == "DMVFront" || type == "DMVEnd" || type == "Photo")) {
        this.renewalFormData.nextState= true;
        this.updateVerifyStatus();
      }
      if (deleteFile && deleteFile.link) {
        this.blobAccessObj.deleteFileFromBlobBAL(this.commonServObj.getNameForDelete(deleteFile.link));
      }
      if (attachmentLinks && attachmentLinks.length > 0) {
        attachmentLinks.splice(index, 1);
      }
      if (type == "SSC") {
        $("#attachment-SSC").val("");
          this.renewalFormData.attachmentSSC= attachments;
         this.renewalFormData.attachmentSSCLinks= attachmentLinks;
      } else if (type == "DYS") {
        $("#attachment-DYS").val("");
          this.renewalFormData.attachmentDYS= attachments;
          this.renewalFormData.attachmentDYSLinks= attachmentLinks;
      } else if (type == "Appendix") {
        $("#attachment-appendix").val("");
         this.renewalFormData.attachmentAppendices= attachments;
         this.renewalFormData.attachmentAppendixLinks= attachmentLinks;
      } else if (type == "OCSE") {
        $("#attachment-OCSE").val("");
          this.renewalFormData.attachmentOCSE= attachments;
          this.renewalFormData.attachmentOCSELinks= attachmentLinks;
      } else if (type == "DMVFront") {
        $("#attachment-DMVFront").val("");
          this.renewalFormData.base64DMVFront= "";
          this.renewalFormData.attachmentDMVFront= attachments;
          this.renewalFormData.attachmentDMVFrontLinks= attachmentLinks;
      } else if (type == "DMVEnd") {
        $("#attachment-DMVBack").val("");
          this.renewalFormData.base64DMVBack= "";
          this.renewalFormData.attachmentDMVEnd= attachments;
          this.renewalFormData.attachmentDMVEndLinks= attachmentLinks;
      } else if (type == "Photo") {
        $("#attachment-photo").val("");
          this.renewalFormData.base64Photo= "";
          this.renewalFormData.attachmentPhoto= attachments;
          this.renewalFormData.attachmentPhotoLinks= attachmentLinks;
      } else if (type == "Signature") {
        $("#attachment-signature").val("");
          this.renewalFormData.attachmentSignature= attachments;
          this.renewalFormData.attachmentSignatureLinks= attachmentLinks;
      } else if (type == "Receipt") {
        $("#attachment-receipt").val("");
          this.renewalFormData.attachmentReceipt= attachments;
          this.renewalFormData.attachmentReceiptLinks= attachmentLinks;
      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - removeAttachment - outer catch", ex, new Error().stack);
    }
  }
  public checkValidationsRD_RemoveScan() {
    try {
      if (((this.renewalFormData.attachmentDMVFront.length > 0 &&
        this.renewalFormData.attachmentDMVEnd.length > 0) || (this.renewalFormData.attachmentDMVFront.length == 0 ||
          this.renewalFormData.attachmentDMVEnd.length == 0)) && this.renewalFormData.attachmentDYS.length > 0 &&
        ((this.props.certificateType == Constants.InvestigatorCertificate && this.renewalFormData.attachmentAppendices.length > 0) || this.renewalFormData.attachmentAppendices.length == 0) &&
        (this.renewalFormData.attachmentSSC.length > 0 ) &&
        this.renewalFormData.attachmentPhoto.length > 0 && this.renewalFormData.attachmentSignature.length > 0)
         {
        $(window).scrollTop(0);
        if (this.renewalFormData.attachmentDMVFront.length == 0 && this.renewalFormData.attachmentDMVEnd.length == 0) {
          if (this.renewalFormData.IsPaymentComplete) {
            this.saveAsDraft(Constants.Documents, Constants.Submit);
          } else {
            this.saveAsDraft(Constants.Documents, Constants.Next);

          }
        } else {
          this.verifyIDRemoveScan()
        }

      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Missing Mandatory Information',
          text: 'You must upload all the mandatory Documents denoted by * sign.'
        })
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - checkValidationsRD_RemovingScan", error, new Error().stack);
    }
  }
  public verifyIDRemoveScan() {
    try {
      let linkDataDMVFront: any[] = [];
      let linkDataDMVBack: any[] = [];
      let linkDataPhoto: any[] = [];
      this.idScanAccessObj.checkIDBALRemovingScan(this.renewalFormData.base64DMVFront, this.renewalFormData.base64DMVBack, this.renewalFormData.base64Photo).then((res: any) => {
        if (res && res.length > 0) {
          let frontUrl = res[0].DMVFront;
          let backUrl = res[1].DMVBack;
          let photoUrl = res[2].Photo;

          linkDataDMVFront.push({ link: frontUrl });
          linkDataDMVBack.push({ link: backUrl });
          linkDataPhoto.push({ link: photoUrl });
          this.renewalFormData.attachmentDMVFrontLinks= linkDataDMVFront; this.renewalFormData.attachmentDMVEndLinks= linkDataDMVBack; this.renewalFormData.attachmentPhotoLinks= linkDataPhoto; this.renewalFormData.showPersonalInfo= false; this.renewalFormData.showOtherInfo= false;
           this.renewalFormData.showRequiredDoc= this.renewalFormData.IsPaymentComplete;
            this.renewalFormData.showPaymentGateway=false; this.renewalFormData.showSummary= !this.renewalFormData.IsPaymentComplete;
             this.isLoading= false
            if (this.renewalFormData.IsPaymentComplete) {
              this.saveAsDraft(Constants.Documents, Constants.Submit);
            } else { this.saveAsDraft(Constants.Documents, Constants.Next); }
        } else {
          this.isLoading= false;
        }
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "renewal-form.component.ts - verifyIDRemoveScan inner catch", err, new Error().stack);
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - verifyIDRemoveScan outer catch", error, new Error().stack);
    }

  }
  public checkValidationsRD() {
    try {
      if (((this.renewalFormData.attachmentDMVFront.length > 0 &&
        this.renewalFormData.attachmentDMVEnd.length > 0) || (this.renewalFormData.attachmentDMVFront.length == 0 ||
          this.renewalFormData.attachmentDMVEnd.length == 0)) && this.renewalFormData.attachmentDYS.length > 0 &&
        (this.renewalFormData.attachmentSSC.length > 0 ) &&
        ((this.props.certificateType == Constants.InvestigatorCertificate && this.renewalFormData.attachmentAppendices.length > 0) || this.renewalFormData.attachmentAppendices.length == 0) &&
        this.renewalFormData.attachmentPhoto.length > 0 && this.renewalFormData.attachmentSignature.length > 0) {
        $(window).scrollTop(0);
        if (this.renewalFormData.attachmentDMVFront.length == 0 && this.renewalFormData.attachmentDMVEnd.length == 0) {


        } else {


          if (this.renewalFormData.attachmentDMVFront.length == 0 || this.renewalFormData.attachmentDMVEnd.length == 0){
          Swal.fire({
            text: "Please upload both Front & Back of NYS Driver’s License or Non-Driver’s Id!",
            icon: "error"
          })
        }
        else{
          this.isLoading= true;
          this.renewalFormData.loaderMessage="Verifying...";
          this.verifyID()
        }
        }

      }
      else {
        var valid='';
        if (this.renewalFormData.attachmentDMVFront.length == 0 || this.renewalFormData.attachmentDMVEnd.length == 0){
           valid="Please upload both Front & Back of NYS Driver’s License or Non-Driver’s Id!"
        }
        if(!(this.renewalFormData.attachmentDYS.length > 0 &&
          (this.renewalFormData.attachmentSSC.length > 0 || (this.props.certificateType != Constants.InvestigatorRestrictedCertificate
            && this.props.certificateType != Constants.InvestigatorCertificate)) &&
          ((this.props.certificateType == Constants.InvestigatorCertificate && this.renewalFormData.attachmentAppendices.length > 0) || this.renewalFormData.attachmentAppendices.length == 0) &&
          this.renewalFormData.attachmentPhoto.length > 0 && this.renewalFormData.attachmentSignature.length > 0)){
          valid+='You must upload all the mandatory Documents denoted by * sign.';
        }
        Swal.fire({
          text: valid,
          title: 'Missing Mandatory Information',
          icon: "error"
        })

      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - checkValidationsRD", ex, new Error().stack);
    }
  }
  public verifyID() {
    try {
      this.idScanAccessObj.checkIDBAL(this.renewalFormData.base64DMVFront, this.renewalFormData.base64DMVBack, this.renewalFormData.base64Photo).then((res: any) => {
        if (res) {
          this.updateDocumentVerifiedStatus();
          this.isLoading= false; this.renewalFormData.nextState= false ;
        } else {
          this.isLoading= false;
        }
      }).catch((err) => {
        this.isLoading= false;
        console.log(err);
        this.commonServObj.logErrors(null, "renewal-form.component.ts - verifyID - inner catch", err, new Error().stack);
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - verifyID - outer catch", error, new Error().stack);

    }
  }
  public submitRequest() {
    try {
      this.isLoading= true ;
      if (this.renewalFormData.attachmentDMVFront.length == 0 && this.renewalFormData.attachmentDMVEnd.length == 0) {
        this.uploadDocumentsToBlob(false, Constants.Submit);
      } else {
        this.uploadDocumentsToBlob(true, Constants.Submit);
      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "renewal-form.component.ts - submitRequest", ex, new Error().stack);
    }
  }
  public async proceedToPayment() {
    try {
      this.isLoading= true; this.renewalFormData.loaderMessage= "Redirecting..." ;
      let reqId = (this.props.id=="0" || !this.props.id) ? this.renewalFormData.draftReqId:this.props.id ;
      let amount = this.renewalFormData.feeAmount;
      let applicationType = this.props.applicateType;
      let certificateType = this.props.certificateType;
      let ApplicantName = this.renewalFormData.firstName + " ";
      let zipCode = "";
      if (this.renewalFormData.zipCode.length > 5) {
        zipCode = this.renewalFormData.zipCode.substring(0, 5) + "-" + this.renewalFormData.zipCode.substring(5, 8);
      } else {
        zipCode = this.renewalFormData.zipCode;
      }
      if (this.renewalFormData.middleName) {
        ApplicantName += this.renewalFormData.middleName + " ";
      }
      ApplicantName += this.renewalFormData.lastName;
      let data: IPaymentDetails = {
        reqId: reqId,
        amount: amount,
        applicationType: applicationType,
        certificateType: certificateType,
        ApplicantName: ApplicantName,
        zipCode: zipCode,
        firstName: this.renewalFormData.firstName,
        lastName: this.renewalFormData.lastName,
        address: this.renewalFormData.address,
        city: this.renewalFormData.city,
        phoneNumber: this.renewalFormData.homeNumber,
        state: this.renewalFormData.state.value,
        middleName: this.renewalFormData.middleName
      }
      this.paymentAccessObj.paymentBAL(data).then((res) => {
        if (res && res.returnCode == 0) {
          this.paymentAccessObj.postAndRedirect(res.receiptNumber).then((res) => {
          }).catch((err) => {
            this.isLoading= false ;
           })
        } else {
          Swal.fire({
            title: "Warning!",
            text: res && res.returnCode == 999 ? "Something went wrong please try later!" : "Payment page might be busy please try later!",
            icon: "warning",
          })
          this.isLoading= false ;
        }
      }).catch((ex) => {
        console.log(ex);
        this.isLoading= false ;
        this.commonServObj.logErrors(data.reqId, "renewal-form.component.ts - proceedToPayment - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "renewal-form.component.ts - proceedToPayment - outer catch", err, new Error().stack);

    }
  }
  AppendixA(){
    window.open(Constants.InvestigatorRenewalAppendixA + this.renewalFormData.blobSASTokenForAppendix);
  }
  AppendixB(){
  window.open(`${Constants.InvestigatorRenewalAppendixB + this.renewalFormData.blobSASTokenForAppendix}`)
  }
  public getImage(d: string) {
    let nameArr: any[] = [];
    if (this.renewalFormData.openCapturePhoto) {
      this.removeAttachment(0, 'Photo')
      nameArr.push("CapturePhoto.png");
      let split_str=d.split(",");
      this.renewalFormData.base64Photo = split_str[1];
       this.renewalFormData.attachmentPhoto = nameArr;
      this.renewalFormData.openCapturePhoto=false;
      this.removeAttachment(0, 'Photo');
    } else if (this.renewalFormData.openCatureDMVBack) {
      this.removeAttachment(0, 'DMVEnd')
      nameArr.push("CaptureDMVBack.png");
      this.renewalFormData.base64DMVBack = d.split(",")[1];
       this.renewalFormData.attachmentDMVEnd = nameArr;
      this.renewalFormData.openCatureDMVBack=false;
    } else if (this.renewalFormData.openCaptureDMVFront) {
      this.removeAttachment(0, 'DMVFront')
      nameArr.push("CaptureDMVFront.png");
      this.renewalFormData.base64DMVFront = d.split(",")[1];
       this.renewalFormData.attachmentDMVFront = nameArr;
      this.renewalFormData.openCaptureDMVFront=false;
    }
  }

}
