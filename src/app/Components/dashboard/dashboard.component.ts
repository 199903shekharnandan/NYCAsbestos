import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ApiService } from 'src/app/Api/api.service';
import { Constants } from 'src/app/Constants/Constants';
import { Idashboard } from 'src/app/Models/dashboard';
import Swal from 'sweetalert2';
import CommonService from 'src/app/Api/CommonService';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { Buffer } from 'buffer';

var dataView: any[] = [];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  dataObj: any[] = [];
  formModal: any;
  currentLogin: any;
  userEmail: any;
  dashboardData = {} as Idashboard;
  state: any;
  moment: any;
  isApplicant:boolean= false;
  Constants:any;
  constructor(private apiservice: ApiService, private authService: MsalService, private router: Router) {
    this.state = {
      openViewForm: false,
      openreschedule: false,
      type: "",
      viewDataId: 0,
      status: "",
      applicationType: "",
      ocseStatus: "",
      propsData: ""
    }
    this.moment = moment;
    this.Constants = Constants;

  }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);

  ngOnInit(): void {
    if (!Constants.IsLoggedIn) {
      window.location.reload();
    }else{
      this.commonServObj.checkLoginTime();
    }
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
    this.userEmail = this.currentLogin.username;
    this.GetDashboard();
    this.state.userRole = Constants.UserRole;
    if( Constants.UserRole === "User" || Constants.UserRole === "Supervisor"){
      this.isApplicant=true
    }
    else{
      this.isApplicant=false
    }
  }

  getRes(values: any) {
    localStorage.setItem("ApplicantReqId", values.reqId.toString());
    window.open('/getResult');
  }

  openViewForm(element: any) {
    dataView.push({
      "applicantFirstName": element.applicantFirstName,
      "applicantMiddleName": element.applicantMiddleName,
      "applicantLastName": element.applicantLastName,
      "applicationType": element.applicationType,
      "status": element.status,
      "reqId": element.reqId,
      "certificateType": element.certificationType,
      "loginUserEmailId": this.userEmail
    });
    this.state.viewDataId = element.reqId;
    this.state.openViewForm = true;
    this.state.status = element.status;
    this.state.applicationType = element.applicationType;
    this.state.ocseStatus = element.ocseStatus;
    this.state.propsData = dataView[0];
    dataView = [];
  }
  openEdit(data: any) {
  if(data.applicationType=="Initial"){
    this.router.navigate(['/application'],{queryParams:{'certificateType':data.certificateType,'applicateType':data.applicationType,'id':data.reqId}})
  }
  else if(data.applicationType=="Renewal"){
    this.router.navigate(['/renewalApplication'],{queryParams:{'certificateType':data.certificateType,'applicateType':data.applicationType,'id':data.reqId}})
  }
  else if(data.applicationType=="Duplicate"){
    this.router.navigate(['/duplicateApplication'],{queryParams:{'certificateType':data.certificateType,'applicateType':data.applicationType,'id':data.reqId}})
  }
  }
  getHallTicket(data: any) {
    let encodedId = Buffer.from(`NYC-${data.reqId}-NYC`).toString('base64');
    window.open(`/hallTicket/${encodedId}`, "_blank");
  }

  GetDashboard() {
    this.dataObj = [];
    let url = Constants.getRequestsByEmail;
    var body = {
      "LoginUserEmailId": this.userEmail
    }

    this.apiservice.postMethodAxios(url, body).then((response: any) => {
      if (response['data'].length > 0)
        this.dataObj = response['data'];
    }
    );
  }
  discardDraftClick(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to discard the draft",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.discardDraft(data.reqId);
      }
    }).catch((ex) => { console.log(ex) })
  }
  public discardDraft(id: any) {
    try {
      let url = Constants.DiscardDraftRequest;
      var body = {
        "ReqId": id
      }
      this.apiservice.postMethodAxios(url, body).then((res: any) => {
        if (res && res.status == 200) {
          this.GetDashboard();
          Swal.fire({
            title: "Success!",
            text: "Draft has been discarded successfully!",
            icon: "success",
          }).then(() => {

          }).catch((err) => console.log(err));
        }
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(body.ReqId, "dashboard.component.ts - discardDraft - inner catch", err, new Error().stack);
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "dashboard.component.ts - discardDraft - outer catch", err, new Error().stack);

    }
  }

  scheduleExam(type: String, data: any) {
    if (type == 'Reschedule') {
      if ((data.examStatus == "Scheduled" || data.examStatus == "Incompleted") && data.status == "Approved" && data.ocseStatus == "Approved" && moment(data.examSlotDate).format("MM/DD/YYYY") == moment(new Date()).format("MM/DD/YYYY")) {
        Swal.fire({
          title: "Sorry",
          text: "Your exam is scheduled for today, you can't re-schedule it now. Please try again tomorrow.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          // cancelButtonColor: '#d33',
          confirmButtonText: "Ok",
        }).then(()=>this.state.openreschedule = false) ;
      }
      if((data.examStatus == "Scheduled" || data.examStatus == "Incompleted") && data.status == "Approved" && data.ocseStatus == "Approved"){
        this.state.viewDataId = data.reqId;
        this.state.openreschedule = true;
        this.state.type = type;
        this.state.UserName = data.applicantFirstName + " " + (data.applicantMiddleName != "" ? data.applicantMiddleName + " " : "") + data.applicantLastName;
        this.state.UserDOB = data.applicantDOB;
        this.state.CertificateType = data.certificateType;
      }
      if((data.examStatus == "Failed" && (data.certificateType == "Handler Restricted" || data.certificateType == "Handler" || data.certificateType == "Supervisor") && data.failedCount < 4 && data.ocseStatus == "Approved") || (data.examStatus == "Failed" && (data.certificateType == "Investigator") && data.failedCount < 3 && data.ocseStatus == "Approved")){
        this.state.viewDataId = data.reqId;
        this.state.openreschedule = true;
        this.state.type = type;
        this.state.UserName = data.applicantFirstName + " " + (data.applicantMiddleName != "" ? data.applicantMiddleName + " " : "") + data.applicantLastName;
        this.state.UserDOB = data.applicantDOB;
        this.state.CertificateType = data.certificateType;
      }
      if((data.examStatus == "Failed" && (data.certificateType == "Handler Restricted" || data.certificateType == "Handler" || data.certificateType == "Supervisor") && data.failedCount > 3 && data.ocseStatus == "Approved") || (data.examStatus == "Failed" && (data.certificateType == "Investigator") && data.failedCount > 2 && data.ocseStatus == "Approved")){
        Swal.fire({
          title: 'Sorry',
          text: "You have exceeded the exam attempts. Please apply for a new application.",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        })
      }
    }
    else {
      this.state.viewDataId = data.reqId;
      this.state.openreschedule = true;
      this.state.type = type;
      this.state.UserName = data.applicantFirstName + " " + (data.applicantMiddleName != "" ? data.applicantMiddleName + " " : "") + data.applicantLastName;
      this.state.UserDOB = data.applicantDOB;
      this.state.CertificateType = data.certificateType;
    }
  }
  refresh(){
    this.GetDashboard();
  }

}
