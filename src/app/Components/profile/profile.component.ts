import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Constants';
import * as moment from 'moment';
import CommonService from 'src/app/Api/CommonService';
import { ApiService } from 'src/app/Api/api.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  state: any;
  Constants: any = Constants;
  moment:any = moment;
  isApplicantOrSupervisorOrUser:boolean = false;
  isUserData:boolean = false;
  constructor(private authService:MsalService, private apiServObj:ApiService) {
    this.state = {
      Userdata: [],
      ApplicantDob: "",
      AdminData: [],
      CertificateTypes: "",
      Position: "",
      isLoading:true
    };
  }
  commonServObj = new CommonService(this.apiServObj, this.authService);

  ngOnInit(): void {
    if(Constants.UserRole=='Applicant' || Constants.UserRole == 'Supervisor' || Constants.UserRole == 'User'){
      this.isApplicantOrSupervisorOrUser = true;
    }else{
      this.isApplicantOrSupervisorOrUser = false;
    }
    this.getAdminProfile()
    this.getUserProfile()
  }
  public getAdminProfile() {
    try {
      let url = Constants.getUserProfile;
      var body = {
        LoginUserEmailId: Constants.userEmail,
      };

      this.apiServObj
        .postMethodAxios(url, body)
        .then((response: any) => {
          if (response && response.data && response.data.table2 && response.data.table2.length === 1) {
            let resArr1 = response.data.table2;
            if (resArr1[0].role ) {
              this.state.Position = resArr1[0].role;
            }
            this.state.AdminData = resArr1;
          }
        })
        .catch((err) => {
          this.commonServObj.logErrors(null, "profile.component.ts - adminprofile - inner catch", err, new Error().stack);
        });
    } catch (err) {
      this.commonServObj.logErrors(null, "profile.component.ts - adminprofile - outer catch", err, new Error().stack);
    }
  }
  public getUserProfile() {
    try {
      let url = Constants.getUserProfile;
      var body = {
        LoginUserEmailId: Constants.userEmail,
      };
      this.apiServObj
        .postMethodAxios(url, body)
        .then((response: any) => {
          if (response && response.data && response.data.table && response.data.table.length === 1) {
            let resArr = response.data.table;
            this.state.Userdata = resArr;
            if(this.state.Userdata && this.state.Userdata.length > 0){
              this.isUserData=true;
            }
          }
          if (response && response.data && response.data.table1 && response.data.table1.length) {

            if (response.data.table1[0].certificateType && response.data.table1[1] && response.data.table1[1].certificateType) {
              let Types = response.data.table1[0].certificateType + " and " + response.data.table1[1].certificateType;

              this.state.CertificateTypes=Types;
            }
            else {
              let Arr = response.data.table1[0].certificateType;

              this.state.CertificateTypes= Arr;
            }
          }
          this.state.isLoading = false;

        })
        .catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "profile.component.ts - getUserProfile - inner catch", err, new Error().stack);
        });
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "profile.component.ts - getUserProfile - outer catch", ex, new Error().stack);
    }
  }


}
