import { Component, Input, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ApiService } from 'src/app/Api/api.service';
import CommonService from 'src/app/Api/CommonService';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/Constants';
import Swal from 'sweetalert2';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-schedule-reschedule',
  templateUrl: './schedule-reschedule.component.html',
  styleUrls: ['./schedule-reschedule.component.scss']
})
export class ScheduleRescheduleComponent implements OnInit {

  @Input() dashboard: any;
  dashboardState:any;
  state: any;
  today: Date;
  nextWednesday: Date;
  moment: any;
  constructor(private apiService: ApiService, private authService: MsalService) {
    this.moment = moment;
    var currentLogin = this.authService.instance.getAllAccounts()[0];
    this.today = new Date();
    this.nextWednesday = new Date(this.today.setDate(this.today.getDate() + (3 + 7 - this.today.getDay()) % 7)); this.today = new Date();
    if(moment(this.nextWednesday).format("YYYY-MM-DD") == moment(this.today).format("YYYY-MM-DD")){      this.nextWednesday = new Date(this.today.setDate(this.today.getDate() + ((3 + 7 - this.today.getDay()) % 7)+7));
      this.today=new Date();
    }
    this.state = {
      isLoading: false,
      userEmail: currentLogin.username,
      ExamDate: moment(this.nextWednesday).format("YYYY-MM-DD"),
      SelectedSlot: null,
      errorExamDate: false,
      errorSelectedSlot: false,
      Comment: "",
      SelectSlotValues:[],
      noSlots:false
    }
  }
  commonServObj: CommonService = new CommonService(this.apiService, this.authService);
  disableKeyBoard(){
    return false;
  }
  dateChange(e:any){
    this.state.ExamDate=e.target.value;
  }

  public onCancel() {
    this.dashboardState.viewDataId = 0;
    this.dashboardState.openreschedule = false;
    this.dashboardState.type = '';
    this.dashboardState.UserName = '';
    this.dashboardState.UserDOB = '';
    this.dashboardState.CertificateType = '';
    this.state.ExamDate = null;
    this.state.SelectedSlot = null;
    this.state.Comment = "";
  }
  public onSubmit() {
    try {
      if (this.dashboardState.type == "Schedule") {
        if (this.state.ExamDate != "" && this.state.SelectedSlot) {
          this.checkSlotAvailability();
        } else {
          this.state.errorExamDate = this.state.ExamDate == "" ? true : false;
          this.state.errorSelectedSlot = !this.state.SelectedSlot ? true : false;
        }
      }
      else {
        if (this.state.ExamDate != "" && this.state.SelectedSlot && this.state.Comment != "") {
          this.checkSlotAvailability();
        }
        else {
          this.checkValidation();
        }
      }

    } catch (error) {
      this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - onsubmit - outer catch", error, new Error().stack);
    }

  }

  public async checkSlotAvailability() {
    try {
      this.state.isLoading=true;
      let url = Constants.checkAvailableSlot;
      var body = {
        "SelectedExamDate": moment(this.state.ExamDate).format('YYYY-MM-DD')
      }
      await this.apiService.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table1 && response.data.table.length > 0 && response.data.table.length > 0) {
          let morningSlot = response.data.table[0].morningcount;
          let afternoonSlot = response.data.table1[0].afternoonCount;
          if (this.state.SelectedSlot == '10am-12pm' && morningSlot < 35) {
            this.ShowSubmitMessage();
          }
          else if (this.state.SelectedSlot == '2pm-4pm' && afternoonSlot < 35) {
            this.ShowSubmitMessage();
          }
          else {
            this.SlotValidationMessage();
          }
        }
      })
        .catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - checkslotavilability - inner catch", err, new Error().stack);
        })


    } catch (error) {
      this.state.isLoading=false;
      this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - checkslotavilability - outer catch", error, new Error().stack);

    }
  }




  public CheckSlot() {
    this.state.SelectedSlot = null
    if (this.state.ExcludedDateSlots.length > 0) {
      for (let i = 0; i < this.state.ExcludedDateSlots.length; i++) {
        let e = this.state.ExcludedDateSlots[i]
        if (e.date == moment(this.state.ExamDate).format("YYYY/MM/DD")) {
          if (e.slot == "10am-12pm") {
            this.state.SelectSlotValues = [
              { value: '2pm-4pm', label: '2pm-4pm' }
            ];
            this.state.noSlots=false;
          }
          else {
            this.state.SelectSlotValues = [
              { value: '10am-12pm', label: '10am-12pm' }
            ];
            this.state.noSlots=false;
          }
          break;
        }
        else {
          this.state.SelectSlotValues = [
            { value: '10am-12pm', label: '10am-12pm' },
            { value: '2pm-4pm', label: '2pm-4pm' }
          ];
          this.state.noSlots=false;
        }
      }
    }
    else {
      this.state.SelectSlotValues = [
        { value: '10am-12pm', label: '10am-12pm' },
        { value: '2pm-4pm', label: '2pm-4pm' }
      ]
      this.state.noSlots=false;
    }

    if (this.state.DisableDates.length > 0) {
      for (let i = 0; i < this.state.DisableDates.length; i++) {
        let e = this.state.DisableDates[i]
        if (moment(e).format("YYYY/MM/DD") == moment(this.state.ExamDate).format("YYYY/MM/DD")) {
          this.state.SelectSlotValues = [
            { label: 'No Available Slots' }
          ]
          this.state.noSlots=true;
        }
      }
    }

  }


  public GetCustomExamDate() {
    try {
      let url = Constants.GetAdminDataManagement;
      let Slot_Date_Time: any[] = [];
      this.apiService.getMethodAxios(url).then((response: any) => {
        if (response && response.data && response.data.table && response.data.table.length > 0) {
          let examslot = response.data.table;
          for (let i = 0; i < examslot.length; i++) {
            const element = examslot[i];
            Slot_Date_Time.push({ date: moment(element.selectedDate).format("YYYY/MM/DD"), slot: element.slot })
          }
          var restrictedDateSlot = this.groupBy(Slot_Date_Time, "date");
          let Slot_Date: any[] = [];
          let disabledDate: any[] = [];
          let disabledSlot: any[] = [];
          if (restrictedDateSlot != undefined && restrictedDateSlot != null) {
            for (var date_restrict in restrictedDateSlot) {
              disabledDate.push(date_restrict);
            }
            for (let date = 0; date < disabledDate.length; date++) {
              const disable_Dates = restrictedDateSlot[disabledDate[date]];
              if (disable_Dates.length > 1) {
                Slot_Date.push(new Date(disabledDate[date]));
              }
              else if (disable_Dates.length === 1) {
                for (let i = 0; i < disable_Dates.length; i++) {
                  disabledSlot.push(disable_Dates[i]);
                }
              }
            }
          }
          this.state.DisableDates = Slot_Date;
          this.state.ExcludedDateSlots = disabledSlot;
        }else{
          this.state.DisableDates = [];
          this.state.ExcludedDateSlots = [];
        }
      }).catch((err) => {
        this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - GetCustomExamDate - inner catch", err, new Error().stack);
        console.log(err);
      })


    } catch (error) {
      this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - GetCustomExamDate - outer catch", error, new Error().stack);
    }

  }

  public groupBy(objectArray: any[], property: any) {
    return objectArray.reduce((acc: any, obj: any) => {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }
      ,
      {});
  }


  public async postExamDate() {
    try {
      this.state.isLoading = true;
      let url = Constants.postExamDate;
      var body = {
        "ReqId": this.dashboardState.viewDataId,
        "ExamSlotDate": moment(this.state.ExamDate).format('YYYY-MM-DD'),
        "ExamSlotTime": this.state.SelectedSlot,
        "Comment": this.state.Comment,
        "FullName": this.dashboardState.UserName,
        "BirthDate": this.dashboardState.UserDOB,
        "CertificateType": this.dashboardState.CertificateType
      }
      await this.apiService.postMethodAxios(url, body).then((response: any) => {
      }).catch((err) => {
        this.commonServObj.logErrors(body.ReqId, "schedule-reschedule.component.ts - postExamdate - inner catch", err, new Error().stack);

        console.log(err)
      })

    } catch (error) {
      this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - postExamdate - outer catch", error, new Error().stack);
    }
  }

  afterConfirmSuccess(){
    let encodedId = Buffer.from(`NYC-${this.dashboardState.viewDataId}-NYC`).toString('base64');
    window.open(`/hallTicket/${encodedId}`, "_blank");
    this.dashboard.GetDashboard();
    this.dashboard.state.openreschedule = false;
  }

  public ShowSubmitMessage() {

    try {
      this.postExamDate()
        .then((res) => {
          this.state.isLoading = false;
          if (this.dashboardState.type == "Schedule") {
            Swal.fire({
              title: "Success!",
              text: "Your exam is scheduled!",
              icon: "success",
              preConfirm:()=>{
                this.afterConfirmSuccess()
              }
            })
          } else {
            Swal.fire({
              title: "Success!",
              text: "Your exam is rescheduled!",
              icon: "success",
              preConfirm:()=>{
                this.afterConfirmSuccess()
              }
            })
          }
        }).catch((err) => {
          this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - postexamdate - outer catch", err, new Error().stack);

          console.log(err);
        })


    } catch (error) {
      this.commonServObj.logErrors(null, "schedule-reschedule.component.ts - postexamdate - outer catch", error, new Error().stack);
    }

  }
  public SlotValidationMessage() {
    this.state.isLoading=false;
    Swal.fire({
      title: "Warning!",
      text: "All slots are booked. please go for another slot",
      icon: "warning"
    })
  }
  public checkValidation() {
    if (this.state.ExamDate == "" || this.state.SelectedSlot == null || this.state.SelectedSlot == undefined || this.state.Comment == "") {
      this.state.errorExamDate = this.state.ExamDate == "";
      this.state.errorSelectedSlot = this.state.SelectedSlot == null || this.state.SelectedSlot == undefined;
      this.state.errorComment = this.state.Comment == "";
    }
  }

  ngOnInit(): void {
    this.dashboardState=this.dashboard.state;
    this.GetCustomExamDate()
  }

}
