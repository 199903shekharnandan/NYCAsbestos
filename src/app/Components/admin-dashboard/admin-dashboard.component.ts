import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Constants';
import * as moment from 'moment-timezone';
import { ApiService } from 'src/app/Api/api.service';
import { MsalService } from '@azure/msal-angular';
import CommonService  from 'src/app/Api/CommonService';
import Swal from 'sweetalert2';

var new_date = new Date(new Date().setMonth(new Date().getMonth() - 2))
var dataAdminView:any[]=[];


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  Constants:any = Constants;
  state:any;
  isAdmin:boolean = false;
  user:any = {
    userName: Constants.userName,
    userEmail: Constants.userEmail,
    userRole: Constants.UserRole
  }
  searchParameters = [
    { value: "name", label: "Applicant Name" },
    { value: "certificatenumber", label: "Certificate Number" },
    { value: "dob", label: "Date of Birth" },
    { value: "examdate", label: "Exam Scheduled Date" },
    { value: "dmvnumber", label: "DMV Number" },
    { value: "issueddate", label: "Issued Date" },
    { value: "reqId", label: "Req ID" },
    { value: "language", label: "Language" },
  ]
  public Languages = [
    { value: "EN", label: "English" },
    { value: "KO", label: "Korean" },
    { value: "PL", label: "Polish" },
    { value: "RU", label: "Russian" },
    { value: "SH", label: "Serbo-Croatian" },
    { value: "ES", label: "Spanish" },
  ];
  dataObj:any[] = [];
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  constructor(private apiservice:ApiService, private authService: MsalService) {
    this.state = {
      userRole:"",
      requests: [],
      temprequests: [],
      openViewForm: false,
      openDMVStatusMessages: false,
      viewDataId: -1,
      Results: [],
      status: "",
      isLoading: true,
      StartDate: "",
      EndDate: "",
      modifiedStartDate: "",
      modifiedEndDate: "",
      ApplicationData: [],
      CertificateData: [],
      ExamStatusData: [],
      ApplicationStatusData: [],
      applicationStartDate: moment(new_date).format("YYYY-MM-DD"),
      applicationEndDate: moment(new Date()).format("YYYY-MM-DD"),
      showLable: false,
      applicationType: "",
      DMVStatusMessages: [],
      DMVStatusOptions: [],
      selectedDMVStatus: [],
      selectedOCSEStatus: [],
      ocseStatus: "",
      openFreeSearch: false,
      selectedSearchParameter: this.searchParameters[0].value,
      searchValue: "",
      searchDate: null,
      errorSearchDate: false,
      IsDefaultSearch: false,
      errorAppliedDate: false,
      errorModifiedEndDate: false,
      errorModifiedStartDate: false,
      showMessageForIssuanceDate: false,
      propsData:"",
      isDateOrOtherField:false
    }

  }
  ngOnInit(): void {
    this.state.isLoading= true;
    if(Constants.UserRole == "Admin"){
      this.state.userRole = Constants.UserRole;
      this.isAdmin = true;
      this.getCumulativeTotal();
      this.getDataForAdminDashboard();
      this.getDataForDMVMessages();
    }
    else{this.isAdmin = false; this.state.isLoading = true;}

  }

  public getCumulativeTotal() {
    try {
      let url = Constants.getCumulativeTotal;
      let body = {
          "StartDate": "",
          "EndDate": ""
        }

      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          let resArr = response.data.table[0];
          this.state.Results= resArr;
        }
      }).catch((err) => {
        this.commonServObj.logErrors(null, "admin-dashboard.component.ts - getCumulativeTotal - inner catch", err, new Error().stack);
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "admin-dashboard.component.ts - getCumulativeTotal - outer catch", error, new Error().stack);
    }
  }

  public getDataForAdminDashboard() {
    try {
      this.state.isLoading= true;
      let url = Constants.getDataForAdminDashboard;
      let requests: any[] = [];
      var body = {
        "StartDate": moment.tz((this.state.applicationStartDate+" 00:00:00"),Constants.TimeZone).utc(false).format("YYYY-MM-DD hh:mm:ss")+".000",
        "EndDate": moment.tz((this.state.applicationEndDate+" 23:59:59"),Constants.TimeZone).utc(false).format("YYYY-MM-DD hh:mm:ss")+".999"
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.length > 0) {
          let resArr = response.data;
          for (let i = 0; i < resArr.length; i++) {
            let dataObj;
            const element = resArr[i];
            let sNo = i + 1;
            let applicantNameString:any = element.applicantFirstName + " ";
            if (element.applicantMiddleName) {
              applicantNameString += element.applicantMiddleName + " ";
            }
            applicantNameString += element.applicantLastName;
            let ApplicantName:any = element.applicantFirstName + " ";
            if (element.applicantMiddleName) {
              ApplicantName += element.applicantMiddleName + " ";
            }
            ApplicantName += element.applicantLastName;
            ApplicantName = "<span title='ApplicantName'>" + ApplicantName + "</span>";
            let applicationType = element.applicationType;
            let certificateNumber = element.certificateNumber ? element.certificateNumber : "N/A";
            let expiryDate = element.expiryDate ? moment.utc(element.expiryDate, 'YYYYMMDD HH:mm:ss.fff').clone().tz(Constants.TimeZone).format("MM/DD/YYYY") : "N/A"
            let DOB = element.applicantDOB ? moment(element.applicantDOB).format("MM/DD/YYYY") : "";
            let dmvnumber = element.applicantDMVNumber;
            let statusValue = element.status;
            let receiptNumber = element.paymentResponseXML;
            let issuedDate = element.issuedDate ? moment.utc(element.issuedDate, 'YYYYMMDD HH:mm:ss.fff').clone().tz(Constants.TimeZone).format("MM/DD/YYYY") : "N/A";
            let status = element.status == "Pending" ? "<div class='status-pending'><span>"+ element.status + "</span></div>"
              : element.status == "Approved" ? "<div class='status-approved'> <span>" + element.status + "</span></div>"
                : element.status == "Rejected" ? "<div class='status-rejected'><span>" + element.status + "</span></div>"
                  : element.status == "Suspended" ? "<div class='status-rejected'><span>" + element.status + "</span></div>"
                    : element.status == "Draft" ? "<div class='status-draft'><span>" + element.status + "</span></div>"
                      : element.status == "Discarded" ? "<div class='status-discarded'><span>" + element.status + "</span></div>"
                      : element.status == "Objected" ? "<div class='status-discarded'><span>" + element.status + "</span></div>"
                      : element.status;
            let showstatus = element.status == "Pending" ? element.status
              : element.status == "Approved" ? element.status
                : element.status == "Rejected" ? element.status
                  : element.status == "Suspended" ? element.status
                    : element.status == "Draft" ? element.status
                      : element.status == "Discarded" ? element.status
                        : element.status;
            let examStatus = element.examStatus == "Scheduled" ? "<div class='status-pending'><span>"+element.examStatus+"</span></div>"
              : element.examStatus == "Rescheduled" ? '<div class="status-discarded"><span>' + element.examStatus + '</span></div>'
                : element.examStatus == "Failed" ? '<div class="status-rejected"><span>' + element.examStatus + '</span></div>'
                  : element.examStatus == "Passed" ? '<div class="status-approved"><span>' + element.examStatus + '</span></div>'
                    : element.examStatus == "Suspended" ? '<div class="status-rejected"><span>' + element.examStatus + '</span></div>'
                      : element.examStatus == "Incompleted" ? '<div class="status-pending"><span>' + element.examStatus + '</span></div>'
                        : applicationType != "Initial" ? '<div class="status-pending"><span>N/A</span></div>'
                          : statusValue == "Draft" ? "-"
                            : statusValue == "Discarded" ? "-"
                              : element.examStatus;
            let showExamStatus = element.examStatus ? element.examStatus == "Scheduled" ? element.examStatus
              : element.examStatus == "Rescheduled" ? element.examStatus
                : element.examStatus == "Failed" ? element.examStatus
                  : element.examStatus == "Passed" ? element.examStatus
                    : element.examStatus == "Suspended" ? element.examStatus
                      : element.examStatus == "Incompleted" ? element.examStatus
                        : applicationType != "Initial" ? "N/A"
                          : statusValue == "Draft" ? "N/A"
                            : statusValue == "Discarded" ? "N/A"
                              : element.examStatus : "N/A";
            let showDMVStatus = element.dmvApprovalStatus ? element.dmvApprovalStatus : "N/A";
            let showOCSEStatus = element.ocseStatus ? element.ocseStatus : "N/A";
            let certificationType = element.certificateType;
            let id = element.reqId;
            let dmvApproval = element.dmvApprovalStatus ?
              element.dmvApprovalStatus == "P" ? '<div class="status-approved"><span>'+element.dmvApprovalStatus+'</span></div>' :
                element.dmvApprovalStatus.includes("E") ? '<div class="status-rejected"><span>'+element.dmvApprovalStatus+ '</span></div>'
                : '<div class="status-pending"><span>'+element.dmvApprovalStatus +'</span></div>' : "";
            let ocseApproval = element.ocseStatus ?
              applicationType == "Duplicate" ? '<div class="status-pending"><span>N/A</span></div>' :
                element.ocseStatus == "Approved" ? '<div class="status-approved"><span>' + element.ocseStatus + '</span></div>' :
                  element.ocseStatus == "Rejected" ? '<div class="status-rejected"><span>'+element.ocseStatus+'</span></div>' :
                    element.ocseStatus == "Pending" ? '<div class="status-pending"><span>'+element.ocseStatus+'</span></div>'
                      : applicationType == "Duplicate" ? '<div class="status-pending"><span>N/A</span></div>' : ""
                      : applicationType == "Duplicate" ? '<div class="status-pending"><span>N/A</span></div>' : "";
            let caseId = element.ocseCaseId ? '<div class="status-rejected"><span>'+element.ocseCaseId+'</span></div>' : "";
            //let submittedOn = element.submittedOn ? moment.utc(element.submittedOn).local().format("MM/DD/YYYY") : "";
            let submittedOn = element.submittedOn ? moment.utc(element.submittedOn, 'YYYYMMDD HH:mm:ss.fff').clone().tz(Constants.TimeZone).format("MM/DD/YYYY"): "";
            dataObj = {
              SNo: sNo,
              ApplicantName: ApplicantName,
              ApplicationType: applicationType,
              CertificateNumber: certificateNumber,
              ExpiryDate: expiryDate,
              DMVNumber: dmvnumber,
              CertificationType: certificationType,
              IssuedDate: issuedDate,
              ExamStatus: examStatus,
              Date_of_Birth: DOB,
              ReceiptNumber: receiptNumber,
              Status: status,
              status:showstatus,
              StatusString: showstatus,
              ExamStatusString: showExamStatus,
              DMVStatusString: showDMVStatus,
              ApplicantNameString: applicantNameString,
              Id: id,
              DMVApprovalStatus: dmvApproval,
              OCSEApprovalStatus: ocseApproval,
              OcseApproval:ocseApproval,
              OCSEStatusString: showOCSEStatus,
              OCSECaseId: caseId,
              SubmittedOn: submittedOn,
              ApplicantFirstName: element.applicantFirstName,
              ApplicantMiddleName: element.applicantMiddleName,
              ApplicantLastName: element.applicantLastName
            };
            requests.push(dataObj);
          }
        }
        this.state.isLoading=false;
        this.state.requests=requests;
        this.state.temprequests= requests;

      }).catch((err) => {
        this.commonServObj.logErrors(null, "admin-dashboard.component - getDataForAdminDashboard - inner catch", err, new Error().stack);
        window.location.reload();
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "admin-dashboard.component - getDataForAdminDashboard - outer catch", error, new Error().stack);
      window.location.reload();
    }
  }

  public getSearchData() {
    try {

      //let url;
      this.state.isLoading=true;

      let url = Constants.GetDataForAdminBoardWithSeachKeyword;
      let requests: any[] = [];
      let body;
      let invalidDate:boolean = false;
      if (this.state.searchValue) {
        body = {
          "columnName": this.state.selectedSearchParameter,
          "value": this.state.searchValue
        }
        this.state.searchDate=null;
      } else if (this.state.searchDate){
        if(this.state.selectedSearchParameter!= 'examdate' && this.state.searchDate > moment(new Date()).format('YYYY-MM-DD')){
          invalidDate=true;
          Swal.fire({
            title: "Error!",
            text: "You can not search for future records.",
            icon: "error"
          })
        }
        body = {
          "columnName": this.state.selectedSearchParameter,
          "date": moment(this.state.searchDate).format("MM/DD/YYYY")
        }
        this.state.searchValue=""
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.length > 0) {
          let resArr = response.data;
          for (let i = 0; i < resArr.length; i++) {
            let dataObj;
            const element = resArr[i];
            let sNo = i + 1;
            let applicantNameString: any = element.applicantFirstName + " ";
            if (element.applicantMiddleName) {
              applicantNameString += element.applicantMiddleName + " ";
            }
            applicantNameString += element.applicantLastName;
            let ApplicantName: any = element.applicantFirstName + " ";
            if (element.applicantMiddleName) {
              ApplicantName += element.applicantMiddleName + " ";
            }
            ApplicantName += element.applicantLastName;
            ApplicantName = "<span title='ApplicantName'>" + ApplicantName + "</span>";
            let applicationType = element.applicationType;
            let certificateNumber = element.certificateNumber ? element.certificateNumber : "N/A";
            let expiryDate = element.expiryDate ? moment(element.expiryDate).format("MM/DD/YYYY") : "N/A"
            let DOB = element.applicantDOB ? moment(element.applicantDOB).format("MM/DD/YYYY") : "";
            let dmvnumber = element.applicantDMVNumber;
            let statusValue = element.status;
            let issuedDate = element.issuedDate ? moment(element.issuedDate).format("MM/DD/YYYY") : "N/A";
            let status = element.status == "Pending" ? "<div class='status-pending'><span>"+ element.status + "</span></div>"
              : element.status == "Approved" ? "<div class='status-approved'> <span>" + element.status + "</span></div>"
                : element.status == "Rejected" ? "<div class='status-rejected'><span>" + element.status + "</span></div>"
                  : element.status == "Suspended" ? "<div class='status-rejected'><span>" + element.status + "</span></div>"
                    : element.status == "Draft" ? "<div class='status-draft'><span>" + element.status + "</span></div>"
                      : element.status == "Discarded" ? "<div class='status-discarded'><span>" + element.status + "</span></div>"
                      : element.status == "Objected" ? "<div class='status-discarded'><span>" + element.status + "</span></div>"
                      : element.status;
            let showstatus = element.status == "Pending" ? element.status
              : element.status == "Approved" ? element.status
                : element.status == "Rejected" ? element.status
                  : element.status == "Suspended" ? element.status
                    : element.status == "Draft" ? element.status
                      : element.status == "Discarded" ? element.status
                        : element.status;
            let examStatus = element.examStatus == "Scheduled" ? "<div class='status-pending'><span>"+element.examStatus+"</span></div>"
              : element.examStatus == "Rescheduled" ? '<div class="status-discarded"><span>' + element.examStatus + '</span></div>'
                : element.examStatus == "Failed" ? '<div class="status-pending"><span>' + element.examStatus + '</span></div>'
                  : element.examStatus == "Passed" ? '<div class="status-approved"><span>' + element.examStatus + '</span></div>'
                    : element.examStatus == "Suspended" ? '<div class="status-rejected"><span>' + element.examStatus + '</span></div>'
                      : element.examStatus == "Incompleted" ? '<div class="status-pending"><span>' + element.examStatus + '</span></div>'
                        : applicationType != "Initial" ? '<div class="status-pending"><span>N/A</span></div>'
                          : statusValue == "Draft" ? "-"
                            : statusValue == "Discarded" ? "-"
                              : element.examStatus;
            let showExamStatus = element.examStatus ? element.examStatus == "Scheduled" ? element.examStatus
              : element.examStatus == "Rescheduled" ? element.examStatus
                : element.examStatus == "Failed" ? element.examStatus
                  : element.examStatus == "Passed" ? element.examStatus
                    : element.examStatus == "Suspended" ? element.examStatus
                      : element.examStatus == "Incompleted" ? element.examStatus
                        : applicationType != "Initial" ? "N/A"
                          : statusValue == "Draft" ? "N/A"
                            : statusValue == "Discarded" ? "N/A"
                              : element.examStatus : "N/A";
            let showDMVStatus = element.dmvApprovalStatus ? element.dmvApprovalStatus : "N/A";
            let showOCSEStatus = element.ocseStatus ? element.ocseStatus : "N/A";
            let certificationType = element.certificateType;
            let id = element.reqId;
            let receiptNumber = element.paymentResponseXML;
            let dmvApproval = element.dmvApprovalStatus ?
              element.dmvApprovalStatus == "P" ? '<div class="status-approved"><span>'+element.dmvApprovalStatus+'</span></div>' :
                element.dmvApprovalStatus.includes("E") ? '<div class="status-rejected"><span>'+element.dmvApprovalStatus+ '</span></div>'
                : '<div class="status-pending"><span>'+element.dmvApprovalStatus +'</span></div>' : "";
                let ocseApproval = element.ocseStatus ?
                applicationType == "Duplicate" ? '<div class="status-pending"><span>N/A</span></div>' :
                  element.ocseStatus == "Approved" ? '<div class="status-approved"><span>' + element.ocseStatus + '</span></div>' :
                    element.ocseStatus == "Rejected" ? '<div class="status-rejected"><span>'+element.ocseStatus+'</span></div>' :
                      element.ocseStatus == "Pending" ? '<div class="status-pending"><span>'+element.ocseStatus+'</span></div>'
                        : applicationType == "Duplicate" ? '<div class="status-pending"><span>N/A</span></div>' : ""
                        : applicationType == "Duplicate" ? '<div class="status-pending"><span>N/A</span></div>' : "";
                        let caseId = element.ocseCaseId ? '<div class="status-rejected"><span>'+element.ocseCaseId+'</span></div>' : "";
            let submittedOn = element.submittedOn ? moment.utc(element.submittedOn, 'YYYYMMDD HH:mm:ss.fff').clone().tz(Constants.TimeZone).format("MM/DD/YYYY") : "";
            dataObj = {
              SNo: sNo,
              ApplicantName: ApplicantName,
              ApplicationType: applicationType,
              CertificateNumber: certificateNumber,
              ExpiryDate:expiryDate,
              DMVNumber: dmvnumber,
              CertificationType: certificationType,
              IssuedDate: issuedDate,
              ExamStatus: examStatus,
              Date_of_Birth: DOB,
              ReceiptNumber: receiptNumber,
              Status: status,
              status:showstatus,
              StatusString: showstatus,
              ExamStatusString: showExamStatus,
              DMVStatusString: showDMVStatus,
              ApplicantNameString: applicantNameString,
              Id: id,
              DMVApprovalStatus: dmvApproval,
              OCSEApprovalStatus: ocseApproval,
              OcseApproval:ocseApproval,
              OCSEStatusString: showOCSEStatus,
              OCSECaseId: caseId,
              SubmittedOn: submittedOn,
              ApplicantFirstName: element.applicantFirstName,
              ApplicantMiddleName: element.applicantMiddleName,
              ApplicantLastName: element.applicantLastName
            };
            requests.push(dataObj);
          }
        }
        if(!invalidDate){
          this.state.requests=requests;
          this.state.temprequests= requests;
        }
        this.state.isLoading=false;
      }).catch((err) => {
        this.state.isLoading= false;
        this.commonServObj.logErrors(null, "admin-dashboard.component.ts - getSearchData - inner catch", err, new Error().stack);
      })
    } catch (error) {
      this.state.isLoading= false;
      this.commonServObj.logErrors(null, "admin-dashboard.component.ts - getSearchData - outer catch", error, new Error().stack);
    }
  }

  public getDataForDMVMessages() {
    try {
      let url = Constants.GetDMVStatusMessage;
      let messages: any[] = [];
      let dropdownData: any[] = [];
      var body = {
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          let resArr = response.data.table;
          for (let i = 0; i < resArr.length; i++) {
            let dataObj;
            dataObj = {
              StatusCode: resArr[i].statusCode,
              Message: resArr[i].description
            }
            messages.push(dataObj);
            dropdownData.push({ value: resArr[i].statusCode, label: resArr[i].statusCode });
          }
          dropdownData.push({ value: 'Pending', label: 'Pending' });
          this.state.DMVStatusMessages = messages;
          this.state.DMVStatusOptions= dropdownData;
        }
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "admin-dashboard.component.ts - getDataForDMVMessages - outer catch", error, new Error().stack);
    }
  }

  openViewForm(element:any) {
    $(".filter-buttons").css("display","none");
    dataAdminView.push({"applicantFirstName":element.ApplicantFirstName,
      "applicantMiddleName":element.ApplicantMiddleName,
      "applicantLastName":element.ApplicantLastName,
      "applicationType":element.ApplicationType,
      "status":element.status,
      "reqId":element.Id,
      "certificateType":element.CertificationType,
      "loginUserEmailId":this.user.userEmail
    });
    this.state.viewDataId= element.Id;
    this.state.openViewForm= true;
    this.state.status= element.status;
    this.state.applicationType= element.ApplicationType;
    this.state.ocseStatus= element.OCSEApprovalStatus=='<div class="status-approved"><span>Approved</span></div>'?'Approved'
    :
    element.OCSEApprovalStatus== '<div class="status-rejected"><span>Rejected</span></div>'? 'Rejected'
    :
    element.OCSEApprovalStatus== '<div class="status-pending"><span>Pending</span></div>'?'Pending':"";
    this.state.propsData= dataAdminView[0];
    dataAdminView=[];
  }

  getOCSEApproval(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to get OCSE approval status",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, run it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runJob(Constants.OCSE);
      }
    }).catch((ex) => { console.log(ex) })
  }
  getExamStatus(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to get Exam status",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, run it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runJob(Constants.Exam);
      }
    }).catch((ex) => { console.log(ex) })
  }
  getRes(values: any) {
    localStorage.setItem("ApplicantReqId", values.Id.toString());
    window.open('/getResult');
  }
  public runJob(field:any) {
    try {
      let url;
      if(field==Constants.Exam){
        url = Constants.TriggerExamWebJob;

      }else{
        url = Constants.TriggerOCSEWebJob;
      }
      this.apiservice.getMethodAxios(url).then((response: any) => {
        Swal.fire({
          title: "Success!",
          text: "Schedular has run successfully!",
          icon: "success"
        }).then(() => {
          this.refreshFilter();
          this.refresh();
        })
      }).catch((ex) => {
        this.commonServObj.logErrors(null, "admin-dashboard.component.ts - runJob - inner catch", ex, new Error().stack);

      })
    } catch (ex) {
      this.commonServObj.logErrors(null, "admin-dashboard.component.ts - runJob - outer catch", ex, new Error().stack);

    }
  }
  // functions for DMV description toggle
  showDescription(){this.state.openDMVStatusMessages = true;}hideDescription(){this.state.openDMVStatusMessages = false;}
  public filterApplication = (requests: any) => {
    let ApplStatus: any[] = []
    if (this.state.ApplicationData) {
      requests.map((item: any) => {
        if (this.state.ApplicationData && this.state.ApplicationData.length > 0) {
          for (let i = 0; i < this.state.ApplicationData.length; i++) {
            if (item.ApplicationType == this.state.ApplicationData[i]) {
              ApplStatus?.push(item)
            }
            else {

            }
          }
        }
      });
    }
    return ApplStatus;
  }
  public filterCertificate = (requests: any) => {
    let CertStatus: any[] = []
    requests.map((item: any) => {
      if (this.state.CertificateData && this.state.CertificateData.length > 0) {
        for (let i = 0; i < this.state.CertificateData.length; i++) {
          if (item.CertificationType == this.state.CertificateData[i]) {
            CertStatus.push(item)
          }
        }
      }
    });
    return CertStatus;
  }
  public filterExamStatus = (requests: any) => {
    let ExamStatus: any[] = []
    if (this.state.ExamStatusData) {
      requests.map((item: any) => {
        for (let i = 0; i < this.state.ExamStatusData.length; i++) {
          if (item.ExamStatusString == this.state.ExamStatusData[i]) {
            ExamStatus?.push(item)
          }
        }
      });
    }
    return ExamStatus;
  }
  public filterDMVStatus = (requests: any) => {
    let DMVStatus: any[] = [];
    requests.map((item: any) => {
      if (this.state.selectedDMVStatus && this.state.selectedDMVStatus.length > 0) {
        for (let i = 0; i < this.state.selectedDMVStatus.length; i++) {
          if (item.DMVStatusString == this.state.selectedDMVStatus[i]) {
            DMVStatus?.push(item)
          }
          this.state.requests=DMVStatus
        }
      }
    });
    return DMVStatus;
  }
  public filterOCSEStatus = (requests: any) => {
    let OCSEStatus: any[] = [];
    requests.map((item: any) => {
      if (this.state.selectedOCSEStatus && this.state.selectedOCSEStatus.length > 0) {
        for (let i = 0; i < this.state.selectedOCSEStatus.length; i++) {
          if (item.OCSEStatusString == this.state.selectedOCSEStatus[i]) {
            OCSEStatus?.push(item)
          }
          this.state.requests= OCSEStatus;
        }
      }
    });
    return OCSEStatus;
  }
  public filterApplicationStatus = (requests: any) => {
    let ApplicationStatus: any[] = []
    requests.map((item: any) => {
      if (this.state.ApplicationStatusData && this.state.ApplicationStatusData.length > 0) {
        for (let i = 0; i < this.state.ApplicationStatusData.length; i++) {
          if (item.StatusString == this.state.ApplicationStatusData[i]) {
            ApplicationStatus?.push(item)
          }
          this.state.requests= ApplicationStatus;
        }
      }
    });
    return ApplicationStatus;
  }
  public myData = (requests: any) => {  /* function to determine the data to be rendered to the table */
    let myArr: any[] = [];
    if (this.state.modifiedStartDate && this.state.modifiedEndDate) {
      requests.map((item: any) => {
        if (item.IssuedDate != "N/A") {
          if (new Date(item.IssuedDate).toISOString().slice(0, 10) >= new Date(this.state.modifiedStartDate).toISOString().slice(0, 10) && new Date(item.IssuedDate).toISOString().slice(0, 10) <= new Date(this.state.modifiedEndDate).toISOString().slice(0, 10))
            myArr?.push(item)
        }
      });
    }
    return myArr;
  };
  public filterData = () => {
    let filterData: any[] = []
    filterData = this.state.temprequests;
    if (this.state.ApplicationData && this.state.ApplicationData.length > 0) {
      filterData = this.filterApplication(filterData);
    }
    if (this.state.CertificateData && this.state.CertificateData.length > 0) {
      filterData = this.filterCertificate(filterData);
    }
    if (this.state.ExamStatusData && this.state.ExamStatusData.length > 0) {
      filterData = this.filterExamStatus(filterData);
    }
    if (this.state.ApplicationStatusData && this.state.ApplicationStatusData.length > 0) {
      filterData = this.filterApplicationStatus(filterData);
    }
    if (this.state.selectedDMVStatus && this.state.selectedDMVStatus.length > 0) {
      filterData = this.filterDMVStatus(filterData);
    }
    if (this.state.selectedOCSEStatus && this.state.selectedOCSEStatus.length > 0) {
      filterData = this.filterOCSEStatus(filterData);
    }
    if (this.state.modifiedStartDate && this.state.modifiedEndDate) {
      filterData = this.myData(filterData);
    }
    this.state.requests= filterData;
  }
  refresh(){
    this.state.applicationStartDate= moment(new_date).format("YYYY-MM-DD");
    this.state.applicationEndDate= moment(new Date()).format("YYYY-MM-DD");
    this.getDataForAdminDashboard();
  }
  refreshFilter(){
    this.state.isDateOrOtherField=false;
    this.state.searchValue="";
    this.state.searchDate=null;
    this.state.selectedSearchParameter= this.searchParameters[0].value;
  }
}
