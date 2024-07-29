import CommonService  from 'src/app/Api/CommonService';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { MsalService } from '@azure/msal-angular';
import { Constants } from '../../Constants/Constants';
import { ApiService } from 'src/app/Api/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
 isActive:boolean=false;
  constructor(private authService: MsalService,private apiservice: ApiService, private http:HttpClient, public router:Router) {
    this.currentURL = window.location.href;
  }
  commonServObj:CommonService=new CommonService(this.apiservice,this.authService);
  currentLogin:any;
  userEmail?: string;
  userName?: string;
  isUser:boolean = false;
  isAdmin:boolean = false;
  isInspector:boolean = false;
  isContractor:boolean = false;
  isSupervisor:boolean = false;
  isApplication:boolean = false;
  currentURL:string;
  ngOnInit(): void {
    this.userName=Constants.userName;
    this.userEmail=Constants.userEmail;
    if(Constants.UserRole == "User"){this.isUser = true;}
    if(Constants.UserRole == "Admin"){this.isAdmin = true;}
    if(Constants.UserRole == "Inspector"){this.isInspector = true;}
    if(Constants.UserRole == "Contractor"){this.isContractor = true;}
    if(Constants.UserRole == "Supervisor"){this.isSupervisor = true;}
  }
  handleHiglight(e:any){
    $('.active').removeClass('active');
    $(e.target).addClass('active');
  }
  public toggle(){
    $('.top-nav-menu').toggleClass('menu-toggle-active');
  };
  routeFunction(link:string){
    if(Constants.IsLoggedIn){
      this.router.navigate([link]);
      this.commonServObj.checkLoginTime();
      let url = Constants.getUserRole;
      var body = {
        "LoginUserEmailId": Constants.userEmail
      }
        if(Constants.UserRoleClaim === "User" && Constants.UserRole !=="Supervisor")
        this.apiservice.postMethodAxios(url, body).then((response: any) => {
          Constants.UserRole = response['data']['table'] ? response['data']['table'][0]['role'] : "User";
          if(Constants.UserRoleClaim === "User" && Constants.UserRole==="Supervisor"){
            Swal.fire({
              position: 'center',
              icon: 'success',
              //title:'',
              text: 'You have become a Supervisor please re-login to access the application as Supervisor',
              showConfirmButton: true,
              confirmButtonText: "Logout",
            }).then((result) => {
              if (result.isConfirmed) {
              if(Constants.IsLoggedIn)
                this.commonServObj.logout()
              else
                window.location.reload()
              }else{
                if(Constants.IsLoggedIn)
                this.commonServObj.logout()
              else
                window.location.reload()
              }
            })
          }
        });
    }
    else{
      window.location.reload()
    }
  }
}
