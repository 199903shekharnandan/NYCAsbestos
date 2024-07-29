import { Constants } from 'src/app/Constants/Constants';
import { ApiService } from 'src/app/Api/api.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import CommonService from 'src/app/Api/CommonService';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-exam-date-management',
  templateUrl: './exam-date-management.component.html',
  styleUrls: ['./exam-date-management.component.scss']
})
export class ExamDateManagementComponent implements OnInit {
  dateValue: any = new Date();
  ddlQuarter: any = "";
  examDates: any;
  currentDate = new Date();
  quarter: any;
  disableSlotDate: any[] = [];
  isDisabled: boolean = false;
  examDateArry: any[] = [];
  DupExamBlockedData: any[] = [];
  ExamBlockedData: any[] = [];
  Ismodalopen:boolean= false;
   showEmailpopup:boolean= false;
   GettingUserEmail: any[] = [];
   CheckLoggedCount:any[]= [{ count: 0, ExamDate: '', SlotTime: '' }];
   OrigdisableSlotDate:any[]= [{ ExamDate: '', Slot: '', id: '' }];
   ExamBlockedDataCountArray:any[]=[];
  currentLogin: any;
  userEmail?: string;
  formModal: any;
  popdisplay?:string='none';
  isAdmin:boolean=false;
  isLoading:boolean=false;
  loaderText:string="";
  MonthOptions = [{ value: 'Jan-Mar', label: 'Jan-Mar' }, { value: 'Apr-Jun', label: 'Apr-Jun' }, { value: 'July-Sept', label: 'July-Sept' }, { value: 'Oct-Dec', label: 'Oct-Dec' }]
  constructor(private datePipe: DatePipe, private apiservice: ApiService,private authService: MsalService) {

  }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);

  ngOnInit(): void {
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
    this.userEmail = this.currentLogin.username;
    if(Constants.UserRole=="Admin"){ this.isAdmin=true; }
    else{ this.isAdmin=false; }
    this.getCurrentQuarter();
  }


  getExamDates(selectedQuarter: any, selectedYear: any) {
    try {
      this.GetExamDateandDetails();
      this.examDates = []; this.examDateArry = [];
      let year = this.datePipe.transform(selectedYear, 'yyyy');
      if (selectedQuarter === "Jan-Mar") {
        var start = moment(`${year}-01-01`); // Jan. 1st
        var end = moment(`${year}-03-31`); // March. 2nd
        this.examDates = this.generateExamDates(start, end);
      }
      else if (selectedQuarter === "Apr-Jun") {
        start = moment(`${year}-04-01`); // April. 1st
        end = moment(`${year}-06-30`); // Jun. 2nd
        this.examDates = this.generateExamDates(start, end);
      }
      else if (selectedQuarter === "July-Sept") {
        var start = moment(`${year}-07-01`); // July. 1st
        var end = moment(`${year}-09-30`); // Sept. 2nd
        this.examDates = this.generateExamDates(start, end);
      }
      else if (selectedQuarter === "Oct-Dec") {
        start = moment(`${year}-10-01`); // oct. 1st
        end = moment(`${year}-12-31`); // dec. 31nd
        this.examDates = this.generateExamDates(start, end);

      }
    }
    catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - getExamDates - outer catch", err, new Error().stack);
    }
  }
  generateExamDates(start: any, end: any) {
    try {
      var day = 3;  // Wednesday
      var result: any[] = [];
      var current = start.clone();
      while (current.day(7 + day).isSameOrBefore(end)) {
        result.push(current.format('YYYY-MM-DD'))
      }
      return result;
    }
    catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - generateExamDates - outer catch", err, new Error().stack);
    }
  }
  getCurrentQuarter() {
    try {
      this.quarter = Math.floor((this.currentDate.getMonth() + 3) / 3);
      if (this.quarter == 1) {
        this.ddlQuarter = "Jan-Mar";
        this.getExamDates(this.ddlQuarter, this.dateValue);
      }
      else if (this.quarter == 2) {
        this.ddlQuarter = "Apr-Jun";
        this.getExamDates(this.ddlQuarter, this.dateValue);
      }
      else if (this.quarter == 3) {
        this.ddlQuarter = "July-Sept";
        this.getExamDates(this.ddlQuarter, this.dateValue);
      }
      else if (this.quarter == 4) {
        this.ddlQuarter = "Oct-Dec";
        this.getExamDates(this.ddlQuarter, this.dateValue);
      }
    }
    catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - getCurrentQuarter - outer catch", err, new Error().stack);
    }
  }
  handleChangeyear(selectedyear: any) {

    try {
      let year = this.datePipe.transform(selectedyear, 'yyyy');
      this.getExamDates(this.ddlQuarter, year);

    }
    catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - handleChangeyear - outer catch", err, new Error().stack);
    }
  }
  GetExamDateandDetails() {
    try {
      let url = Constants.GetAdminDataManagement;
      let ExamDetails: any[] = [];
      this.apiservice.getMethodAxios(url).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          let resArr = response.data.table;
          for (let i = 0; i < resArr.length; i++) {
            let dataObj;
            const element = resArr[i];
            let sNo = i + 1;
            let ExamDate = element.selectedDate;
            let id = element.id;
            let Slot = element.slot;
            dataObj = {
              SNo: sNo,
              ExamDate: moment(ExamDate).format("YYYY-MM-DD"),
              Slot: Slot,
              id: id
            };
            ExamDetails.push(dataObj);

          }
          this.disableSlotDate = ExamDetails;
          this.OrigdisableSlotDate = ExamDetails;
          this.CheckView(this.disableSlotDate);
        }else{
          this.disableSlotDate = ExamDetails;
          this.OrigdisableSlotDate = ExamDetails;
          this.CheckView(this.disableSlotDate);
        }
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "exam-date-management.component.ts - GetExamDateandDetails - inner catch", err, new Error().stack);
      });
    } catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - GetExamDateandDetails - outer catch", err, new Error().stack);
    }
  }
  disabledDate(){
    return false;
  }
  public CheckView(data: any) {
    try {
      let obj = {};
      this.examDateArry = [];
      var Slot1 = "10am-12pm"; var res1 = true
      var Slot2 = "2pm-4pm"; var res2 = true
      for (let i = 0; i < this.examDates.length; i++) {
        res1 = true; res2 = true;
        for (let j = 0; j < data.length; j++) {
          var date1 = new Date(this.examDates[i]);
          var date2 = new Date(data[j].ExamDate);
          if (date1.getTime() === date2.getTime()) {
            if (Slot1 == data[j].Slot) {
              res1 = false;
            }
            else if (Slot2 == data[j].Slot) {
              res2 = false;
            }
            else { }
          }

        }
        let date = new Date(this.examDates[i]);
        let currentdate = new Date(); var Isdisabled = false;
        if (date < currentdate) {
          Isdisabled = true;
        }
        obj = { 'Date': this.examDates[i], 'slot1': res1, 'slot2': res2, 'isDisabled': Isdisabled };
        this.examDateArry.push(obj);
      }
    }
    catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - getExamDates - outer catch", err, new Error().stack);
    }
  }
  public handleChecked(date: any, slot: any, e: any) {
    try {
      var ExamDates = this.disableSlotDate;
      var checked = e.target.checked;
      let added = false;
       var ExamBlockedDataCountArray: any[] = [];
      let Exist = -1
      for (var index = 0; index < this.DupExamBlockedData.length; index++) {
        if (this.DupExamBlockedData[index].BlockedDate == date && this.DupExamBlockedData[index].BlockedSlot == slot) {
          Exist = index
        }
      }
      if (Exist != -1) {
        //Splice is used for first value as index,second value is after index which need to be deleted pass that value
        this.DupExamBlockedData.splice(Exist, 1)
        this.DupExamBlockedData.push({ BlockedDate: date, BlockedSlot: slot, IsActive: !checked })
      }
      else {
        this.DupExamBlockedData.push({ BlockedDate: date, BlockedSlot: slot, IsActive: !checked })
      }
      //for getting Scheduled exam users count this for loop is used pushing only isactive values into array
      for (var index = 0; index < this.DupExamBlockedData.length; index++) {
        if (this.DupExamBlockedData[index].IsActive == true) {
          ExamBlockedDataCountArray.push({ BlockedDate: this.DupExamBlockedData[index].BlockedDate, BlockedSlot: this.DupExamBlockedData[index].BlockedSlot })
        }
      }
      this.ExamBlockedDataCountArray =ExamBlockedDataCountArray;
      for (var arr1 = 0; arr1 < this.OrigdisableSlotDate.length; arr1++) {
        for (var arr2 = 0; arr2 < this.DupExamBlockedData.length; arr2++) {
          if ((this.OrigdisableSlotDate[arr1].ExamDate == this.DupExamBlockedData[arr2].BlockedDate) && (this.OrigdisableSlotDate[arr1].Slot == this.DupExamBlockedData[arr2].BlockedSlot)) {
            this.DupExamBlockedData[arr2].id = this.OrigdisableSlotDate[arr1].id
          }
        }
      }
      if (this.disableSlotDate.length > 0) {
        for (let i = 0; i < this.disableSlotDate.length; i++) {
          const element = this.disableSlotDate[i];
          let slotDate = element.ExamDate
          let slotTime = element.Slot
          let id = null
          if (date == slotDate && slot == slotTime && checked) {
            ExamDates.splice(i, 1)
          } else {
            if (!added && !checked) {
              ExamDates.push({ ExamDate: date, Slot: slot, id: null });
              added = true;
            }
          }
        }
      }
      this.disableSlotDate = ExamDates;
        this.ExamBlockedData = this.DupExamBlockedData;
    }
    catch (err) {
      this.commonServObj.logErrors(null, "exam-date-management.component.ts - handleChecked - outer catch", err, new Error().stack);
    }
  }
  UpdateExamData(sendEmail:any) {
    try{
      this.isLoading=true;
      this.loaderText="Updating...";
        let url = Constants.UpdateAdminExamDataManagement;
        var body = {
            "CreatedBy": this.userEmail,
            "ModifiedBy": this.userEmail,
            "adminBlockedSlots": this.ExamBlockedData
        }
         this.apiservice.postMethodAxios(url, body).then((response: any) => {
            if (response.status == 200) {
                    this.DupExamBlockedData = [];
                    if(sendEmail == true){
                    this.SendEmailtoUsers();
                    }
                    this.isLoading=false;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Slot updated succesfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      setTimeout(() => {
                         this.getCurrentQuarter();
                      }, 600);
              this.showEmailpopup=false;
            }
            return response;
        })
    }
    catch (err) {
        this.commonServObj.logErrors(null,"exam-date-management.component.ts - UpdateExamData - outer catch",err,new Error().stack);
        return Promise.reject();
    }
}
SendEmailtoUsers(){
  try{
      let url = Constants.SendMail;
      var body = {
          "EmailEventName":"RescheduleForBlockedDates",
          "AdminBlockedSlots": this.GettingUserEmail,
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
          if (response.status == 200) {
                  this.DupExamBlockedData = [];
          }
          return response;
      }).catch((err)=>{
          this.commonServObj.logErrors(null,"exam-date-management.component.ts - SendEmailtoUsers - inner catch",err,new Error().stack);
          return Promise.reject();
      })
  }
  catch (err) {
      this.commonServObj.logErrors(null,"exam-date-management.component.ts - SendEmailtoUsers - outer catch",err,new Error().stack);
      return Promise.reject();
  }
}
clearvalues() {
  try{
      this.DupExamBlockedData=[];
          this.ExamBlockedData= [];
          this.GettingUserEmail= [];
          this.CheckLoggedCount=[{ count: 0, ExamDate: '', SlotTime: ''}];
          this.ExamBlockedDataCountArray= [];
          this.Ismodalopen= false;
          this.showEmailpopup=false;

      this.getCurrentQuarter();
  }
  catch (err) {
      this.commonServObj.logErrors(null,"exam-date-management.component.ts - clearvalues - outer catch",err,new Error().stack);
  }
}
checkingLogedCount() {
  try{
      this.isLoading=true;
      this.loaderText="Checking...";
      this.popdisplay='none';
      var LoggedUserEmail: any[] = [];
      let url = Constants.getLoggedCountOnPaticularSlot;
      let LoggedCount: any = [];
      let CheckingLogged: any[] = [];
      var body = this.ExamBlockedDataCountArray;
       this.apiservice.postMethodAxios(url, body).then((response: any) => {
          let resArr = response.data;
          for (let i = 0; i < body.length; i++) {
              var table = i == 0 ? "table" : "table" + i;
              if (resArr[table].length > 0) {
                  var count = resArr[table].length;
                  var Date = moment(resArr[table][0].blockedDate).format("YYYY-MM-DD")
                  var SlotTime = resArr[table][0].blockedSlot
                  if(count > 0 ){
                    this.isLoading=false;
                      CheckingLogged.push({ count: count, ExamDate: Date, SlotTime: SlotTime });
                      this.popdisplay='block';
                  }
                  LoggedCount = CheckingLogged;
                  for (let j = 0; j < resArr[table].length; j++) {
                      const element = resArr[table][j];
                      let emailId = element.loginUserEmailId
                      let slotdate = moment(element.blockedDate).format("YYYY-MM-DD")
                      let slottime = element.blockedSlot
                      let UserName=element.userFirstName
                      LoggedUserEmail.push({UserEmailId:emailId,BlockedDate:slotdate,BlockedSlot:slottime,UserFirstName:UserName});
                  }
              }
          }
          this.CheckLoggedCount= LoggedCount;
          this.GettingUserEmail= LoggedUserEmail;
          if(LoggedCount.length == 0 && this.ExamBlockedData.length > 0){
              this.UpdateExamData(false);
          }
          return response;
      })
  }
  catch (err) {
      this.commonServObj.logErrors(null,"exam-date-management.component.ts - handleChecked - outer catch",err,new Error().stack);
      return Promise.reject();
  }
}
actionPopup(){
  Swal.fire({
    title: 'Are you sure?',
    text: "The selected slot(s) will be disabled and applicant(s) will be notified via Email.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:'No'
    }).then((result) => {
        if (result.isConfirmed) {
            this.UpdateExamData(true);
            this.popdisplay='none';
        } else{
            this.clearvalues();
            this.popdisplay='none';
        }})
  }
  close(){
    this.popdisplay='none';
    this.clearvalues();
  }

}
