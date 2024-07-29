
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/Api/api.service';
import CommonService from 'src/app/Api/CommonService';
import SQLAccess from 'src/app/Api/SQLAccess';
import { Constants } from 'src/app/Constants/Constants';
import { IPaymentDetails } from 'src/app/Models/paymentDetails';
import BlobAccess from 'src/app/Api/BlobAccess';
import Swal from 'sweetalert2';
import PaymentAccess from 'src/app/Api/PaymentAccess';
import IDScanAccess from 'src/app/Api/IDScanAccess';
import { IDuplicateForm } from 'src/app/Models/duplicateForm';
@Component({
  selector: 'app-duplicate-form',
  templateUrl: './duplicate-form.component.html',
  styleUrls: ['./duplicate-form.component.scss']
})
export class DuplicateFormComponent implements OnInit, OnDestroy {
  duplicateFormData = {} as IDuplicateForm;
  expDate: any = moment(new Date()).format("YYYY-MM-DD");
  today: any = moment(new Date()).subtract(1, "days").format("YYYY-MM-DD");
  props: any;
  currentLogin: any;
  isLoading: boolean = false;
  showPI: boolean = true;
  showAI: boolean = false;
  showRD: boolean = false;
  showSM: boolean = false;
  certificatePnl: boolean = false;
  statePnl: boolean = false;
  ddlselectedState: boolean = true;
  ddlCertificateState: boolean = false;
  public isReceiptUploaded = false;
  public isAppendixUploaded = false;
  public isSignatureUploaded = false;
  public isDYSUploaded = false;
  public isReasonUploaded = false;
  public isRequestChangeUploaded = false;
  public isReferenceUploaded = false;
  public isPhotoUploaded = false;
  public isCourseUploaded = false;
  public isBackgroundCheckUploaded = false;
  AppendixPleacholder: any;
  pictureImage = {
    isCameraPopup: false,
    attachmentPhoto: [],
    title: "Your Picture"
  }
  constructor(private apiservice: ApiService, private route: ActivatedRoute, private authService: MsalService) {
    this.route.queryParams.subscribe(params => { this.props = params;});
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
    Constants.userEmail = this.currentLogin.username;
    this.GetStateList();
    this.getFeeAmount();
    if (this.props.id != "0") {
      this.getRequestDetailsForDraft();
    } else {
      this.getUserDetailsForRenewalRequest();
    }
    this.duplicateFormData.SSN = "";
    this.duplicateFormData.DMV = "";
    this.duplicateFormData.lastName = "";
    this.duplicateFormData.firstName = "";
    this.duplicateFormData.middleName = "";
    this.duplicateFormData.address = "";
    this.duplicateFormData.apartment = "";
    this.duplicateFormData.city = "";
    this.duplicateFormData.state = [];
    this.duplicateFormData.zipCode = "";
    this.duplicateFormData.postOnWebsite = "No";
    this.duplicateFormData.feet = "";
    this.duplicateFormData.inches = "";
    this.duplicateFormData.weight = "";
    this.duplicateFormData.birthDay = "";
    this.duplicateFormData.gender = "";
    this.duplicateFormData.homeNumber = "";
    this.duplicateFormData.workNumber = "";
    this.duplicateFormData.SSNValidation = "";
    this.duplicateFormData.IsValidated = true;
    this.duplicateFormData.employerName = "";
    this.duplicateFormData.employerAddress = "";
    this.duplicateFormData.employerCity = "";
    this.duplicateFormData.employerState = [];
    this.duplicateFormData.employerZipCode = "";
    this.duplicateFormData.employmentStartDate = "";
    this.duplicateFormData.IsGuilty = "";
    this.duplicateFormData.IsDisciplined = "";
    this.duplicateFormData.IsCriminalCharged = "";
    this.duplicateFormData.hasHandlerCertificate = "";
    this.duplicateFormData.hasMisconductCharges = "";
    this.duplicateFormData.hasHandlerCertificateOtherState = "";
    this.duplicateFormData.certificateExpiryDate = "";
    this.duplicateFormData.oldCertificate = "";
    this.duplicateFormData.certificateState = [];
    this.duplicateFormData.certificateExpiryDateOtherState = "";
    this.duplicateFormData.errorSSN = false;
    this.duplicateFormData.errorDMV = false;
    this.duplicateFormData.errorLastName = false;
    this.duplicateFormData.errorFirstName = false;
    this.duplicateFormData.errorAddress = false;
    this.duplicateFormData.errorCity = false;
    this.duplicateFormData.errorState = false;
    this.duplicateFormData.errorZipCode = false;
    this.duplicateFormData.errorBirthDay = false;
    this.duplicateFormData.errorGender = false;
    this.duplicateFormData.errorFeet = false;
    this.duplicateFormData.errorInches = false;
    this.duplicateFormData.errorWeight = false;
    this.duplicateFormData.schoolName = "";
    this.duplicateFormData.schoolAddress = "";
    this.duplicateFormData.schoolCity = "";
    this.duplicateFormData.schoolState = [];
    this.duplicateFormData.schoolZipCode = "";

    this.duplicateFormData.attachmentPhoto = [];
    this.duplicateFormData.attachmentPhotoLinks = [];

    this.duplicateFormData.attachmentSignature = [];
    this.duplicateFormData.attachmentSignatureLinks = [];
    this.duplicateFormData.base64Photo = "";
    this.showPI = this.props.payment && this.props.payment == "cancel" ? false : true;
    this.duplicateFormData.showOtherInfo = false;
    this.duplicateFormData.showRequiredDoc = false;
    this.duplicateFormData.openCapturePhoto = false;
    this.duplicateFormData.errorHomeNumber = false;
    this.duplicateFormData.errorWorkNumber = false;
    this.duplicateFormData.errorSchoolName = false;
    this.duplicateFormData.errorIsGuilty = false;
    this.duplicateFormData.errorIsDisciplined = false;
    this.duplicateFormData.errorIsCriminalCharged = false;
    this.duplicateFormData.errorHasMisConductCharges = false;
    this.duplicateFormData.errorHasHandlerCertificate = false;
    this.duplicateFormData.errorOldCertificate = false;
    this.duplicateFormData.errorCertificateExpiryDate = false;
    this.duplicateFormData.errorHasHandlerCertificateOtherState = false;
    this.duplicateFormData.errorCertificateState = false;
    this.duplicateFormData.errorCertificateExpiryDateOtherState = false;
    this.duplicateFormData.errorPhoto = false;
    this.duplicateFormData.errorSignature = false;
    this.isLoading = true;

    this.duplicateFormData.showPaymentGateway = false;
    this.duplicateFormData.stateTypeValues = [];
    this.duplicateFormData.selectedState = "";
    this.duplicateFormData.selectedEmployerState = "";
    this.duplicateFormData.selectedSchoolState = "";
    this.duplicateFormData.selectedCertificateState = "";
    this.duplicateFormData.hasCertificate = false;
    this.duplicateFormData.loaderMessage = "Loading...";
    this.duplicateFormData.draftReqId = "";
    this.showSM = this.props.payment && this.props.payment == "cancel" ? true : false;
    this.duplicateFormData.feeAmount = 0;
    this.duplicateFormData.IsPaymentComplete = false;
    this.duplicateFormData.attachmentReason = [];
    this.duplicateFormData.attachmentReasonLinks = [];
    this.duplicateFormData.attachmentRequestChange = [];
    this.duplicateFormData.attachmentRequestChangeLinks = [];
    this.duplicateFormData.CertificateDuplicate = [];
    this.duplicateFormData.expiryDateDuplicate = [];
    this.duplicateFormData.errorReason = false;
    this.duplicateFormData.errorRequestChange = false;

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    $('#nav-app-form').remove();
    if (this.duplicateFormData.draftReqId) {
      this.saveAsDraft(Constants.Documents, Constants.Save, true);
    }
  }
  public GetStateList() {
    try {
      this.sqlAccessObj.GetStateListBAL().then((data: any) => {
        this.duplicateFormData.stateTypeValues = data[0];

      }).catch((ex) => {
        this.commonServObj.logErrors(null, "duplicate-form.component.ts - GetStateList - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "duplicate-form.component.ts - GetStateList - outer catch", err, new Error().stack);

    }
  }
  alphabetsOnly(e: any) {  // Accept only alpha numerics, not special characters
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
  disabledDate() {
    return false;
  }
  validateInput(e: any, len: any) {
    var inp = String.fromCharCode(e.keyCode);
    if (len == "9") {
      if (e.target.value.length == 9 || e.key == 'e' || e.key == '.') return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
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
      if (e.target.value.length == 2 || e.key == 'e' || e.key == '.' || (e.target.value + e.key) > 11) return false;
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
      else { e.preventDefault(); return false; }
    }
    if (len == "5") {
      if (e.target.value.length == 5 || e.key == 'e') return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
    if (len == "N") {
      if ((e.key == '/') || (e.key == 'Enter')) return false;
    }
    if (len == "10") {
      if (e.target.value.length == 10) return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
  }
  NumbersOnly(evt: any) {
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
  }

  public async getFeeAmount() {
    try {
      this.sqlAccessObj.getFeeAmount(this.props.certificateType, this.props.applicateType).then((fee) => {
        this.duplicateFormData.feeAmount = fee;
      }).catch((ex) => {
        console.log(ex);
        this.commonServObj.logErrors(null, "duplicate-form - getFeeAmount - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "duplicate-form - getFeeAmount - outer catch", err, new Error().stack);

    }
  }
  public getRequestDetailsForDraft() {
    try {
      this.isLoading = true; this.duplicateFormData.loaderMessage = "Loading...";
      let url = Constants.GetDraftRequestData;
      var body = {
        "ReqId": this.props.id == "0" ? this.duplicateFormData.draftReqId : this.props.id,
      };
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
            this.duplicateFormData.CertificateDuplicate = resArr.oldCertificateNumber ? resArr.oldCertificateNumber : "";
            this.duplicateFormData.expiryDateDuplicate = resArr.oldCertificateExpiryDate ? moment(resArr.oldCertificateExpiryDate).format("YYYY-MM-DD") : "";
            this.duplicateFormData.DMV = resArr.applicantDMVNumber ? resArr.applicantDMVNumber : "";
            this.duplicateFormData.SSN = resArr.applicantSSN ? resArr.applicantSSN : "";
            this.duplicateFormData.lastName = resArr.applicantLastName ? resArr.applicantLastName : "";
            this.duplicateFormData.firstName = resArr.applicantFirstName ? resArr.applicantFirstName : "";
            this.duplicateFormData.middleName = resArr.applicantMiddleName ? resArr.applicantMiddleName : "";
            this.duplicateFormData.address = resArr.applicantAddress ? resArr.applicantAddress : "";
            this.duplicateFormData.apartment = resArr.applicantApartment ? resArr.applicantApartment : "";
            this.duplicateFormData.city = resArr.applicantCity ? resArr.applicantCity : "";
            if (resArr.applicantState) {
              let obj = { 'value': resArr.applicantState, 'label': resArr.applicantState }
              this.duplicateFormData.state = obj;
              this.ddlselectedState = false;
            }
            else {
              this.duplicateFormData.state = [];
              this.ddlselectedState = true;
            }
            this.duplicateFormData.zipCode = resArr.applicantZipCode ? resArr.applicantZipCode.replace("-", "") : "";
            this.duplicateFormData.postOnWebsite = resArr.postingTelephoneNumber ? "Yes" : "No";
            this.duplicateFormData.feet = feet.toString();
            this.duplicateFormData.inches = inches.toString();
            this.duplicateFormData.weight = resArr.applicantWeight ? resArr.applicantWeight.toString() : "";
            this.duplicateFormData.birthDay = resArr.applicantDOB ? moment(resArr.applicantDOB).format("YYYY-MM-DD") : "";
            this.duplicateFormData.errorBirthDay = error;
            this.duplicateFormData.gender = resArr.applicantGender ? resArr.applicantGender : "";
            this.duplicateFormData.homeNumber = resArr.homeTelephoneNumber ? resArr.homeTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "") : "";
            this.duplicateFormData.workNumber = resArr.workTelephoneNumber ? resArr.workTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "") : "";
            this.duplicateFormData.selectedState = resArr.applicantState ? { value: resArr.applicantState, label: resArr.applicantState } : "";
            this.duplicateFormData.employerName = resArr.currentEmployerName ? resArr.currentEmployerName : "";
            this.duplicateFormData.employerAddress = resArr.employerStreetAddress ? resArr.employerStreetAddress : "";
            this.duplicateFormData.employerCity = resArr.employerCity ? resArr.employerCity : "";
            if (resArr.employerState) {
              let obj = { 'value': resArr.employerState, 'label': resArr.employerState }
              this.duplicateFormData.employerState = obj;
            }
            else {
              this.duplicateFormData.employerState = {};
            }
            this.duplicateFormData.employerZipCode = resArr.employerZipcode ? resArr.employerZipcode.replace("-", "") : "";
            this.duplicateFormData.employmentStartDate = resArr.startDateOfEmployment ? moment(resArr.startDateOfEmployment).format("YYYY-MM-DD") : "";
            this.duplicateFormData.IsGuilty = resArr.guiltyTrialCheck == null ? "" : resArr.guiltyTrialCheck ? "Yes" : "No";
            this.duplicateFormData.IsDisciplined = resArr.licensingCheck == null ? "" : resArr.licensingCheck ? "Yes" : "No";
            this.duplicateFormData.IsCriminalCharged = resArr.criminalChargesCheck == null ? "" : resArr.criminalChargesCheck ? "Yes" : "No";
            this.duplicateFormData.hasHandlerCertificate = resArr.asbestosCertificateCheck == null ? "" : resArr.asbestosCertificateCheck ? "Yes" : "No";
            if (this.duplicateFormData.hasHandlerCertificate == "Yes") this.certificatePnl = true; else this.certificatePnl = false;
            this.duplicateFormData.hasMisconductCharges = resArr.anyJurisdictionCheck == null ? "" : resArr.anyJurisdictionCheck ? "Yes" : "No";
            this.duplicateFormData.hasHandlerCertificateOtherState = resArr.asbestosHandlingState == null ? "" : resArr.asbestosHandlingState ? "Yes" : "No";
            if (this.duplicateFormData.hasHandlerCertificateOtherState == "Yes" && resArr.asbestosCertificateStateName == "") {
              this.ddlCertificateState = true;
            }
            else {
              this.ddlCertificateState = false;
            }
            if (this.duplicateFormData.hasHandlerCertificateOtherState == "Yes") {
              this.statePnl = true;
            }
            else {
              this.statePnl = false;
            }
            this.duplicateFormData.certificateExpiryDate = resArr.asbestosHandlingExpiry ? moment(resArr.asbestosHandlingExpiry).format("YYYY-MM-DD") : "";
            this.duplicateFormData.oldCertificate = resArr.asbestosCertificateValue;
            if (resArr.asbestosCertificateStateName) {
              let obj = { 'value': resArr.asbestosCertificateStateName, 'label': resArr.asbestosCertificateStateName }
              this.duplicateFormData.certificateState = obj;
            }
            else {
              this.duplicateFormData.certificateState = {};
            }
            this.duplicateFormData.certificateExpiryDateOtherState = resArr.asbestosCertificateCheckExpiry ? moment(resArr.asbestosCertificateCheckExpiry).format("YYYY-MM-DD") : "";
            this.duplicateFormData.schoolName = resArr.schoolName ? resArr.schoolName : "";
            this.duplicateFormData.schoolAddress = resArr.schoolStreet ? resArr.schoolStreet : "";
            this.duplicateFormData.schoolCity = resArr.schoolCity ? resArr.schoolCity : "";
            if (resArr.schoolState) {
              let obj = { 'value': resArr.schoolState, 'label': resArr.schoolState }
              this.duplicateFormData.schoolState = obj;
            }
            else {
              this.duplicateFormData.schoolState = {};
            }
            this.duplicateFormData.schoolZipCode = resArr.schoolZipCode ? resArr.schoolZipCode.replace("-", "") : "";
            this.duplicateFormData.selectedEmployerState = resArr.employerState ? { value: resArr.employerState, label: resArr.employerState } : "";
            this.duplicateFormData.selectedSchoolState = resArr.schoolState ? { value: resArr.schoolState, label: resArr.schoolState } : "";
            this.duplicateFormData.selectedCertificateState = resArr.asbestosCertificateStateName;
            this.duplicateFormData.draftReqId = this.props.id;
            this.duplicateFormData.hasCertificate = resArr.isPhysicalApplication ? false : true;

            this.duplicateFormData.attachmentPhoto = resArr.photoLink ? [this.getName(resArr.photoLink)] : [];

            this.duplicateFormData.attachmentSignature = resArr.signatureLink ? [{ name: this.getName(resArr.signatureLink) }] : [];

            this.duplicateFormData.attachmentPhotoLinks = resArr.photoLink ? [{ link: resArr.photoLink }] : [];

            this.duplicateFormData.attachmentSignatureLinks = resArr.signatureLink ? [{ link: resArr.signatureLink }] : [];
            this.duplicateFormData.IsPaymentComplete = resArr.paymentStatus.toLowerCase() == "paid" ? true : false;
            this.duplicateFormData.attachmentReason = resArr.reasonLink ? [{ name: this.getName(resArr.reasonLink) }] : [];
            this.duplicateFormData.attachmentReasonLinks = resArr.reasonLink ? [{ link: resArr.reasonLink }] : [];
            this.duplicateFormData.attachmentRequestChange = resArr.requestChangeLink ? [{ name: this.getName(resArr.requestChangeLink) }] : [];
            this.duplicateFormData.attachmentRequestChangeLinks = resArr.requestChangeLink ? [{ link: resArr.requestChangeLink }] : [];
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
          }
        })
        .catch((err: any) => {
          this.isLoading = false;
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "duplicate-form - getRequestDetailsForDraft - inner catch", err, new Error().stack);
        });
    } catch (error) {
      this.commonServObj.logErrors(null, "duplicate-form - getRequestDetailsForDraft - outer catch", error, new Error().stack);
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
      this.commonServObj.logErrors(null, "duplicate-form - getName - inner catch", error, new Error().stack);

    }
  }


  public getUserDetailsForRenewalRequest() {
    try {
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

            this.duplicateFormData.CertificateDuplicate = resArr.certificateNumber;
            this.duplicateFormData.expiryDateDuplicate = moment(resArr.expiresOn).format("YYYY-MM-DD");
            this.duplicateFormData.DMV = resArr.applicantDMVNumber ? resArr.applicantDMVNumber : "";
            this.duplicateFormData.SSN = resArr.applicantSSN ? resArr.applicantSSN : "";
            this.duplicateFormData.lastName = resArr.applicantLastName ? resArr.applicantLastName : "";
            this.duplicateFormData.firstName = resArr.applicantFirstName ? resArr.applicantFirstName : "";
            this.duplicateFormData.middleName = resArr.applicantMiddleName ? resArr.applicantMiddleName : "";
            this.duplicateFormData.address = resArr.applicantAddress ? resArr.applicantAddress : "";
            this.duplicateFormData.apartment = resArr.applicantApartment ? resArr.applicantApartment : "";
            this.duplicateFormData.city = resArr.applicantCity ? resArr.applicantCity : "";
            if (resArr.applicantState) {
              let obj = { 'value': resArr.applicantState, 'label': resArr.applicantState }
              this.duplicateFormData.state = obj;
              this.ddlselectedState = false;
            }
            else {
              this.duplicateFormData.state = [];
              this.ddlselectedState = true;
            }
            this.duplicateFormData.zipCode = resArr.applicantZipCode.replace("-", "");
            this.duplicateFormData.postOnWebsite = resArr.postingTelephoneNumber ? "Yes" : "No";
            this.duplicateFormData.feet = feet.toString();
            this.duplicateFormData.inches = inches.toString();
            this.duplicateFormData.weight = resArr.applicantWeight.toString();
            this.duplicateFormData.birthDay = moment(resArr.applicantDOB).format("YYYY-MM-DD");
            this.duplicateFormData.gender = resArr.applicantGender;
            this.duplicateFormData.homeNumber = resArr.homeTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
            this.duplicateFormData.workNumber = resArr.workTelephoneNumber.replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
            this.duplicateFormData.selectedState = { value: resArr.applicantState, label: resArr.applicantState };
            this.duplicateFormData.hasCertificate = true;
            this.isLoading = false;
          }
          else {
            this.duplicateFormData.hasCertificate = false;
            this.isLoading = false;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
          this.commonServObj.logErrors(null, "duplicate-form - getUserDetailsForDuplicateRequest - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "duplicate-form - getUserDetailsForDuplicateRequest - outer catch", err, new Error().stack);

    }
  }
  saveAsDraftforPI() {
    this.saveAsDraft(Constants.Personal, Constants.Save);
  }
  changeState(e: any) {
    if (e) {
      this.ddlCertificateState = false;
    }
    else {
      this.ddlCertificateState = true;
    }
  }
  changeStates(e: any) {
    if (e) {
      this.ddlselectedState = false;
    }
    else {
      this.ddlselectedState = true;
    }
  }
  public checkValidationsOI() {
    try {
      this.duplicateFormData.oldCertificate = this.duplicateFormData.oldCertificate.toString();
      if ((this.duplicateFormData.schoolName.trim().length == 0 ||
        this.duplicateFormData.IsGuilty.length == 0 ||
        this.duplicateFormData.IsDisciplined.length == 0 ||
        this.duplicateFormData.IsCriminalCharged.length == 0 ||
        this.duplicateFormData.hasMisconductCharges.length == 0 ||
        this.duplicateFormData.hasHandlerCertificate.length == 0 ||
        this.duplicateFormData.hasHandlerCertificateOtherState.length == 0) ||
        (this.duplicateFormData.hasHandlerCertificate == "Yes" && (this.duplicateFormData.oldCertificate.trim().length == 0 || this.duplicateFormData.certificateExpiryDate == ""))
        || (this.duplicateFormData.hasHandlerCertificateOtherState == "Yes" && (this.duplicateFormData.certificateState.value.trim().length == 0 || this.duplicateFormData.certificateExpiryDateOtherState == ""))) {

      } else {
        $(window).scrollTop(0);
        this.saveAsDraft(Constants.Additional, Constants.Next);

      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form - checkValidationsOI", ex, new Error().stack);
    }
  }
  backPI() {
    this.showAI = false;
    this.showPI = true;
    this.showRD = false;
    this.showSM = false;
    this.duplicateFormData.showPaymentGateway = false; this.duplicateFormData.showSummary = false;
  }
  backAI() {
    this.showAI = true;
    this.showPI = false;
    this.showRD = false;
    this.showSM = false;
    this.duplicateFormData.showPaymentGateway = false; this.duplicateFormData.showSummary = false;
  }
  backRD() {
    this.showAI = false;
    this.showPI = false;
    this.showRD = true;
    this.showSM = false;
    this.duplicateFormData.showPaymentGateway = false; this.duplicateFormData.showSummary = false;
  }
  showcertificatePnl() {
    this.certificatePnl = true;
  }
  hidecertificatePnl() {
    this.certificatePnl = false;
    this.duplicateFormData.certificateExpiryDate = "";
    this.duplicateFormData.oldCertificate = "";
  }
  showstatePnl() {
    this.statePnl = true;
    this.duplicateFormData.selectedCertificateState = "";
    this.duplicateFormData.certificateState = [];
    this.ddlCertificateState = false;
  }
  hidestatePnl() {
    this.statePnl = false;
    this.duplicateFormData.certificateExpiryDateOtherState = "";
    this.duplicateFormData.selectedCertificateState = "";
    this.duplicateFormData.certificateState = [];
    this.ddlCertificateState = false;
  }
  savePI() {
    this.checkValidationsPI();
  }
  public saveAsDraft(type: any, button: any, hideMessage?: any) {
    try {
      this.duplicateFormData.CertificateDuplicate = this.duplicateFormData.CertificateDuplicate.toString();
      this.duplicateFormData.DMV = this.duplicateFormData.DMV.toString();
      this.duplicateFormData.SSN = this.duplicateFormData.SSN.toString();
      this.duplicateFormData.feet = this.duplicateFormData.feet.toString();
      this.duplicateFormData.inches = this.duplicateFormData.inches.toString();
      this.duplicateFormData.weight = this.duplicateFormData.weight.toString();
      this.duplicateFormData.zipCode = this.duplicateFormData.zipCode.toString();
      this.duplicateFormData.homeNumber = this.duplicateFormData.homeNumber.toString();
      this.duplicateFormData.workNumber = this.duplicateFormData.workNumber.toString();
      if (type != Constants.Documents) {
        if (type == Constants.Personal) {
          if (
            this.duplicateFormData.CertificateDuplicate.trim().length != 0 ||
            this.duplicateFormData.expiryDateDuplicate != "" ||
            this.duplicateFormData.firstName.trim().length != 0 ||
            this.duplicateFormData.lastName.trim().length != 0 ||
            this.duplicateFormData.DMV.trim().length != 0 ||
            this.duplicateFormData.SSN.trim().length != 0 ||
            this.duplicateFormData.birthDay != "" ||
            this.duplicateFormData.feet.trim().length != 0 ||
            this.duplicateFormData.inches.trim().length != 0 ||
            this.duplicateFormData.weight.trim().length != 0 ||
            this.duplicateFormData.gender != "" ||
            this.duplicateFormData.address.trim().length != 0 ||
            this.duplicateFormData.zipCode.trim().length != 0 ||
            this.duplicateFormData.city.trim().length != 0 ||
            (this.duplicateFormData.state != null &&
              this.duplicateFormData.state.length != 0)||
            this.duplicateFormData.homeNumber.trim().length != 0
          ) {
            this.isLoading = true; this.duplicateFormData.loaderMessage = "Saving...";
            if (this.props.id!="0" || this.duplicateFormData.draftReqId) {
            this.sqlAccessObj.saveDraftDuplicateBAL(this.duplicateFormData, this.props, button).then((res: any) => {
              this.isLoading = false;
              if (res && res.data) {
                if (button == "Next") {
                  this.showPI = false; this.showAI = true; this.showRD = false; this.showSM = false;
                }
                this.duplicateFormData.draftReqId = res.data;
              }

            }).catch((err: any) => {
              this.isLoading = false;
              console.log(err);
              this.commonServObj.logErrors(null, "duplicate-form - saveAsDraft - personal", err, new Error().stack);

            });
          }else{
            this.sqlAccessObj.InsertDraftDuplicateBAL(this.duplicateFormData, this.props, button).then((res) => {
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
                this.duplicateFormData.draftReqId=res.data;
              }

            }).catch((err:any) => {
              this.isLoading= false;
              this.commonServObj.logErrors(null, "duplicate-form.component.ts - saveAsDraft - Insert - personal", err, new Error().stack);
            });
          }
          } else {
            Swal.fire({
              title: "Warning!",
              text: "Please provide values for atleast one of the mandatory fields to save as draft!",
              icon: "warning"
            }).then(() => {

            }).catch((err: any) => console.log(err));
          }
        } else {
          this.isLoading = true; this.duplicateFormData.loaderMessage = "Saving...";
          this.sqlAccessObj.saveDraftDuplicateBAL(this.duplicateFormData, this.props, button).then((res) => {
            this.isLoading = false;
            if (res && res.data) {
              if (button == "Next" && type == "Additional") {
                this.showPI = false; this.showAI = false; this.showRD = true; this.showSM = false;
              }
              this.duplicateFormData.draftReqId = res.data;
            }

          }).catch((err) => {
            this.isLoading = false;
            console.log(err);
            this.commonServObj.logErrors(null, "duplicate-form - saveAsDraft - Additional", err, new Error().stack);
          });
        }
      } else {
        this.isLoading = true;
        this.uploadDocumentsToBlob(false, button, hideMessage);
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "duplicate-form - saveAsDraft - outer catch", error, new Error().stack);

    }
  }
  public async uploadDocumentsToBlob(scan: boolean, reqType: any, hideMessage?: boolean) {
    try {
      let signatureUrl: any[] = [];
      let photoUrl: any[] = [];
      let ReasonUrl: any[] = [];
      let RequestChangeUrl: any[] = [];
      if (!scan) {
        if (this.duplicateFormData.base64Photo && this.duplicateFormData.attachmentPhotoLinks.length == 0) {
          await this.blobAccessObj.uploadToBlobBALID(Constants.Photo, this.duplicateFormData.base64Photo).then((url: any) => {
            if (url) {
              photoUrl.push({ link: url });
            }
            this.duplicateFormData.attachmentPhotoLinks = photoUrl;
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

      if (this.duplicateFormData.attachmentSignature.length > 0 && this.duplicateFormData.attachmentSignatureLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.duplicateFormData.attachmentSignature[0], Constants.Signature).then((url) => {
          if (url) {
            signatureUrl.push({ link: url });
          }
          this.duplicateFormData.attachmentSignatureLinks = signatureUrl;
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
      if (this.duplicateFormData.attachmentReason.length > 0 && this.duplicateFormData.attachmentReasonLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.duplicateFormData.attachmentReason[0], Constants.Reason).then((url) => {
          if (url) {
            ReasonUrl.push({ link: url });
          }
          this.duplicateFormData.attachmentReasonLinks = ReasonUrl;
          this.isReasonUploaded = true;
          this.postRequest(reqType, hideMessage);

        }).catch((err) => {
          console.log(err);
          this.isReasonUploaded = true;
          this.postRequest(reqType, hideMessage);
        })
      } else {
        this.isReasonUploaded = true;
        this.postRequest(reqType, hideMessage);
      }
      if (this.duplicateFormData.attachmentRequestChange.length > 0 && this.duplicateFormData.attachmentRequestChangeLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.duplicateFormData.attachmentRequestChange[0], Constants.RequestChange).then((url) => {
          if (url) {
            RequestChangeUrl.push({ link: url });
          }
          this.duplicateFormData.attachmentRequestChangeLinks = RequestChangeUrl;
          this.isRequestChangeUploaded = true;
          this.postRequest(reqType, hideMessage);

        }).catch((err) => {
          console.log(err);
          this.isRequestChangeUploaded = true;
          this.postRequest(reqType, hideMessage);
        })
      } else {
        this.isRequestChangeUploaded = true;
        this.postRequest(reqType, hideMessage);
      }

    } catch (error) {
      this.commonServObj.logErrors(null, "duplicate-form - uploadDocumentsToBlob outer catch", error, new Error().stack);
    }
  }
  public postRequest(reqType: any, hideMessage?: boolean) {
    try {
      if (this.isSignatureUploaded && this.isReasonUploaded && this.isRequestChangeUploaded
        && this.isPhotoUploaded) {
        this.duplicateFormData.loaderMessage = reqType == Constants.Submit ? "Submitting..." : "Saving...";
        if(reqType == Constants.Submit){
          this.sqlAccessObj.submitDuplicateBAL(this.duplicateFormData, this.props, reqType, hideMessage).then((res) => {
            this.isLoading=false;
           }).catch((err) => {
             this.isLoading=false;
             console.log(err);
             this.commonServObj.logErrors(null, "duplicate-form.component.ts - submitDuplicateBAL", err, new Error().stack);
           });
        }
        else{
        this.sqlAccessObj.saveDraftDuplicateBAL(this.duplicateFormData, this.props, reqType, hideMessage).then((res) => {
          this.isLoading = false; this.duplicateFormData.draftReqId = res && res.data ? res.data : "";
          if (res && res.data) {
            if (reqType === "Next") {
              this.showAI = false; this.showPI = false; this.showRD = false; this.showSM = true;
            }
          }
        }).catch((err) => {
          this.isLoading = false;
          console.log(err)
          this.commonServObj.logErrors(null, "duplicate-form - saveDraftBAL", err, new Error().stack);
        });
      }
        this.isReceiptUploaded = false;
        this.isAppendixUploaded = false;
        this.isSignatureUploaded = false;
        this.isPhotoUploaded = false;
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "duplicate-form - postRequest outer catch", error, new Error().stack);
    }
  }
  public checkValidationsPI() {
    try {
      this.duplicateFormData.CertificateDuplicate = this.duplicateFormData.CertificateDuplicate.toString();
      this.duplicateFormData.DMV = this.duplicateFormData.DMV.toString();
      this.duplicateFormData.SSN = this.duplicateFormData.SSN.toString();
      this.duplicateFormData.feet = this.duplicateFormData.feet.toString();
      this.duplicateFormData.inches = this.duplicateFormData.inches.toString();
      this.duplicateFormData.weight = this.duplicateFormData.weight.toString();
      this.duplicateFormData.zipCode = this.duplicateFormData.zipCode.toString();
      this.duplicateFormData.homeNumber = this.duplicateFormData.homeNumber.toString();
      this.duplicateFormData.workNumber = this.duplicateFormData.workNumber.toString();
      if (
        this.duplicateFormData.CertificateDuplicate.trim().length == 0 ||
        this.duplicateFormData.expiryDateDuplicate == "" ||
        this.duplicateFormData.firstName.trim().length == 0 ||
        this.duplicateFormData.lastName.trim().length == 0 ||
        this.duplicateFormData.DMV.trim().length == 0 ||
        this.duplicateFormData.SSN.trim().length == 0 ||
        this.duplicateFormData.birthDay == "" ||
        this.duplicateFormData.feet.trim().length == 0 ||
        this.duplicateFormData.inches.trim().length == 0 ||
        this.duplicateFormData.weight.trim().length == 0 ||
        this.duplicateFormData.gender == "" ||
        this.duplicateFormData.address.trim().length == 0 ||
        this.duplicateFormData.zipCode.trim().length == 0 ||
        this.duplicateFormData.city.trim().length == 0 ||
        this.duplicateFormData.state.value.trim().length == 0 ||
        this.duplicateFormData.homeNumber.trim().length == 0

      ) {

      } else {
        $(window).scrollTop(0);
        this.saveAsDraft(Constants.Personal, Constants.Next);

      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form - checkValidationsPI", ex, new Error().stack);
    }
  }

  changeImg(e: any, type: any) {
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
          this.validateID(e, type);
        } else {
          this.FileAttach(e, type);
        }
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "duplicate-form.component.ts - handleAttachments - outer catch", error, new Error().stack);

    }
  }
  public async validateID(e: any, type: any) {
    try {
      this.commonServObj.toBase64(e.target.files[0]).then(async (result: any) => {
        let name = e.target.files[0].name;
        let nameArr: any[] = [];
        nameArr.push(name);
        if (type == "Photo") {
          this.duplicateFormData.base64Photo = result.split(",")[1]; this.duplicateFormData.attachmentPhoto = nameArr;
        }
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "duplicate-form.component.ts - validateID - inner catch", err, new Error().stack);
      })
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form.component.ts - validateID - outer catch", ex, new Error().stack);
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
      if (type == "Reason") {
        this.duplicateFormData.attachmentReason = data;
      }
      else if (type == "RequestChange") {
        this.duplicateFormData.attachmentRequestChange = data;
      }
      else if (type == "Signature") {
        this.duplicateFormData.attachmentSignature = data;
      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form - FileAttach", ex, new Error().stack);
    }
  }
  public removeAttachment(index: any, type: any) {
    try {
      let attachments: String[] =
        type == "Reason" ? this.duplicateFormData.attachmentReason : type == "RequestChange" ? this.duplicateFormData.attachmentRequestChange : type == "Photo" ? this.duplicateFormData.attachmentPhoto :
          type == "Signature" ? this.duplicateFormData.attachmentSignature : [];
      let attachmentLinks = type == "Reason" ? this.duplicateFormData.attachmentReasonLinks : type == "RequestChange" ? this.duplicateFormData.attachmentRequestChangeLinks : type == "Photo" ? this.duplicateFormData.attachmentPhotoLinks :
        type == "Signature" ? this.duplicateFormData.attachmentSignatureLinks : [];
      attachments.splice(index, 1);
      let deleteFile = attachmentLinks.length > 0 ? attachmentLinks[index] : "";
      if (deleteFile && deleteFile.link) {
        this.blobAccessObj.deleteFileFromBlobBAL(this.commonServObj.getNameForDelete(deleteFile.link));
      }
      if (attachmentLinks && attachmentLinks.length > 0) {
        attachmentLinks.splice(index, 1);
      }
      if (type == "Reason") {
        $("#attachment-Reason").val("");
        this.duplicateFormData.attachmentReason = attachments;
        this.duplicateFormData.attachmentReasonLinks = attachmentLinks;
      }
      else if (type == "RequestChange") {
        $("#attachment-RequestChange").val("");
        this.duplicateFormData.attachmentRequestChange = attachments;
        this.duplicateFormData.attachmentRequestChangeLinks = attachmentLinks;
      }

      else if (type == "Photo") {
        $("#attachment-photo").val("");
        this.duplicateFormData.base64Photo = "";
        this.duplicateFormData.attachmentPhoto = attachments;
        this.duplicateFormData.attachmentPhotoLinks = attachmentLinks;
      }
      else if (type == "Signature") {
        $("#attachment-signature").val("");
        this.duplicateFormData.attachmentSignature = attachments;
        this.duplicateFormData.attachmentSignatureLinks = attachmentLinks;
      }

    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form.component.ts - removeAttachment - outer catch", ex, new Error().stack);

    }
  }


  public checkValidationsRD() {
    try {
      if (this.duplicateFormData.attachmentPhoto.length > 0 && this.duplicateFormData.attachmentSignature.length > 0 && (this.duplicateFormData.attachmentReason.length > 0)) {
        $(window).scrollTop(0);
        if (this.duplicateFormData.IsPaymentComplete) {
          this.saveAsDraft(Constants.Documents, Constants.Submit);
        } else {
          this.saveAsDraft(Constants.Documents, Constants.Next);
          this.duplicateFormData.errorReason = this.duplicateFormData.attachmentReason.length == 0;
          this.duplicateFormData.errorPhoto = this.duplicateFormData.attachmentPhoto.length == 0;
          this.duplicateFormData.errorSignature = this.duplicateFormData.attachmentSignature.length == 0;
          this.duplicateFormData.showPersonalInfo = false;
          this.duplicateFormData.showOtherInfo = false;
          this.duplicateFormData.showRequiredDoc = false;
          this.duplicateFormData.showPaymentGateway = false;
          this.duplicateFormData.showSummary = true;

        }
      }

      else {

        Swal.fire({
          icon: 'error',
          title: 'Missing Mandatory Information',
          text: 'You must upload all the mandatory Documents denoted by * sign.'
        })
      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form.component.ts - checkValidationsRD", ex, new Error().stack);
    }
  }

  public submitRequest() {
    try {
      this.isLoading = true;
      this.uploadDocumentsToBlob(false, Constants.Submit);
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "duplicate-form - submitRequest", ex, new Error().stack);
    }
  }
  public async proceedToPayment() {
    try {
      this.isLoading = true; this.duplicateFormData.loaderMessage = "Redirecting...";
      let reqId = (this.props.id == "0" || !this.props.id) ? this.duplicateFormData.draftReqId : this.props.id;
      let amount = this.duplicateFormData.feeAmount;
      let applicationType = this.props.applicateType;
      let certificateType = this.props.certificateType;
      let ApplicantName = this.duplicateFormData.firstName + " ";
      let zipCode = "";
      if (this.duplicateFormData.zipCode.length > 5) {
        zipCode = this.duplicateFormData.zipCode.substring(0, 5) + "-" + this.duplicateFormData.zipCode.substring(5, 8);
      } else {
        zipCode = this.duplicateFormData.zipCode;
      }
      if (this.duplicateFormData.middleName) {
        ApplicantName += this.duplicateFormData.middleName + " ";
      }
      ApplicantName += this.duplicateFormData.lastName;
      let data: IPaymentDetails = {
        reqId: reqId,
        amount: amount,
        applicationType: applicationType,
        certificateType: certificateType,
        ApplicantName: ApplicantName,
        zipCode: zipCode,
        firstName: this.duplicateFormData.firstName,
        lastName: this.duplicateFormData.lastName,
        address: this.duplicateFormData.address,
        city: this.duplicateFormData.city,
        phoneNumber: this.duplicateFormData.homeNumber,
        state: this.duplicateFormData.state.value,
        middleName: this.duplicateFormData.middleName
      }
      this.paymentAccessObj.paymentBAL(data).then((res) => {
        if (res && res.returnCode == 0) {
          this.paymentAccessObj.postAndRedirect(res.receiptNumber).then((res) => {
          }).catch((err) => {
            this.isLoading = false;
          })
        } else {
          Swal.fire({
            title: "Warning!",
            text: res && res.returnCode == 999 ? "Something went wrong please try later!" : "Payment page might be busy please try later!",
            icon: "warning",
          })
          this.isLoading = false;
        }
      }).catch((ex) => {
        console.log(ex);
        this.isLoading = false;
        this.commonServObj.logErrors(data.reqId, "duplicate-form - proceedToPayment - inner catch", ex, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "duplicate-form - proceedToPayment - outer catch", err, new Error().stack);

    }
  }

  public getImage(d: string) {
    let nameArr: any[] = [];
    if (this.duplicateFormData.openCapturePhoto) {
      this.removeAttachment(0, 'Photo')
      nameArr.push("CapturePhoto.png");
      let split_str = d.split(",");
      this.duplicateFormData.base64Photo = split_str[1]; this.duplicateFormData.attachmentPhoto = nameArr;
      this.duplicateFormData.openCapturePhoto = false;
    }
  }
}
