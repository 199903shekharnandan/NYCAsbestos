import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/Constants';
import { ApiService } from 'src/app/Api/api.service';
import { IattendanceHistory } from 'src/app/Models/attendanceHistory';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss']
})
export class AttendanceHistoryComponent implements OnInit {
  Constants: any;
  moment: any = moment;
  isLoading: boolean = false;
  dataObj: any[] = [];
  formModal: any;
  currentLogin: any;
  userEmail: any;
  attendanceHistoryData = {} as IattendanceHistory;
  data: any;
  today = new Date()
  applicationEndDate = moment(this.today).format('YYYY-MM-DD');
  isCheckInUser: boolean = false;

  constructor(private apiservice: ApiService, private authService: MsalService,) {
    this.Constants = Constants;
  }

  ngOnInit(): void {
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
    this.userEmail = this.currentLogin.username;
    this.GetAttendanceHistory();
  }

  refresh() {
    this.GetAttendanceHistory();

  }

  GetAttendanceHistory() {
    this.isLoading = true;
    this.dataObj = [];
    let url = Constants.GetDataForSupervisor;
    var body = {
      "LoginDate": moment(this.applicationEndDate).format("MM/DD/YYYY"),
      "VerifierID": this.userEmail
    }
    this.apiservice.postMethodAxios(url, body).then((response: any) => {
      if (response['data'].length > 0) {
        this.dataObj = response['data'];
      }
      this.isLoading = false;
    }
    );
  }

}
