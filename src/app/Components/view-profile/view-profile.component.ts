import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/Constants';
import { ApiService } from 'src/app/Api/api.service';
import { MsalService } from '@azure/msal-angular';
import CommonService from 'src/app/Api/CommonService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  @Input() parent: any;
  state: any
  public viewState: any;
  cellsToShow: number = 3;
  public Languages = [
    { value: "EN", label: "English" },
    { value: "KO", label: "Korean" },
    { value: "PL", label: "Polish" },
    { value: "RU", label: "Russian" },
    { value: "SH", label: "Serbo-Croatian" },
    { value: "ES", label: "Spanish" },
  ];
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  constructor(private apiservice: ApiService, private authService: MsalService) {
    var currentLogin = this.authService.instance.getAllAccounts()[0];
    this.viewState = {
      data: [],
      height: "",
      comments: [],
      comment: "",
      showViewHistory: false,
      errorComment: false,
      showLanguagePopup: false,
      selectedLanguage: "",
      errorLanguage: false,
      userEmail: currentLogin.username
    };
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => this.setCellsToShow());
    this.state = this.parent.state;
    this.setCellsToShow()
    this.getViewFormDetails();
  }

  setCellsToShow() {
    let width = window.innerWidth;
    this.cellsToShow = (width - (width % 320)) / 320;
  }
  showViewHistory() {
    this.viewState.showViewHistory = true;
  }
  hideViewHistory() { this.viewState.showViewHistory = false; }

  closeViewForm() {
    $(".filter-buttons").css("display", "block");
    this.state.viewDataId = null;
    this.state.openViewForm = false;
    this.state.propsData = "";
    this.viewState = {
      data: [],
      height: "",
      comments: [],
      showViewHistory: false
    };
  }
  public getViewFormDetails() {
    try {
      let url = Constants.getViewFormDetails;
      var body = {
        ReqId: this.state.viewDataId,
      };

      this.apiservice
        .postMethodAxios(url, body)
        .then((response: any) => {
          if (
            response &&
            response.data &&
            response.data.table &&
            response.data.table.length > 0
          ) {
            let resArr = response.data.table[0];
            let feet;
            let inches;
            let height = "";
            if (resArr.applicantHeight) {
              inches = resArr.applicantHeight % 12;
              feet = (resArr.applicantHeight - inches) / 12;
              height = feet + " ft " + inches + " in";
            }
            if (resArr.comments) {
              let commentsArr = JSON.parse(resArr.comments);
              let commentsResultArr: any[] = [];
              if (commentsArr.length > 0) {
                for (let i = 0; i < commentsArr.length; i++) {
                  commentsResultArr.push(JSON.parse(commentsArr[i]));
                }
                this.viewState.comments = commentsResultArr;
              }
            }
            let applicantNameString:any = resArr.applicantFirstName + " ";
            if (resArr.applicantMiddleName) {
              applicantNameString += resArr.applicantMiddleName + " ";
            }
            applicantNameString += resArr.applicantLastName;
            this.viewState.data = resArr;
            this.viewState.height = height;
            this.viewState.data.applicantFullName=applicantNameString;
            this.viewState.data.applicantDOB = !this.viewState.data.applicantDOB ? "-" : moment(this.viewState.data.applicantDOB).format("MM/DD/YYYY");
            this.viewState.data.oldCertificateExpiryDate = !this.viewState.data.oldCertificateExpiryDate ? "-" : moment(this.viewState.data.oldCertificateExpiryDate).format("MM/DD/YYYY");
            this.viewState.data.startDateOfEmployment = !this.viewState.data.startDateOfEmployment ? "-" : moment(this.viewState.data.startDateOfEmployment).format("MM/DD/YYYY");
            for (let i = 0; i < this.viewState.comments.length; i++) {
              this.viewState.comments[i].CommentedOn = moment(this.viewState.comments[i].CommentedOn).format("MM/DD/YYYY");
            }
          }
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "view-profile.component.ts - getViewFormDetails - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "view-profile.component.ts - getViewFormDetails - outer catch", err, new Error().stack);

    }
  }
  public getExtension(link: any) {
    try {
      let linkArr = link.split(".");
      let extension = linkArr[linkArr.length - 1];
      return extension;
    } catch (err) {
      this.commonServObj.logErrors(null, "view-profile.component.ts - getExtension", err, new Error().stack);

    }
  }

  public rejectObjectReason(type: any) {
    try {
      let url = Constants.upadateRequestsComment;
      var commentJSON = {
        "ApprovalType": type == "Reject" ? "Rejected" : "Objected",
        "Comment": this.viewState.comment,
        "CommentedBy": this.viewState.userEmail,
        "CommentedOn": moment(new Date()).format('MM/DD/YYYY HH:mm:ss'),
      }
      var body = {
        "ReqId": this.viewState.data.reqId,
        "status": type == "Reject" ? "Rejected" : "Objected",
        "Comment": JSON.stringify(commentJSON),
        "CommentedBy": this.viewState.userEmail,
        "ApplicationType": this.viewState.data.applicationType,
        "LanguageCode": "EN"
      }
      if (this.viewState.comment && this.viewState.comment.trim().length > 0) {
        this.viewState.errorComment = false;
        this.apiservice.postMethodAxios(url, body).then((response: any) => {
          Swal.fire({
            title: "Success!",
            text: "Your action was recorded successfully!",
            icon: "success",
          });
          this.parent.refreshFilter();
          this.parent.refresh();
          this.RejectionObjectionEmail(type);
          this.closeViewForm();
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(body.ReqId, "view-profile.component.ts - rejectReason - inner catch", err, new Error().stack);
        })
      }
      else {
        this.viewState.errorComment = true;
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "view-profile.component.ts -  - RejectReason outer catch", error, new Error().stack);
    }
  }

  public RejectionObjectionEmail(type: any) {
    try {

      let url = Constants.SendMail;
      var body = {
        "UserEmailId": [this.viewState.data.loginUserEmailId],
        "EmailEventName": type == "Reject" ? "RequestRejectedEmail" : "RequestObjectedEmail",
        "ExamHallTicketLink": " ",
        "UserFisrtName": this.viewState.data.applicantFirstName,
        "RequestId": this.viewState.data.reqId,
        "UserMiddleName": this.viewState.data.applicantMiddleName,
        "UserLastName": this.viewState.data.applicantLastName,
        "CertificateType": this.viewState.data.certificateType,
        "PaymentStatus": "PAID",
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
      }).catch((err) => {
        this.commonServObj.logErrors(null, "view-profile.component.ts - rejectReason - inner catch", err, new Error().stack);

        console.log(err)
      })

    } catch (error) {
      this.commonServObj.logErrors(null, "view-profile.component.ts - rejectReason - inner catch", error, new Error().stack);
    }
  }

  onApprove() {
    if (this.viewState.comment && this.viewState.comment.trim().length > 0) {
      if (this.viewState.data.applicationType == "Initial" && this.viewState.data.certificateType == "Handler" && this.viewState.data.examStatus!=='Passed') {
        this.viewState.errorComment = false;
        this.viewState.showLanguagePopup = true;
      } else {
        this.acceptanceReason()
      }
    } else {
      this.viewState.errorComment = true;
    }

  }
  public languageSubmit() {
    if (this.viewState.selectedLanguage) {
      this.acceptanceReason()
    } else {
      this.viewState.errorLanguage = true;
    }
  }
  public async acceptanceReason() {
    try {
      if (this.viewState.comment && this.viewState.comment.trim().length > 0) {
        this.viewState.errorComment = false;
        this.viewState.errorLanguage = false;
        let url = Constants.upadateRequestsComment;
        var commentJSON = {
          "ApprovalType": "Approved",
          "Comment": this.viewState.comment,
          "CommentedBy": this.viewState.userEmail,
          "CommentedOn": moment(new Date()).format('MM/DD/YYYY HH:mm:ss')
        }
        var body = {
          "ReqId": this.viewState.data.reqId,
          "status": "Approved",
          "Comment": JSON.stringify(commentJSON),
          "CommentedBy": this.viewState.userEmail,
          "ApplicationType": this.viewState.data.applicationType,
          "LanguageCode": this.viewState.data.applicationType == "Initial" && this.viewState.data.certificateType == "Handler" ?this.viewState.data.examStatus!=='Passed'? this.viewState.selectedLanguage:this.viewState.data.language : "EN"
        }
        this.apiservice.postMethodAxios(url, body).then((response: any) => {
          Swal.fire({
            title: "Success!",
            text: "Approved succesfully!",
            icon: "success",
          });
          this.ApprovedEmail();
          this.parent.refreshFilter();
          this.parent.refresh();
          this.closeViewForm();
        }).catch((err) => {
          this.commonServObj.logErrors(body.ReqId, "view-profile.component.ts - accepatencereason - inner catch", err, new Error().stack);
        })
      } else {
        this.viewState.errorComment = true;
      }

    } catch (error) {
      this.commonServObj.logErrors(null, "view-profile.component.ts - accepatencereason - outer catch", error, new Error().stack);
    }
  }

  public ApprovedEmail() {
    try {

      let url = Constants.SendMail;

      var body = {
        "UserEmailId": [this.viewState.data.loginUserEmailId],
        "EmailEventName": this.viewState.data.applicationType=="Initial" && this.viewState.data.examStatus!=="Passed"? "RequestApprovedEmail":"RequestApprovedEmailNoAction",
        "ExamHallTicketLink": " ",
        "UserFisrtName": this.viewState.data.applicantFirstName,
        "RequestId": this.viewState.data.reqId,
        "UserMiddleName": this.viewState.data.applicantMiddleName,
        "UserLastName": this.viewState.data.applicantLastName,
        "CertificateType": this.viewState.data.certificateType,
        "PaymentStatus": "PAID",
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
      }).catch((err) => {
        this.commonServObj.logErrors(null, "view-profile.component.ts - ApproveEmail - inner catch", err, new Error().stack);
        console.log(err)
      })

    } catch (error) {
      this.commonServObj.logErrors(null, "view-profile.component.ts - ApproveEmail - inner catch", error, new Error().stack);
    }
  }


  printThisPage() {
    window.print();
  }
}
