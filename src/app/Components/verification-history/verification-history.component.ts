import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/Api/api.service';
import { Constants } from 'src/app/Constants/Constants';
import { IverificationHistory } from 'src/app/Models/verificationHistory';


@Component({
  selector: 'app-verification-history',
  templateUrl: './verification-history.component.html',
  styleUrls: ['./verification-history.component.scss']
})
export class VerificationHistoryComponent implements OnInit {
  Constants: any;
  isLoading: boolean = false;
  verificationHistoryData = {} as IverificationHistory;
  dataObj: any[] = [];
  formModal: any;
  currentLogin: any;
  userEmail: any;
  applicationEndDate = moment(new Date()).format('YYYY-MM-DD');;
  searchText: any;
  JobId: any;
  keyword: any="";
  first = 0;

  date1 = new Date();
  currentYear = this.date1.getUTCFullYear();
  currentMonth = this.date1.getUTCMonth() + 1;
  currentDay = this.date1.getUTCDate();
  FinalMonth: any;
  FinalDay: any;
  TODAYdate = moment(new Date()).format('YYYY-MM-DD');
  isVerifyCertificate: boolean = false;

  constructor(private apiservice: ApiService, private authService: MsalService) {
    this.Constants = Constants;
  }

  ngOnChanges(item: any) {
    this.applicationEndDate = item;
    this.GetVerificationHistory()
  }

  ngOnInit(): void {
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
    this.userEmail = this.currentLogin.username;
    this.GetVerificationHistory();
  }

  verifyCertificate(data: any) {
    this.isVerifyCertificate = true;
    this.verificationHistoryData = data;
  }

  refresh() {
    this.keyword = "";
    this.GetVerificationHistory();
  }

  GetVerificationHistory() {
    this.isLoading = true;
    this.isVerifyCertificate = false;
    this.dataObj = [];
    let url = Constants.GetVerifiedData;
    var body = {
      "VerifierEmailID": this.userEmail,
      "LoginDate": moment(this.applicationEndDate).format("MM/DD/YYYY"),
      "JobID":  this.keyword
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

