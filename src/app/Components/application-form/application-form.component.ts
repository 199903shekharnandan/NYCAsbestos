import { IapplicationForm } from './../../Models/applicationForm';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import CommonService from 'src/app/Api/CommonService';
import { ApiService } from 'src/app/Api/api.service';
import { MsalService } from '@azure/msal-angular';
import SQLAccess from 'src/app/Api/SQLAccess';
import { Constants } from 'src/app/Constants/Constants';
import BlobAccess from 'src/app/Api/BlobAccess';
import IDScanAccess from 'src/app/Api/IDScanAccess';
import PaymentAccess from 'src/app/Api/PaymentAccess';
import { IPaymentDetails } from 'src/app/Models/paymentDetails';
import * as moment from 'moment';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit, OnDestroy{
  applicationFormData = {} as IapplicationForm;
  propsss:any={};
  currentLogin:any;
  showPI:boolean=true;
  showAI:boolean=false;
  showRD:boolean=false;
  showSM:boolean=false;
  ddlselectedState:boolean=true;
  ddlCertificateState:boolean=false;

  props:any;
  isLoading:boolean=false;
  popdisplay:string='none';
  certificatePnl:boolean=false;
  statePnl:boolean=false;
  today:any=moment(new Date()).subtract(1, "days").format("YYYY-MM-DD")
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
  constructor(private route: ActivatedRoute, private router: Router,private apiservice: ApiService,private authService: MsalService) {

  }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  blobAccessObj:BlobAccess = new BlobAccess(this.apiservice, this.authService);
  sqlAccessObj= new SQLAccess(this.apiservice, this.authService);
  idScanAccessObj = new IDScanAccess(this.apiservice, this.authService);
  paymentAccessObj = new PaymentAccess(this.apiservice, this.authService);

  ngOnInit(): void {
    $('.nav-link').removeClass('active');
    $("#top-navigation li:eq(1)").after('<li class="nav-item" id="nav-app-form"><a class="nav-link active" id="nav-form" data-bs-toggle="tab" href="javascript:void(0);"}>Application Form</a></li>');
      $('#nav-form').attr('onClick', `window.location.href = # `);
    this.route.queryParams.subscribe(params => {this.props=params;});
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
   Constants.userEmail= this.currentLogin.username;

   this.GetStateList();
   this.getSASTokenForAppendix();
   this.getFeeAmount();

   if (this.props.id!="0") {
    this.getRequestDetailsForDraft();
    this.getVerifyStatus();
  }
    this.applicationFormData.SSN="";
    this.applicationFormData.DMV="";
    this.applicationFormData.lastName="";
    this.applicationFormData.firstName="";
    this.applicationFormData.middleName="";
    this.applicationFormData.address="";
    this.applicationFormData.apartment="";
    this.applicationFormData.city="";
    this.applicationFormData.state=[];
    this.applicationFormData.zipCode="";
    this.applicationFormData.postOnWebsite="No";
    this.applicationFormData.feet="";
    this.applicationFormData.inches="";
    this.applicationFormData.weight="";
    this.applicationFormData.birthDay="";
    this.applicationFormData.gender="";
    this.applicationFormData.homeNumber="";
    this.applicationFormData.workNumber="";
    this.applicationFormData.SSNValidation="";
    this.applicationFormData.IsValidated=false;
    this.applicationFormData.employerName="";
    this.applicationFormData.employerAddress="";
    this.applicationFormData.employerCity="";
    this.applicationFormData.employerState=[];
    this.applicationFormData.employerZipCode="";
    this.applicationFormData.employmentStartDate="";
    this.applicationFormData.IsGuilty="";
    this.applicationFormData.IsDisciplined="";
    this.applicationFormData.IsCriminalCharged="";
    this.applicationFormData.hasHandlerCertificate="";
    this.applicationFormData.hasMisconductCharges="";
    this.applicationFormData.hasHandlerCertificateOtherState="";
    this.applicationFormData.certificateExpiryDate=[];
    this.applicationFormData.oldCertificate="";
    this.applicationFormData.certificateState="";
    this.applicationFormData.certificateExpiryDateOtherState=[];
    this.applicationFormData.schoolName="";
    this.applicationFormData.schoolAddress="";
    this.applicationFormData.schoolCity="";
    this.applicationFormData.schoolState=[];
    this.applicationFormData.schoolZipCode="";
    this.applicationFormData.attachmentSSC=[];
    this.applicationFormData.attachmentSSCLinks=[];
    this.applicationFormData.attachmentDMVFront=[];
    this.applicationFormData.attachmentDMVFrontLinks=[];
    this.applicationFormData.attachmentDMVEnd=[];
    this.applicationFormData.attachmentDMVEndLinks=[];
    this.applicationFormData.attachmentPhoto=[];
    this.applicationFormData.attachmentPhotoLinks=[];
    this.applicationFormData.attachmentAppendices=[];
    this.applicationFormData.attachmentAppendixLinks=[];
    this.applicationFormData.attachmentOCSE=[];
    this.applicationFormData.attachmentOCSELinks=[];
    this.applicationFormData.attachmentDYS=[];
    this.applicationFormData.attachmentDYSLinks=[];
    this.applicationFormData.attachmentSignature=[];
    this.applicationFormData.attachmentSignatureLinks=[];
    this.applicationFormData.base64DMVFront="";
    this.applicationFormData.base64DMVBack="";
    this.applicationFormData.base64Photo="";
    this.applicationFormData.showPersonalInfo=false;
    this.applicationFormData.showOtherInfo=false;
    this.applicationFormData.showRequiredDoc=false;

    this.applicationFormData.openCapturePhoto=false;
    this.applicationFormData.openCaptureDMVFront=false;
    this.applicationFormData.openCatureDMVBack=false;
    this.applicationFormData.attachmentReceipt=[];
    this.applicationFormData.attachmentReceiptLinks=[];
    this.applicationFormData.attachmentReference=[];
    this.applicationFormData.attachmentReferenceLinks=[];
    this.applicationFormData.attachmentCourse=[];
    this.applicationFormData.attachmentCourseLinks=[];
    this.applicationFormData.attachmentBackgroundCheck=[];
    this.applicationFormData.attachmentBackgroundCheckLinks=[];
    this.applicationFormData.errorSSN=false;
    this.applicationFormData.errorDMV=false;
    this.applicationFormData.errorLastName=false;
    this.applicationFormData.errorFirstName=false;
    this.applicationFormData.errorAddress=false;
    this.applicationFormData.errorCity=false;
    this.applicationFormData.errorState=false;
    this.applicationFormData.errorZipCode=false;
    this.applicationFormData.errorBirthDay=false;
    this.applicationFormData.errorGender=false;
    this.applicationFormData.errorFeet=false;
    this.applicationFormData.errorInches=false;
    this.applicationFormData.errorWeight=false;
    this.applicationFormData.errorHomeNumber=false;
    this.applicationFormData.errorWorkNumber=false;

    this.applicationFormData.errorSchoolName=false;
    this.applicationFormData.errorIsGuilty=false;
    this.applicationFormData.errorIsDisciplined=false;
    this.applicationFormData.errorIsCriminalCharged=false;
    this.applicationFormData.errorHasMisConductCharges=false;

    this.applicationFormData.errorHasHandlerCertificate=false;
    this.applicationFormData.errorOldCertificate=false;
    this.applicationFormData.errorCertificateExpiryDate=false;

    this.applicationFormData.errorHasHandlerCertificateOtherState=false;
    this.applicationFormData.errorCertificateState=false;
    this.applicationFormData.errorCertificateExpiryDateOtherState=false;

    this.applicationFormData.errorDMVIDFront=false;
    this.applicationFormData.errorDMVIDBack=false;
    this.applicationFormData.errorReceipt=false;
    this.applicationFormData.errorSSNCard=false;
    this.applicationFormData.errorNYSDOH=false;
    this.applicationFormData.errorOCSE=false;
    this.applicationFormData.errorReference=false;
    this.applicationFormData.errorPhoto=false;
    this.applicationFormData.errorSignature=false;
    this.applicationFormData.errorAppendix=false;
    this.applicationFormData.errorBackgroundCheck=false;
    this.applicationFormData.errorCourse=false;
    this.applicationFormData.isLoading=false;
    this.applicationFormData.showPaymentGateway=false;
    this.applicationFormData.showSummary=false;
    this.applicationFormData.stateTypeValues=[];
    this.applicationFormData.selectedState="";
    this.applicationFormData.selectedEmployerState="";
    this.applicationFormData.selectedSchoolState="";
    this.applicationFormData.selectedCertificateState=[];
    this.applicationFormData.loaderMessage="";
    this.applicationFormData.draftReqId="";
    this.applicationFormData.feeAmount=0;
    this.applicationFormData.nextState=false;
    this.applicationFormData.IsPaymentComplete=false;
    this.applicationFormData.blobSASTokenForAppendix="";
    this.showPI= this.props.payment && this.props.payment == "cancel" ? false : true;
    this.showSM= this.props.payment && this.props.payment == "cancel" ? true : false;

}
ngOnDestroy(): void {
  $('#nav-app-form').remove();
  if (this.applicationFormData.draftReqId) {
    this.saveAsDraft(Constants.Documents, Constants.Save, true);
  }
}
public async getSASTokenForAppendix() {
  try {
    this.sqlAccessObj.getSASTokenForAppendixBAL().then((blobSASToken) => {
      this.applicationFormData.blobSASTokenForAppendix= blobSASToken;
    }).catch((ex) => {
      console.log(ex);
      this.commonServObj.logErrors(null, "application-form.component.ts - getSASTokenForAppendix - inner catch", ex, new Error().stack);
    })
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - getSASTokenForAppendix - outer catch", err, new Error().stack);
  }
}
public GetStateList() {
  try {
    this.sqlAccessObj.GetStateListBAL().then((data: any) => {
       this.applicationFormData.stateTypeValues= data[0];
    }).catch((ex) => {
      this.commonServObj.logErrors(null, "application-form.component.ts - GetStateList - inner catch", ex, new Error().stack);
    })
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - GetStateList - outer catch", err, new Error().stack);

  }
}
public async getFeeAmount() {
  try {
    this.sqlAccessObj.getFeeAmount(this.props.certificateType, this.props.applicateType).then((fee) => {
      this.applicationFormData.feeAmount=fee;
    }).catch((ex) => {
      console.log(ex);
      this.commonServObj.logErrors(null, "application-form.component.ts - getFeeAmount - inner catch", ex, new Error().stack);
    })
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - getFeeAmount - outer catch", err, new Error().stack);
  }
}
getVerifyStatus() {
  try {
    let url = Constants.GetDocumentVerifiedStatus;
    var body = {
       "ReqId": this.props.id=="0"? this.applicationFormData.draftReqId:this.props.id,
    }
    this.apiservice.postMethodAxios(url, body)
      .then(async (response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          this.applicationFormData.nextState=!response.data.table[0].isVerified
        }
      }).catch((err) => {
        console.log(err);
      });
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - getVerifyStatus - outer catch", err, new Error().stack);

  }
}
saveAsDraftForPI(){

    this.saveAsDraft(Constants.Personal, Constants.Save);
}

saveAsDraft(type: any, button: any, hideMessage?: boolean) {
  try {
    this.applicationFormData.DMV=this.applicationFormData.DMV.toString();
    this.applicationFormData.SSN=this.applicationFormData.SSN.toString();
    this.applicationFormData.feet=this.applicationFormData.feet.toString();
    this.applicationFormData.inches=this.applicationFormData.inches.toString();
    this.applicationFormData.weight=this.applicationFormData.weight.toString();
    this.applicationFormData.zipCode=this.applicationFormData.zipCode.toString();
    this.applicationFormData.homeNumber=this.applicationFormData.homeNumber.toString();
    this.applicationFormData.workNumber= this.applicationFormData.workNumber.toString();
    if (type != "Documents") {
      if (type == "Personal") {
        if (
          this.applicationFormData.firstName.trim().length != 0 ||
          this.applicationFormData.lastName.trim().length != 0 ||
          this.applicationFormData.SSN.trim().length != 0 ||
          this.applicationFormData.DMV.trim().length != 0 ||
          this.applicationFormData.birthDay != "" ||
          this.applicationFormData.feet.trim().length != 0 ||
          this.applicationFormData.inches.trim().length != 0 ||
          this.applicationFormData.weight.trim().length != 0 ||
          this.applicationFormData.gender != "" ||
          this.applicationFormData.address.trim().length != 0 ||
          this.applicationFormData.zipCode.trim().length != 0 ||
          this.applicationFormData.city.trim().length != 0 ||
          (this.applicationFormData.state != null &&
          this.applicationFormData.state.length != 0) ||
          this.applicationFormData.homeNumber.trim().length != 0
        ) {
          this.isLoading= true;
         this.applicationFormData.loaderMessage="Saving..." ;
         if (this.props.id!="0" || this.applicationFormData.draftReqId) {

          this.sqlAccessObj.saveDraftBAL(this.applicationFormData, this.props, button).then((res) => {
            this.isLoading= false;
            if (res && res.data) {
              if(button=="Next"){
                this.showPI=false; this.showAI=true;this.showRD=false; this.showSM=false;
              }
              this.applicationFormData.draftReqId=res.data;
            }

          }).catch((err:any) => {
            this.isLoading= false;
            this.commonServObj.logErrors(null, "application-form.component.ts - saveAsDraft - personal", err, new Error().stack);
          });
        }else{
          this.sqlAccessObj.InsertDraftBAL(this.applicationFormData, this.props, button).then((res) => {
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
              this.applicationFormData.draftReqId=res.data;
            }

          }).catch((err:any) => {
            this.isLoading= false;
            this.commonServObj.logErrors(null, "application-form.component.ts - saveAsDraft - Insert - personal", err, new Error().stack);
          });
        }
        } else {
          Swal.fire({
            title: "Warning!",
            text: "Please provide values for atleast one of the mandatory fields to save as draft!",
            icon: "warning"
          }).then(() => {

          }).catch((err) => console.log(err));
        }
      } else {
        this.isLoading= true;
        this.applicationFormData.loaderMessage="Saving...";
        this.sqlAccessObj.saveDraftBAL(this.applicationFormData, this.props, button).then((res) => {
          this.isLoading= false;
          if (res && res.data) {
          if(button=="Next" && type=="Additional"){
            this.showPI=false; this.showAI=false;this.showRD=true; this.showSM=false;
          }
            this.applicationFormData.draftReqId=res.data ;
          }

        }).catch((err:any) => {
          this.isLoading= false;
          this.commonServObj.logErrors(null, "application-form.component.ts - saveAsDraft - Additional", err, new Error().stack);
        });
      }
    } else {
      this.isLoading= true;
    this.uploadDocumentsToBlob(false, button,hideMessage);
    }

  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - saveAsDraft - outer catch", error, new Error().stack);
  }

}
savePI(){
  this.checkValidationsPI();

}
checkValidationsPI() {
   try {
    this.applicationFormData.DMV=this.applicationFormData.DMV.toString();
    this.applicationFormData.SSN=this.applicationFormData.SSN.toString();
    this.applicationFormData.feet=this.applicationFormData.feet.toString();
    this.applicationFormData.inches=this.applicationFormData.inches.toString();
    this.applicationFormData.weight=this.applicationFormData.weight.toString();
    this.applicationFormData.zipCode=this.applicationFormData.zipCode.toString();
    this.applicationFormData.homeNumber=this.applicationFormData.homeNumber.toString();
    this.applicationFormData.workNumber= this.applicationFormData.workNumber.toString();
    if(
      this.applicationFormData.firstName.trim().length == 0 ||
      this.applicationFormData.lastName.trim().length == 0 ||
      this.applicationFormData.DMV.trim().length == 0 ||
      this.applicationFormData.SSN.trim().length == 0 ||
      this.applicationFormData.birthDay == "" ||
      this.applicationFormData.feet.trim().length == 0 ||
      this.applicationFormData.inches.trim().length == 0 ||
      this.applicationFormData.weight.trim().length == 0 ||
      this.applicationFormData.gender == "" ||
      this.applicationFormData.address.trim().length == 0 ||
      this.applicationFormData.zipCode.trim().length == 0 ||
      this.applicationFormData.city.trim().length == 0 ||
      this.applicationFormData.state.value.trim().length == 0 ||
      this.applicationFormData.homeNumber.trim().length == 0
    ) {

    }
    else {
      $(window).scrollTop(0);
      this.saveAsDraft(Constants.Personal, Constants.Next,false);
    }
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - checkValidationsPI", ex, new Error().stack);
  }
}
public checkValidationsOI() {
  try {
    this.applicationFormData.oldCertificate=this.applicationFormData.oldCertificate.toString();
    if ((this.applicationFormData.schoolName.trim().length == 0 ||
      this.applicationFormData.IsGuilty.length == 0 ||
      this.applicationFormData.IsDisciplined.length == 0 ||
      this.applicationFormData.IsCriminalCharged.length == 0 ||
      this.applicationFormData.hasMisconductCharges.length == 0 ||
      this.applicationFormData.hasHandlerCertificate.length == 0 ||
      this.applicationFormData.hasHandlerCertificateOtherState.length == 0) ||
      (this.applicationFormData.hasHandlerCertificate == "Yes" && (this.applicationFormData.oldCertificate.trim().length == 0 || this.applicationFormData.certificateExpiryDate == ""))
      || (this.applicationFormData.hasHandlerCertificateOtherState == "Yes" && (this.applicationFormData.certificateState.value.trim().length == 0 || this.applicationFormData.certificateExpiryDateOtherState == ""))) {

    } else {
      $(window).scrollTop(0);
      this.saveAsDraft(Constants.Additional, Constants.Next);
    }
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - checkValidationsOI", ex, new Error().stack);
  }
}
backPI(){
  this.showAI=false;
  this.showPI=true;
  this.showRD=false;
  this.showSM=false;
  this.applicationFormData.showPaymentGateway= false;
  this.applicationFormData.showSummary=false ;
}
backAI(){
  this.showAI=true;
  this.showPI=false;
  this.showRD=false;
  this.showSM=false;
 this.applicationFormData.showPaymentGateway= false;this.applicationFormData.showSummary=false ;
}
backRD(){
  this.showAI=false;
  this.showPI=false;
  this.showRD=true;
  this.showSM=false;
 this.applicationFormData.showPaymentGateway= false;this.applicationFormData.showSummary=false ;
}
showcertificatePnl(){
  this.certificatePnl=true;
}
hidecertificatePnl(){
  this.certificatePnl=false;
  this.applicationFormData.certificateExpiryDate="";
  this.applicationFormData.oldCertificate="";
}
showstatePnl(){
  this.statePnl=true;
  this.applicationFormData.certificateState=[];
  this.ddlCertificateState=false;
}
hidestatePnl(){
  this.statePnl=false;
  this.applicationFormData.certificateExpiryDateOtherState="";
  this.applicationFormData.certificateState=[];
  this.ddlCertificateState=false;
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


  changeStates(e: any) {
    if(e){
    this.ddlselectedState=false;
    }
    else{
      this.ddlselectedState=true;
    }
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

onlyNumberKey (e:any) {  // Accept only alpha numerics, not special characters
  var regex = new RegExp("^[0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (regex.test(str)) {
      return true;
  }
  e.preventDefault();
  return false;
}
NumbersOnly(evt:any) {
  // Only ASCII character in that range allowed
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
  return true;
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
        }
      } else {
        if (type == "DMVFront" || type == "DMVEnd" || type == "Photo") {
          Swal.fire("Attachment size should not exceed 4mb!");
        } else {
          Swal.fire("Attachment size should not exceed 10mb!");
        }
      }
      return false;
    } else {
      if (type == "DMVFront" || type == "DMVEnd" || type == "Photo") {
        this.applicationFormData.nextState=true;
        this.updateVerifyStatus();
        this.validateID(e, type);
      } else {
        this.FileAttach(e, type);
      }
    }
  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - handleAttachments - outer catch", error, new Error().stack);

  }
}
public updateVerifyStatus() {
  try {
    let url = Constants.UpdateDocumentVerifiedStatus;
    var body = {
      "ReqId": this.props.id=="0" ? this.applicationFormData.draftReqId:this.props.id,
    }
    this.apiservice
      .postMethodAxios(url, body)
      .then(async (response: any) => {
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(body.ReqId, "application-form.component.ts - updateVerifyStatus - inner catch", err, new Error().stack);
      });
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - updateVerifyStatus - outer catch", err, new Error().stack);
  }
}
public updateDocumentVerifiedStatus() {
  try {
    let url = Constants.UpdateDocumentStatus;
    var body = {
      "ReqId": this.props.id=="0" ? this.applicationFormData.draftReqId:this.props.id,
    }
    this.apiservice
      .postMethodAxios(url, body)
      .then(async (response: any) => {
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(body.ReqId, "application-form.component.ts - updateDocumentVerifiedStatus - inner catch", err, new Error().stack);
      });
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - updateDocumentVerifiedStatus - outer catch", err, new Error().stack);
  }
}
public async validateID(e: any, type: any) {
  try {
    this.commonServObj.toBase64(e.target.files[0]).then(async (result: any) => {
      let name = e.target.files[0].name;
      let nameArr: any[] = [];
      nameArr.push(name);
      if (type == "DMVFront") {
        this.applicationFormData.base64DMVFront= result.split(",")[1];
        this.applicationFormData.attachmentDMVFront= nameArr;
      } else if (type == "DMVEnd") {
        this.applicationFormData.base64DMVBack= result.split(",")[1];
         this.applicationFormData.attachmentDMVEnd= nameArr;
      } else if (type == "Photo") {
        this.applicationFormData.base64Photo=result.split(",")[1];
         this.applicationFormData.attachmentPhoto= nameArr;
      }
    }).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "application-form.component.ts - validateID - inner catch", err, new Error().stack);
    })
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - validateID - outer catch", ex, new Error().stack);
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
     this.applicationFormData.attachmentSSC=data;
    } else if (type == "DYS") {
      this.applicationFormData.attachmentDYS= data
    } else if (type == "Appendix") {
      let duplicateAttachments: any[] = [];
      if (this.applicationFormData.attachmentAppendices && this.applicationFormData.attachmentAppendices.length > 0) {
        this.applicationFormData.attachmentAppendices.forEach((p: any) => {
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
        this.applicationFormData.attachmentAppendices= this.applicationFormData.attachmentAppendices.concat(data)
      }
    } else if (type == "OCSE") {
      this.applicationFormData.attachmentOCSE= data ;
    } else if (type == "Receipt") {
     this.applicationFormData.attachmentReceipt= data;
    } else if (type == "Reference") {
      this.applicationFormData.attachmentReference= data;
    } else if (type == "Signature") {
      this.applicationFormData.attachmentSignature= data;
    } else if (type == Constants.Course) {
      this.applicationFormData.attachmentCourse= data;
    } else if (type == Constants.Background) {
      this.applicationFormData.attachmentBackgroundCheck= data;
    }
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - FileAttach", ex, new Error().stack);
  }
}
changeImg(e:any, type:any){
  this.handleAttachments(e, type);
}

public removeAttachment(index: any, type: any) {
  try {
    let attachments: String[] = type == "SSC" ? this.applicationFormData.attachmentSSC : type == "DYS" ? this.applicationFormData.attachmentDYS
      : type == "Appendix" ? this.applicationFormData.attachmentAppendices : type == "OCSE" ? this.applicationFormData.attachmentOCSE : type == "DMVFront" ?
        this.applicationFormData.attachmentDMVFront : type == "DMVEnd" ? this.applicationFormData.attachmentDMVEnd : type == "Photo" ? this.applicationFormData.attachmentPhoto :
          type == "Reference" ? this.applicationFormData.attachmentReference : type == "Receipt" ? this.applicationFormData.attachmentReceipt :
            type == "Signature" ? this.applicationFormData.attachmentSignature : type == Constants.Course ? this.applicationFormData.attachmentCourse : type == Constants.Background ? this.applicationFormData.attachmentBackgroundCheck : [];
    let attachmentLinks = type == "SSC" ? this.applicationFormData.attachmentSSCLinks : type == "DYS" ? this.applicationFormData.attachmentDYSLinks
      : type == "Appendix" ? this.applicationFormData.attachmentAppendixLinks : type == "OCSE" ? this.applicationFormData.attachmentOCSELinks : type == "DMVFront" ?
        this.applicationFormData.attachmentDMVFrontLinks : type == "DMVEnd" ? this.applicationFormData.attachmentDMVEndLinks : type == "Photo" ? this.applicationFormData.attachmentPhotoLinks :
          type == "Reference" ? this.applicationFormData.attachmentReferenceLinks : type == "Receipt" ? this.applicationFormData.attachmentReceiptLinks : type == "Signature" ? this.applicationFormData.attachmentSignatureLinks :
            type == Constants.Course ? this.applicationFormData.attachmentCourseLinks : type == Constants.Background ? this.applicationFormData.attachmentBackgroundCheckLinks : [];
    attachments.splice(index, 1);
    let deleteFile = attachmentLinks.length > 0 ? attachmentLinks[index] : "";
    if ((type == "DMVFront" || type == "DMVEnd" || type == "Photo")) {
      this.applicationFormData.nextState= true ;
      this.updateVerifyStatus();
    }
    if (deleteFile && deleteFile.link) {
      this.blobAccessObj.deleteFileFromBlobBAL(this.commonServObj.getNameForDelete(deleteFile.link));
    }
    // }
    if (attachmentLinks && attachmentLinks.length > 0) {
      attachmentLinks.splice(index, 1);
    }
    if (type == "SSC") {
      $("#attachment-SSC").val("");
       this.applicationFormData.attachmentSSC= attachments;
       this.applicationFormData.attachmentSSCLinks= attachmentLinks;
    } else if (type == "DYS") {
      $("#attachment-DYS").val("");
        this.applicationFormData.attachmentDYS=attachments;
        this.applicationFormData.attachmentDYSLinks=attachmentLinks;
    } else if (type == "Appendix") {
      $("#attachment-appendix").val("");
        this.applicationFormData.attachmentAppendices= attachments;
        this.applicationFormData.attachmentAppendixLinks= attachmentLinks;
    } else if (type == "OCSE") {
      $("#attachment-OCSE").val("");
        this.applicationFormData.attachmentOCSE= attachments;
        this.applicationFormData.attachmentOCSELinks= attachmentLinks;
    } else if (type == "DMVFront") {
      $("#attachment-DMVFront").val("");
        this.applicationFormData.base64DMVFront= "";
        this.applicationFormData.attachmentDMVFront= attachments;
        this.applicationFormData.attachmentDMVFrontLinks= attachmentLinks;
    } else if (type == "DMVEnd") {
      $("#attachment-DMVBack").val("");
        this.applicationFormData.base64DMVBack= "";
        this.applicationFormData.attachmentDMVEnd= attachments;
        this.applicationFormData.attachmentDMVEndLinks= attachmentLinks;
    } else if (type == "Photo") {
      $("#attachment-photo").val("");
        this.applicationFormData.base64Photo= "";
        this.applicationFormData.attachmentPhoto= attachments;
        this.applicationFormData.attachmentPhotoLinks= attachmentLinks;
    } else if (type == "Reference") {
      $("#attachment-reference").val("");
        this.applicationFormData.attachmentReference= attachments;
        this.applicationFormData.attachmentReferenceLinks= attachmentLinks;
    } else if (type == "Signature") {
      $("#attachment-signature").val("");
        this.applicationFormData.attachmentSignature= attachments;
        this.applicationFormData.attachmentSignatureLinks= attachmentLinks;
    } else if (type == "Receipt") {
      $("#attachment-receipt").val("");
        this.applicationFormData.attachmentReceipt= attachments;
        this.applicationFormData.attachmentReceiptLinks= attachmentLinks;
    } else if (type == Constants.Course) {
      $("#attachment-course").val("");
        this.applicationFormData.attachmentCourse=attachments;
        this.applicationFormData.attachmentCourseLinks= attachmentLinks;
    } else if (type == Constants.Background) {
      $("#attachment-background").val("");
        this.applicationFormData.attachmentBackgroundCheck= attachments;
        this.applicationFormData.attachmentBackgroundCheckLinks= attachmentLinks;
    }
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - removeAttachment - outer catch", ex, new Error().stack);

  }
}

public getImage(d: any) {
  let nameArr: any[] = [];
  if (this.applicationFormData.openCapturePhoto) {
    this.removeAttachment(0, 'Photo')
    nameArr.push("CapturePhoto.png");
    this.applicationFormData.base64Photo= d.split(",")[1];
    this.applicationFormData.attachmentPhoto= nameArr;
    this.applicationFormData.openCapturePhoto=false;
  } else if (this.applicationFormData.openCatureDMVBack) {
    this.removeAttachment(0, 'DMVEnd')
    nameArr.push("CaptureDMVBack.png");
    this.applicationFormData.base64DMVBack=d.split(",")[1];
    this.applicationFormData.attachmentDMVEnd= nameArr;
    this.applicationFormData.openCatureDMVBack = false;
  } else if (this.applicationFormData.openCaptureDMVFront) {
    this.removeAttachment(0, 'DMVFront')
    nameArr.push("CaptureDMVFront.png");
    this.applicationFormData.base64DMVFront= d.split(",")[1];
    this.applicationFormData.attachmentDMVFront= nameArr;
    this.applicationFormData.openCaptureDMVFront=false;
  }
}
public checkValidationsRD() {
  try {
    if (((this.applicationFormData.attachmentDMVFront.length > 0 &&
      this.applicationFormData.attachmentDMVEnd.length > 0) || this.applicationFormData.attachmentReceipt.length > 0) &&
      (this.applicationFormData.attachmentSSC.length> 0) && this.applicationFormData.attachmentDYS.length > 0 &&
        ((this.props.certificateType == Constants.HandlerCertificate ||
          this.props.certificateType == Constants.HandlerRestrictedCertificate) || this.applicationFormData.attachmentAppendices.length > 0)
      &&
      ((this.props.certificateType == Constants.HandlerCertificate
        || this.props.certificateType == Constants.HandlerRestrictedCertificate)
        || this.applicationFormData.attachmentReference.length > 0)
      && this.applicationFormData.attachmentPhoto.length > 0 &&
      this.applicationFormData.attachmentSignature.length > 0
      && ((this.applicationFormData.attachmentCourse.length > 0)
        || (this.props.certificateType != Constants.InvestigatorRestrictedCertificate
          && this.props.certificateType != Constants.InvestigatorCertificate))) {

      $(window).scrollTop(0);
      if (this.applicationFormData.attachmentDMVFront.length == 0 && this.applicationFormData.attachmentDMVEnd.length == 0) {

      } else {

        if (this.applicationFormData.attachmentDMVFront.length == 0 || this.applicationFormData.attachmentDMVEnd.length == 0){
          Swal.fire({
            text: "Please upload both Front & Back of NYS Driver’s License or Non-Driver’s Id!",
            icon: "error"
          })
        }
          else{
            this.isLoading=true;
            this.applicationFormData.loaderMessage="Verifying..."
             this.verifyID()
          }
      }

    }
    else {
      Swal.fire({
        text: "You must upload all the mandatory Documents denoted by * sign.",
        icon: "error",
        title: 'Missing Mandatory Information',
      })

    }
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - checkValidationsRD", ex, new Error().stack);
  }
}
public verifyID() {
  try {
    this.idScanAccessObj.checkIDBAL(this.applicationFormData.base64DMVFront, this.applicationFormData.base64DMVBack, this.applicationFormData.base64Photo).then((res: any) => {
      if (res) {
        this.updateDocumentVerifiedStatus();
        this.isLoading= false;
        this.applicationFormData.nextState= false;
      }
      else{
        this.isLoading= false;
      }
    }).catch((err:any) => {
      console.log(err);
      this.isLoading= false;
      this.commonServObj.logErrors(null, "application-form.component.ts - verifyID - inner catch", err, new Error().stack);
    })

  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - verifyID - outer catch", error, new Error().stack);

  }
}
public checkValidationsRD_RemovingScan() {
  try {
    if (
      (
        (this.applicationFormData.attachmentDMVFront.length > 0 && this.applicationFormData.attachmentDMVEnd.length > 0)
        || this.applicationFormData.attachmentReceipt.length > 0
      )
      &&
      (
        this.applicationFormData.attachmentSSC.length > 0
      )
      &&
        this.applicationFormData.attachmentDYS.length > 0
      &&
      (
        ( this.props.certificateType == Constants.HandlerCertificate || this.props.certificateType == Constants.HandlerRestrictedCertificate)
        ||
        this.applicationFormData.attachmentAppendices.length > 0
      )
      &&
      (
        (this.props.certificateType == Constants.HandlerCertificate || this.props.certificateType == Constants.HandlerRestrictedCertificate)
        ||
        this.applicationFormData.attachmentReference.length > 0
      )
      &&
      this.applicationFormData.attachmentPhoto.length > 0
      &&
      this.applicationFormData.attachmentSignature.length > 0
      &&
      (
        (this.applicationFormData.attachmentCourse.length > 0)
        ||
        (this.props.certificateType != Constants.InvestigatorRestrictedCertificate && this.props.certificateType != Constants.InvestigatorCertificate)
      ))
      {
        $(window).scrollTop(0);
        if ((this.applicationFormData.attachmentDMVFront.length == 0 && this.applicationFormData.attachmentDMVEnd.length == 0) || (this.applicationFormData.attachmentReceipt && this.applicationFormData.attachmentReceipt!="")) {
          if (this.applicationFormData.IsPaymentComplete) { this.saveAsDraft(Constants.Documents, Constants.Submit);}
          else {
            this.saveAsDraft(Constants.Documents, Constants.Next);
          }
        }
        else {
          this.isLoading= true;
          this.verifyIDRemoveScan()
        }

      }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Missing Mandatory Information',
        text: 'You must upload all the Mandatory Documents denoted by * sign.'
      })
      this.applicationFormData.errorDMVIDFront= this.applicationFormData.attachmentDMVFront.length == 0 && this.applicationFormData.attachmentReceipt.length == 0;
      this.applicationFormData.errorDMVIDBack= this.applicationFormData.attachmentDMVEnd.length == 0 && this.applicationFormData.attachmentReceipt.length == 0;
      this.applicationFormData.errorReceipt= this.applicationFormData.attachmentReceipt.length == 0 && this.applicationFormData.attachmentDMVFront.length == 0 && this.applicationFormData.attachmentDMVEnd.length == 0;
      this.applicationFormData.errorSSNCard= (this.props.certificateType != Constants.InvestigatorRestrictedCertificate
        && this.props.certificateType != Constants.InvestigatorCertificate) ? false : this.applicationFormData.attachmentSSC.length == 0;
      this.applicationFormData.errorNYSDOH= this.applicationFormData.attachmentDYS.length == 0;
      this.applicationFormData.errorReference= this.applicationFormData.attachmentReference.length == 0;
      this.applicationFormData.errorPhoto= this.applicationFormData.attachmentPhoto.length == 0;
      this.applicationFormData.errorSignature= this.applicationFormData.attachmentSignature.length == 0;
      this.applicationFormData.errorAppendix= this.applicationFormData.attachmentAppendices.length == 0;
      this.applicationFormData.errorCourse= this.applicationFormData.attachmentCourse.length == 0;
    }
  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - checkValidationsRD_RemovingScan", error, new Error().stack);
  }
}
public verifyIDRemoveScan() {
  try {
    let linkDataDMVFront: any[] = [];
    let linkDataDMVBack: any[] = [];
    let linkDataPhoto: any[] = [];
    this.idScanAccessObj.checkIDBALRemovingScan(this.applicationFormData.base64DMVFront, this.applicationFormData.base64DMVBack, this.applicationFormData.base64Photo).then((res: any) => {
      if (res && res.length > 0) {
        let frontUrl = res[0].DMVFront;
        let backUrl = res[1].DMVBack;
        let photoUrl = res[2].Photo;
        linkDataDMVFront.push({ link: frontUrl });
        linkDataDMVBack.push({ link: backUrl });
        linkDataPhoto.push({ link: photoUrl });
        this.applicationFormData.attachmentDMVFrontLinks= linkDataDMVFront;
         this.applicationFormData.attachmentDMVEndLinks= linkDataDMVBack;
          this.applicationFormData.attachmentPhotoLinks= linkDataPhoto;
           this.applicationFormData.showPersonalInfo= false;
            this.applicationFormData.showOtherInfo=false;
             this.applicationFormData.showRequiredDoc= this.applicationFormData.IsPaymentComplete;
              this.applicationFormData.showPaymentGateway= false;
              this.applicationFormData.showSummary= !this.applicationFormData.IsPaymentComplete;
        this.isLoading= false;
          if (this.applicationFormData.IsPaymentComplete) {
            this.saveAsDraft(Constants.Documents, Constants.Submit);
          } else { this.saveAsDraft(Constants.Documents, Constants.Next); }
      } else {
        this.isLoading=false;
      }
    }).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "application-form.component.ts - verifyIDRemoveScan inner catch", err, new Error().stack);
    })
  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - verifyIDRemoveScan outer catch", error, new Error().stack);
  }
}
public async uploadDocumentsToBlob(scan: boolean, reqType: any, hideMessage?: boolean) {
  try {
    let receiptUrl: any[] = []; let sscUrl: any[] = []; let dysUrl: any[] = [];
    let appendicesUrl: any[] = this.applicationFormData.attachmentAppendixLinks;
    let ocseUrl: any[] = [];
    let referenceUrl: any[] = [];
    let signatureUrl: any[] = [];
    let photoUrl: any[] = [];
    let courseUrl: any[] = [];
    let backgroundUrl: any[] = [];
    let dmvFrontUrl: any[] = [];
    let dmvBackUrl: any[] = [];
    if (!scan) {
      if (this.applicationFormData.base64Photo && this.applicationFormData.attachmentPhotoLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBALID(Constants.Photo, this.applicationFormData.base64Photo).then((url) => {
          if (url) {
            photoUrl.push({ link: url });
          }
          this.applicationFormData.attachmentPhotoLinks= photoUrl;
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
      if (this.applicationFormData.base64DMVFront && this.applicationFormData.attachmentDMVFrontLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBALID(Constants.DMVFront, this.applicationFormData.base64DMVFront).then((url) => {
          if (url) {
            dmvFrontUrl.push({ link: url });
          }
         this.applicationFormData.attachmentDMVFrontLinks= dmvFrontUrl;
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
      if (this.applicationFormData.base64DMVBack && this.applicationFormData.attachmentDMVEndLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBALID(Constants.DMVBack, this.applicationFormData.base64DMVBack).then((url) => {
          if (url) {
            dmvBackUrl.push({ link: url });
          }
       this.applicationFormData.attachmentDMVEndLinks= dmvBackUrl;
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
    if (this.applicationFormData.attachmentSSC.length > 0 && this.applicationFormData.attachmentSSCLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentSSC[0], Constants.SSC).then((url) => {
        if (url) {
          sscUrl.push({ link: url });
        }
       this.applicationFormData.attachmentSSCLinks= sscUrl;
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
    if (this.applicationFormData.attachmentDYS.length > 0 && this.applicationFormData.attachmentDYSLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentDYS[0], Constants.DYS).then((url) => {
        if (url) {
          dysUrl.push({ link: url });
        }
        this.applicationFormData.attachmentDYSLinks= dysUrl;
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
    if (this.applicationFormData.attachmentOCSE.length > 0 && this.applicationFormData.attachmentOCSELinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentOCSE[0], Constants.OCSE).then((url) => {
        if (url) {
          ocseUrl.push({ link: url });
        }
       this.applicationFormData.attachmentOCSELinks=ocseUrl;
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
    if (this.applicationFormData.attachmentReference.length > 0 && this.applicationFormData.attachmentReferenceLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentReference[0], Constants.Reference).then((url) => {
        if (url) {
          referenceUrl.push({ link: url });
        }
       this.applicationFormData.attachmentReferenceLinks= referenceUrl
          this.isReferenceUploaded = true;
          this.postRequest(reqType, hideMessage);
      }).catch((err) => {
        console.log(err);
        this.isReferenceUploaded = true;
        this.postRequest(reqType, hideMessage);
      })
    } else {
      this.isReferenceUploaded = true;
      this.postRequest(reqType, hideMessage);
    }
    if (this.applicationFormData.attachmentSignature.length > 0 && this.applicationFormData.attachmentSignatureLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentSignature[0], Constants.Signature).then((url) => {
        if (url) {
          signatureUrl.push({ link: url });
        }
      this.applicationFormData.attachmentSignatureLinks=signatureUrl;
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
    if (this.applicationFormData.attachmentAppendices.length > 0) {
      if(this.applicationFormData.attachmentAppendices.length != this.applicationFormData.attachmentAppendixLinks.length){
      for (let i = this.applicationFormData.attachmentAppendixLinks.length; i < this.applicationFormData.attachmentAppendices.length; i++) {
        if (this.applicationFormData.attachmentAppendices.length != this.applicationFormData.attachmentAppendixLinks.length && this.applicationFormData.attachmentAppendices[i].type) {
          await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentAppendices[i], Constants.Appendix).then((url) => {
            if (url) {
              appendicesUrl.push({ link: url });
            }

          }).catch((err) => {
            console.log(err);
            this.isAppendixUploaded = true;
          });
        }
      }
      this.applicationFormData.attachmentAppendixLinks= appendicesUrl
        this.isAppendixUploaded = true;
        this.postRequest(reqType, hideMessage);
    }else{
      this.isAppendixUploaded = true;
      this.postRequest(reqType, hideMessage);
    }
    } else {
      this.isAppendixUploaded = true;
      this.postRequest(reqType, hideMessage);
    }
    if (this.applicationFormData.attachmentReceipt.length > 0 && this.applicationFormData.attachmentReceiptLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentReceipt[0], Constants.Receipt).then((url) => {
        if (url) {
          receiptUrl.push({ link: url });
        }
        this.applicationFormData.attachmentReceiptLinks= receiptUrl;
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
    } if (this.applicationFormData.attachmentCourse.length > 0 && this.applicationFormData.attachmentCourseLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentCourse[0], Constants.Course).then((url) => {
        if (url) {
          courseUrl.push({ link: url });
        }
        this.applicationFormData.attachmentCourseLinks= courseUrl;
          this.isCourseUploaded = true;
          this.postRequest(reqType, hideMessage);
      }).catch((err) => {
        console.log(err);
        this.isCourseUploaded = true;
        this.postRequest(reqType, hideMessage);
      });
    } else {
      this.isCourseUploaded = true;
      this.postRequest(reqType, hideMessage);
    } if (this.applicationFormData.attachmentBackgroundCheck.length > 0 && this.applicationFormData.attachmentBackgroundCheckLinks.length == 0) {
      await this.blobAccessObj.uploadToBlobBAL(this.applicationFormData.attachmentBackgroundCheck[0], Constants.Background).then((url) => {
        if (url) {
          backgroundUrl.push({ link: url });
        }
        this.applicationFormData.attachmentBackgroundCheckLinks= backgroundUrl;
          this.isBackgroundCheckUploaded = true;
          this.postRequest(reqType, hideMessage);
      }).catch((err) => {
        console.log(err);
        this.isBackgroundCheckUploaded = true;
        this.postRequest(reqType, hideMessage);
      });
    } else {
      this.isBackgroundCheckUploaded = true;
      this.postRequest(reqType, hideMessage);
    }
  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - uploadDocumentsToBlob outer catch", error, new Error().stack);
  }
}
public postRequest(reqType: any, hideMessage?: boolean) {
  try {
    if (this.isReceiptUploaded && this.isSSCUploaded && this.isAppendixUploaded
      && this.isSignatureUploaded && this.isDYSUploaded && this.isOCSEUploaded
      && this.isReferenceUploaded && this.isPhotoUploaded && this.isCourseUploaded && this.isBackgroundCheckUploaded && this.isDMVFrontUploaded && this.isDMVBackUploaded) {
        this.isLoading=true;
        this.applicationFormData.loaderMessage= reqType == Constants.Submit ? "Submitting..." : "Saving..." ;
        if(reqType == Constants.Submit){
          this.sqlAccessObj.submitApplicationBAL(this.applicationFormData, this.props, reqType, hideMessage).then((res) => {
            this.isLoading=false;
           }).catch((err) => {
             this.isLoading=false;
             console.log(err);
             this.commonServObj.logErrors(null, "application-form.component.ts - submitApplicaionBAL", err, new Error().stack);
           });
        }
        else{
      this.sqlAccessObj.saveDraftBAL(this.applicationFormData, this.props, reqType, hideMessage).then((res) => {
       this.isLoading=false;
       this.applicationFormData.draftReqId= res && res.data ? res.data : "";
          if (res && res.data){
            if(reqType==="Next"){
            this.showAI=false; this.showPI=false; this.showRD=false; this.showSM=true;
            }
          }

      }).catch((err) => {
        this.isLoading=false;
        console.log(err);
        this.commonServObj.logErrors(null, "application-form.component.ts - saveDraftBAL", err, new Error().stack);
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
    this.commonServObj.logErrors(null, "application-form.component.ts - postRequest outer catch", error, new Error().stack);
  }
}
submitRequest() {
  try {
    this.isLoading=true;
    if (this.applicationFormData.attachmentDMVFront.length == 0 && this.applicationFormData.attachmentDMVEnd.length == 0) {
      this.uploadDocumentsToBlob(false, Constants.Submit);
    } else {
      this.uploadDocumentsToBlob(true, Constants.Submit);
    }
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "application-form.component.ts - submitRequest", ex, new Error().stack);
  }
}
public async proceedToPayment() {
  try {
    this.isLoading=true;
    this.applicationFormData.loaderMessage="Redirecting...";
    let reqId = (this.props.id=="0" || !this.props.id) ? this.applicationFormData.draftReqId:this.props.id ;
    let amount = this.applicationFormData.feeAmount;
    let applicationType = this.props.applicateType;
    let certificateType = this.props.certificateType;
    let ApplicantName = this.applicationFormData.firstName + " ";
    let zipCode = "";
    if (this.applicationFormData.zipCode.length > 5) {
      zipCode = this.applicationFormData.zipCode.substring(0, 5) + "-" + this.applicationFormData.zipCode.substring(5, 8);
    } else {
      zipCode = this.applicationFormData.zipCode;
    }
    if (this.applicationFormData.middleName) {
      ApplicantName += this.applicationFormData.middleName + " ";
    }
    ApplicantName += this.applicationFormData.lastName;
    let data: IPaymentDetails = {
      reqId: reqId,
      amount: amount,
      applicationType: applicationType,
      certificateType: certificateType,
      ApplicantName: ApplicantName,
      zipCode: zipCode,
      firstName: this.applicationFormData.firstName,
      lastName: this.applicationFormData.lastName,
      address: this.applicationFormData.address,
      city: this.applicationFormData.city,
      phoneNumber: this.applicationFormData.homeNumber,
      state: this.applicationFormData.state.value,
      middleName: this.applicationFormData.middleName
    }
    this.paymentAccessObj.paymentBAL(data).then((res) => {

      if (res && res.returnCode == 0) {
        this.paymentAccessObj.postAndRedirect(res.receiptNumber).then((res) => {
        }).catch((err) => {
          this.isLoading=false;
           })
      } else {
        Swal.fire({
          title: "Warning!",
          text: res && res.returnCode == 999 ? "Something went wrong please try later!" : "Payment page might be busy please try later!",
          icon: "warning",
        })
        this.isLoading=false;
      }
    }).catch((ex) => {
      console.log(ex);
      this.isLoading=false;
      this.commonServObj.logErrors(data.reqId, "application-form.component.ts - proceedToPayment - inner catch", ex, new Error().stack);
    })
  } catch (err) {
    this.commonServObj.logErrors(null, "application-form.component.ts - proceedToPayment - outer catch", err, new Error().stack);

  }
}
public getRequestDetailsForDraft() {
  try {
    debugger
    let url = Constants.GetDraftRequestData;
    var body = {
      "ReqId": this.props.id
    };
    this.isLoading=true;
    this.applicationFormData.loaderMessage="Loading..." ;
    this.apiservice
      .postMethodAxios(url, body)
      .then(async (response: any) => {
        if (
          response &&
          response.data &&
          response.data.table &&
          response.data.table.length > 0
        ) {
          let resArr = response.data.table[0];
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
          let calcinches = resArr.applicantHeight ? resArr.applicantHeight % 12 : 0
          let inches = resArr.applicantHeight ? resArr.applicantHeight % 12 : "";
          let feet = resArr.applicantHeight ? (resArr.applicantHeight - calcinches) / 12 : "";
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
            this.applicationFormData.SSN= resArr.applicantSSN?resArr.applicantSSN:"";
            this.applicationFormData.DMV= resArr.applicantDMVNumber?resArr.applicantDMVNumber:"";
            this.applicationFormData.lastName= resArr.applicantLastName?resArr.applicantLastName:"";
            this.applicationFormData.firstName= resArr.applicantFirstName?resArr.applicantFirstName:"";
            this.applicationFormData.middleName= resArr.applicantMiddleName?resArr.applicantMiddleName:"";
            this.applicationFormData.address= resArr.applicantAddress?resArr.applicantAddress:"";
            this.applicationFormData.apartment= resArr.applicantApartment?resArr.applicantApartment:"";
            this.applicationFormData.city= resArr.applicantCity?resArr.applicantCity:"";
            if(resArr.applicantState){
              let obj={'value':resArr.applicantState,'label':resArr.applicantState}
              this.applicationFormData.state= obj;
              this.ddlselectedState=false;
              }
              else{
                this.applicationFormData.state=[];
                this.ddlselectedState=true;
              }
            this.applicationFormData.zipCode= resArr.applicantZipCode ? resArr.applicantZipCode.replace("-", "") : "";
            this.applicationFormData.postOnWebsite= resArr.postingTelephoneNumber ? "Yes" : "No";
            this.applicationFormData.feet= feet.toString();
            this.applicationFormData.inches= inches.toString();
            this.applicationFormData.weight= resArr.applicantWeight ? resArr.applicantWeight.toString() : "";
            this.applicationFormData.birthDay= resArr.applicantDOB ? moment(resArr.applicantDOB).format("YYYY-MM-DD") : "";
            this.applicationFormData.errorBirthDay= error;
            this.applicationFormData.gender= resArr.applicantGender?resArr.applicantGender:"";
            this.applicationFormData.homeNumber= resArr.homeTelephoneNumber ? resArr.homeTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "") : "";
            this.applicationFormData.workNumber= resArr.workTelephoneNumber ? resArr.workTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "") : "";
            this.applicationFormData.selectedState= resArr.applicantState ? { value: resArr.applicantState, label: resArr.applicantState } : "";
            this.applicationFormData.employerName= resArr.currentEmployerName?resArr.currentEmployerName:"";
            this.applicationFormData.employerAddress= resArr.employerStreetAddress?resArr.employerStreetAddress:"";
            this.applicationFormData.employerCity= resArr.employerCity?resArr.employerCity:"";
            if(resArr.employerState){
              let obj={'value':resArr.employerState,'label':resArr.employerState}
              this.applicationFormData.employerState= obj;
              }
              else{
                this.applicationFormData.employerState={};
              }
            this.applicationFormData.employerZipCode= resArr.employerZipcode ? resArr.employerZipcode.replace("-", "") : "";
            this.applicationFormData.employmentStartDate= resArr.startDateOfEmployment ? moment(resArr.startDateOfEmployment).format("YYYY-MM-DD") : "";
            this.applicationFormData.IsGuilty= resArr.guiltyTrialCheck == null ? "" : resArr.guiltyTrialCheck ? "Yes" : "No";
            this.applicationFormData.IsDisciplined= resArr.licensingCheck == null ? "" : resArr.licensingCheck ? "Yes" : "No";
            this.applicationFormData.IsCriminalCharged= resArr.criminalChargesCheck == null ? "" : resArr.criminalChargesCheck ? "Yes" : "No";
            this.applicationFormData.hasHandlerCertificate= resArr.asbestosCertificateCheck == null ? "" : resArr.asbestosCertificateCheck ? "Yes" : "No";
           if( this.applicationFormData.hasHandlerCertificate=="Yes") this.certificatePnl=true; else this.certificatePnl=false;
            this.applicationFormData.hasMisconductCharges= resArr.anyJurisdictionCheck == null ? "" : resArr.anyJurisdictionCheck ? "Yes" : "No";
            this.applicationFormData.hasHandlerCertificateOtherState= resArr.asbestosHandlingState == null ? "" : resArr.asbestosHandlingState ? "Yes" : "No";

          if (this.applicationFormData.hasHandlerCertificateOtherState == "Yes" && resArr.asbestosCertificateStateName=="") {
            this.ddlCertificateState = true;
          }
          else {
             this.ddlCertificateState = false;
          }
          if (this.applicationFormData.hasHandlerCertificateOtherState == "Yes") {
            this.statePnl = true;
          }
          else {
            this.statePnl = false;
          }
            this.applicationFormData.certificateExpiryDate= resArr.asbestosHandlingExpiry ? moment(resArr.asbestosHandlingExpiry).format("YYYY-MM-DD") : "";
            this.applicationFormData.oldCertificate= resArr.asbestosCertificateValue?resArr.asbestosCertificateValue:"";
            this.applicationFormData.certificateState= resArr.asbestosCertificateStateName?resArr.asbestosCertificateStateName:"";
            this.applicationFormData.certificateExpiryDateOtherState= resArr.asbestosCertificateCheckExpiry ? moment(resArr.asbestosCertificateCheckExpiry).format("YYYY-MM-DD") : "";
            this.applicationFormData.schoolName= resArr.schoolName?resArr.schoolName:"";
            this.applicationFormData.schoolAddress= resArr.schoolStreet?resArr.schoolStreet:"";
            this.applicationFormData.schoolCity= resArr.schoolCity?resArr.schoolCity:"";
            if(resArr.schoolState){
              let obj={'value':resArr.schoolState,'label':resArr.schoolState}
              this.applicationFormData.schoolState= obj;
              }
              else{
                this.applicationFormData.schoolState={};
              }
            this.applicationFormData.schoolZipCode= resArr.schoolZipCode ? resArr.schoolZipCode.replace("-", "") : "";
            this.applicationFormData.selectedEmployerState= resArr.employerState ? { value: resArr.employerState, label: resArr.employerState } : "";
            this.applicationFormData.selectedSchoolState= resArr.schoolState ? { value: resArr.schoolState, label: resArr.schoolState } : "";
            if( resArr.asbestosCertificateStateName){
              let obj={'value': resArr.asbestosCertificateStateName,'label': resArr.asbestosCertificateStateName}
              this.applicationFormData.certificateState= obj;
              }
              else{
                this.applicationFormData.certificateState={};
              }
            this.applicationFormData.draftReqId= this.props.id;
            this.applicationFormData.attachmentSSC= resArr.sscLink ? [{ name: this.getName(resArr.sscLink) }] : [];
            this.applicationFormData.attachmentDMVFront= resArr.dmvFrontLink ? [this.getName(resArr.dmvFrontLink)] : [];
            this.applicationFormData.attachmentDMVEnd= resArr.dmvBackLink ? [this.getName(resArr.dmvBackLink)] : [];
            this.applicationFormData.attachmentPhoto= resArr.photoLink ? [this.getName(resArr.photoLink)] : [];
            this.applicationFormData.attachmentAppendices= attachmentAppendicesArr.length > 0 ? attachmentAppendicesArr : [];
            this.applicationFormData.attachmentOCSE= resArr.ocseLink ? [{ name: this.getName(resArr.ocseLink) }] : [];
            this.applicationFormData.attachmentDYS= resArr.nysLink ? [{ name: this.getName(resArr.nysLink) }] : [];
            this.applicationFormData.attachmentSignature= resArr.signatureLink ? [{ name: this.getName(resArr.signatureLink) }] : [];
            this.applicationFormData.attachmentReceipt= resArr.receiptLink ? [{ name: this.getName(resArr.receiptLink) }] : [];
            this.applicationFormData.attachmentReference= resArr.experienceLinks ? [{ name: this.getName(resArr.experienceLinks) }] : [];
            this.applicationFormData.attachmentCourse= resArr.courseCompletionLink ? [{ name: this.getName(resArr.courseCompletionLink) }] : [];
            this.applicationFormData.attachmentBackgroundCheck= resArr.backgroundChekedLink ? [{ name: this.getName(resArr.backgroundChekedLink) }] : [];
            this.applicationFormData.attachmentSSCLinks= resArr.sscLink ? [{ link: resArr.sscLink }] : [];
            this.applicationFormData.attachmentDMVFrontLinks= resArr.dmvFrontLink ? [{ link: resArr.dmvFrontLink }] : [];
            this.applicationFormData.attachmentDMVEndLinks= resArr.dmvBackLink ? [{ link: resArr.dmvBackLink }] : [];
            this.applicationFormData.attachmentPhotoLinks= resArr.photoLink ? [{ link: resArr.photoLink }] : [];
            this.applicationFormData.attachmentAppendixLinks= attachmentAppendixLinksArr;
            this.applicationFormData.attachmentOCSELinks= resArr.ocseLink ? [{ link: resArr.ocseLink }] : [];
            this.applicationFormData.attachmentDYSLinks= resArr.nysLink ? [{ link: resArr.nysLink }] : [];
            this.applicationFormData.attachmentSignatureLinks= resArr.signatureLink ? [{ link: resArr.signatureLink }] : [];
            this.applicationFormData.attachmentReceiptLinks= resArr.receiptLink ? [{ link: resArr.receiptLink }] : [];
            this.applicationFormData.attachmentReferenceLinks= resArr.experienceLinks ? [{ link: resArr.experienceLinks }] : [];
            this.applicationFormData.attachmentCourseLinks= resArr.courseCompletionLink ? [{ link: resArr.courseCompletionLink }] : [];
            this.applicationFormData.attachmentBackgroundCheckLinks= resArr.backgroundChekedLink ? [{ link: resArr.backgroundChekedLink }] : [];
            this.applicationFormData.IsPaymentComplete= resArr.paymentStatus.toLowerCase() == "paid" ? true : false;
            this.applicationFormData.ocseStatus=resArr.ocseStatus?resArr.ocseStatus:""
        }
        else {
          this.isLoading= false;
        }
      })
      .catch((err) => {
        this.commonServObj.logErrors(body.ReqId, "application-form.component.ts - getRequestDetailsForDraft - inner catch", err, new Error().stack);
      });
  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - getRequestDetailsForDraft - outer catch", error, new Error().stack);
  }
}
public IsGetDataForEditComplete() {
  if (this.isDMVFrontConverted && this.isDMVBackConverted && this.isPhotoConverted) {
    this.isLoading= false;
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
    this.commonServObj.logErrors(null, "application-form.component.ts - getName - inner catch", error, new Error().stack);

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
            this.applicationFormData.base64DMVFront=base.split(",")[1]
              this.isDMVFrontConverted = true;
              this.IsGetDataForEditComplete();
          } else if (type == Constants.DMVBack) {
            this.applicationFormData.base64DMVBack= base.split(",")[1]
              this.isDMVBackConverted = true; this.IsGetDataForEditComplete();
          } else if (type == Constants.Photo) {
            this.applicationFormData.base64Photo= base.split(",")[1] ;
              this.isPhotoConverted = true;
              this.IsGetDataForEditComplete();
          }
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "application-form.component.ts - ConvertBlobtoBase64 - tobase64", err, new Error().stack);
        })
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "application-form.component.ts - ConvertBlobtoBase64 - blob", err, new Error().stack);
      })
    }).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "application-form.component.ts - ConvertBlobtoBase64 - fetch", err, new Error().stack);
    })
  } catch (error) {
    this.commonServObj.logErrors(null, "application-form.component.ts - ConvertBlobtoBase64 - outer catch", error, new Error().stack);
  }
}
changeState(e:any){

if(e){
  this.ddlCertificateState=false;
  }
  else{
    this.ddlCertificateState=true;
  }
}
  AppendixA() {
    window.open(Constants.InvestigatorRenewalAppendixA + this.applicationFormData.blobSASTokenForAppendix);
  }
  AppendixB() {
    window.open(`${Constants.InvestigatorRenewalAppendixB + this.applicationFormData.blobSASTokenForAppendix}`)
  }
  AppendixD() {
    window.open(`${Constants.InvestigatorInitialAppendixD + this.applicationFormData.blobSASTokenForAppendix}`)
  }
  AppendixE() {
    window.open(`${Constants.InvestigatorInitialAppendixE + this.applicationFormData.blobSASTokenForAppendix}`)
  }
  AppendixC() {
    window.open(`${Constants.SupervisorAppendixC + this.applicationFormData.blobSASTokenForAppendix}`)
  }
  AppendixF() {
    window.open(`${Constants.SupervisorAppendixF + this.applicationFormData.blobSASTokenForAppendix}`)
  }
}
