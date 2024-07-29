import { ApiService } from 'src/app/Api/api.service';
import { Constants } from './Constants/Constants';
import { Component, OnInit, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import CommonService from './Api/CommonService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  commonServiceObj: CommonService = new CommonService(this.apiService, this.authService);
  title = 'AppComponent';
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  userEmail?: string;
  userName?: string;
  isNavbar: boolean = true;
  gblRole: boolean = false;

  timedOut = false;
  lastPing: any;
  childModal: boolean = false;
  idleTime = 30 * 60;
  timeOut = 15;
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService,
    private apiService: ApiService, private idle: Idle, private keepalive: Keepalive, private router: Router) {
    idle.setIdle(this.idleTime);
    idle.setTimeout(this.timeOut);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);



    idle.onIdleEnd.subscribe(() => {
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.timedOut = true;
      this.logout()
    });

    idle.onIdleStart.subscribe(() => {
      this.childModal = true;

      Swal.fire({
        title: "You Have Been Idle!",
        text: 'You\'ve gone idle! It will Logout Soon.',
        showCloseButton: false,
        timerProgressBar: true,
        timer: (this.timeOut * 1000) + 500,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        //confirmButtonText: "Stay",
        confirmButtonText: "Logout"
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        } else
        // if (result.isDenied) {
        //   this.logout();
        // }
        // else
        if (result.isDismissed) {
          this.logout();
        }
      })
    });


    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }
  hideChildModal() {
    this.childModal = false;
  }
  stay() {
    this.childModal = false;
    this.reset();
  }

  ngOnInit() {

    if (window.location.href.includes("getResult") || window.location.href.includes("hallTicket")) { this.isNavbar = false; }
    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })
    this.getRole();
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);

    } else {
      this.authService.loginRedirect();
    }
  }

  logout() {
    if(Constants.IsLoggedIn)
      this.commonServiceObj.logout()
    else
      window.location.reload()
  }
  getRole() {
    Constants.CurrentLogin = this.authService.instance.getAllAccounts()[0];
    if (!Constants.CurrentLogin) {
      this.login()
    } else {
      if(window.location.href.toLocaleLowerCase().includes("application")){
        this.router.navigate(['/home'])
      }
      Constants.userEmail = Constants.CurrentLogin.username;
      //Dev
      // if (Constants.CurrentLogin.idTokenClaims.extension_Firstname == undefined)
      //   Constants.userName = Constants.CurrentLogin.idTokenClaims.given_name;
      // else{
      //   Constants.userName = Constants.CurrentLogin.idTokenClaims.extension_Firstname;
      // }
      //UAT and prod
      Constants.userName = Constants.CurrentLogin ? Constants.CurrentLogin.idTokenClaims.given_name ? Constants.CurrentLogin.idTokenClaims.given_name : Constants.CurrentLogin.idTokenClaims.extension_FirstName ? Constants.CurrentLogin.idTokenClaims.extension_FirstName : Constants.CurrentLogin.idTokenClaims.extension_LastName ? Constants.CurrentLogin.idTokenClaims.extension_LastName : "" : "";

        Constants.userName = Constants.userName ? Constants.userName : Constants.userEmail;
      Constants.tokenExp = Constants.CurrentLogin ? Constants.CurrentLogin.idTokenClaims.exp : "";
      Constants.loginType = Constants.CurrentLogin && Constants.CurrentLogin.idTokenClaims ? Constants.CurrentLogin.idTokenClaims.idp : "";
      Constants.IsLoggedIn = true;

      let url = Constants.getUserRole;
      var body = {
        "LoginUserEmailId": Constants.userEmail
      }
      Constants.UserRole = Constants.CurrentLogin.idTokenClaims.jobTitle?Constants.CurrentLogin.idTokenClaims.jobTitle:"User";
      Constants.UserRoleClaim = Constants.CurrentLogin.idTokenClaims.jobTitle?Constants.CurrentLogin.idTokenClaims.jobTitle:"User";

      if(Constants.UserRole=='Supervisor'){
        this.apiService.postMethodAxios(url, body).then((response: any) => {
          Constants.UserRole = response['data']['table'] ? response['data']['table'][0]['role'] : "User";
          this.gblRole = true;
        });
      }else{
        this.gblRole = true;
      }
    }
  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}

