import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import CommonService from 'src/app/Api/CommonService';
import { ApiService } from 'src/app/Api/api.service';
import { Constants } from 'src/app/Constants/Constants';
@Component({
  selector: 'app-payment-response-pages',
  templateUrl: './payment-response-pages.component.html',
  styleUrls: ['./payment-response-pages.component.scss']
})
export class PaymentResponsePagesComponent implements OnInit {
  props: any;
  Constants:any;
  constructor(private route: ActivatedRoute, public router:Router,private apiservice: ApiService, private authService:MsalService) {
    this.Constants = Constants;
    this.props={
      certificateType:"",
      applicationType:"",
      status:"",
      reqId:0
    }
  }
  commonServObj = new CommonService(this.apiservice, this.authService);

  ngOnInit(): void {
    $('#navbarnavigation').css("display", "none");
    this.props.reqId = this.route.snapshot.paramMap.get('reqId');
    this.props.applicationType = this.route.snapshot.paramMap.get('applicationType');
    this.props.certificateType = this.route.snapshot.paramMap.get('certificateType');
    if(window.location.href.includes("paymentSuccessful"))
      this.props.status = 'successful';
    if(window.location.href.includes("paymentUnSuccessful"))
      this.props.status = 'unsuccessful';
    if(window.location.href.includes("paymentCancel")){
      this.updateStatus();
      this.props.status = 'cancelled';
    }

  }
  public async updateStatus(){
    try{
      let url = Constants.UpdateStatus;
      var body = {
        "ReqId": this.props.reqId,
    }
    this.apiservice
        .postMethodAxios(url, body)
        .then((response: any) => {
        }).catch((err) => { console.log(err);
          this.commonServObj.logErrors(body.ReqId,"payment-response-pages.component.ts - updateStatus - inner catch",err,new Error().stack);
      });
    } catch (err) {
      this.commonServObj.logErrors(null,"payment-response-pages.component.ts - updateStatus - outer catch",err,new Error().stack);

    }
  }
  showNavBarNavigation(){
    $('#navbarnavigation').css("display", "block");
  }

}
