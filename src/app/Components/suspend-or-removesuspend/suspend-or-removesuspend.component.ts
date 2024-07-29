import { IadminDashboard } from '../../Models/suspendOrRemoveSuspend';
import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Constants';
import { ApiService } from 'src/app/Api/api.service';
import Swal from 'sweetalert2';
import { MsalService } from '@azure/msal-angular';
import CommonService from 'src/app/Api/CommonService';
@Component({
  selector: 'app-suspend-or-removesuspend',
  templateUrl: './suspend-or-removesuspend.component.html',
  styleUrls: ['./suspend-or-removesuspend.component.scss']
})
export class SuspendOrRemovesuspendComponent implements OnInit {

  adminDashboardData = {} as IadminDashboard;
  dataObj: any[] = [];
  currentLogin:any;
  isAdmin:boolean=false;
  isLoading:boolean=false;
  constructor(private apiservice: ApiService, private authService: MsalService) {}
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);


  ngOnInit(): void {
    if(Constants.UserRole=="Admin")
      this.isAdmin=true;
    else
      this.isAdmin=false;
    this.getRequestsByEmail();
  }
  getRequestsByEmail() {
    try{
      this.isLoading=true;
    let url = Constants.qualifiedUserList;
    var body = {}
    this.apiservice.postMethodAxios(url, body).then((response: any) => {
      this.dataObj = response['data']['table'];
      this.isLoading=false;
    }).catch((err) => {
      this.isLoading=false;
      console.log(err);
      this.commonServObj.logErrors(null, "suspend-or-removesuspend.component.ts - getRequestsByEmail - inner catch", err, new Error().stack);
    });
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "suspend-or-removesuspend.component.ts - getRequestsByEmail - outer catch", ex, new Error().stack);
  }
  }
  changeStatus(type: any,reqNo:number) {
    try{
    var text = ''; var btntext="";
    if (type === 'Remove Suspended'){
      text = 'You want to remove suspend for this user certificate';
      btntext='Yes, remove it!';
    }
    else{
      text = 'You want to suspend this user certificate';
      btntext='Yes, suspend it!';
    }
    Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: btntext
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStatus(type,reqNo);
      }
    }).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "suspend-or-removesuspend.component.ts - changeStatus - inner catch", err, new Error().stack);
    });
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "suspend-or-removesuspend.component.ts - changeStatus - outer catch", ex, new Error().stack);
  }
  }
  updateStatus(type: any,reqNo:number) {
    try{
    let url= Constants.UpdateQualifiedUserStatus;
    var body={
      "ReqId":reqNo,
      "status":type
    }
     this.apiservice.postMethodAxios(url, body).then((response:any) =>{
      if (response.status == 200) {
        if(type==="Suspended"){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User certificate is suspended!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getRequestsByEmail();
        }
        else if(type==="Remove Suspended"){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User certificate is issued!',
            showConfirmButton: false,
            timer: 1500
          });
          this.getRequestsByEmail();
        }
      }
    }).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "suspend-or-removesuspend.component.ts - updateStatus - inner catch", err, new Error().stack);
    });
  } catch (ex) {
    console.log(ex);
    this.commonServObj.logErrors(null, "suspend-or-removesuspend.component.ts - updateStatus - outer catch", ex, new Error().stack);
  }
  }
}
