import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { ApiService } from 'src/app/Api/api.service';
import CommonService from 'src/app/Api/CommonService';
import { Constants } from 'src/app/Constants/Constants';

@Component({
  selector: 'app-application-instructions',
  templateUrl: './application-instructions.component.html',
  styleUrls: ['./application-instructions.component.scss']
})


export class ApplicationInstructionsComponent implements OnInit {

  state:IStateApplicationInstructions;
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  constructor(private apiservice: ApiService, private authService: MsalService) {
    this.state={
      showFirst:true,
      showSecond:false,
      showThird:false,
      feeStructure:{Handler:0,Investigator:0,Supervisor:0,HandlerRestricted:0,Duplicate:0}
  }
  }

  ngOnInit(): void {
    this.getFeeStructure()
  }

  changePage(page: number, direction: string){
    if (direction == 'right'){
      if(page == 1){ this.state.showFirst=false; this.state.showSecond=true; }
      if(page == 2){ this.state.showSecond=false; this.state.showThird=true; }
    }else{
      if(page == 2){ this.state.showFirst=true; this.state.showSecond=false; }
      if(page == 3){ this.state.showSecond=true; this.state.showThird=false; }
    }
  }

  getFeeStructure(){
    try {
      let url = Constants.GetFeeStructure;
      let feeObj:FeeStructure={Handler:0,Investigator:0,Supervisor:0,HandlerRestricted:0,Duplicate:0};
      this.apiservice.getMethodAxios(url).then((response: any) => {
      if(response && response.data && response.data.table && response.data.table.length>0 ){
      let resArr = response.data.table;
      for(let i = 0; i < resArr.length; i++){
      let element = resArr[i];
      if(element.certificateName==Constants.HandlerCertificate && element.applicationTypeName==Constants.New){
      feeObj.Handler=element.fee;
      }else if(element.certificateName==Constants.HandlerRestrictedCertificate && element.applicationTypeName==Constants.New){
      feeObj.HandlerRestricted=element.fee;
      }else if(element.certificateName==Constants.InvestigatorCertificate && element.applicationTypeName==Constants.New){
      feeObj.Investigator=element.fee;
      }else if(element.certificateName==Constants.SupervisorCertificate && element.applicationTypeName==Constants.New){
      feeObj.Supervisor=element.fee;
      }else if(element.certificateName==Constants.HandlerCertificate && element.applicationTypeName==Constants.Duplicate){
      feeObj.Duplicate=element.fee;
      }
      }
      this.state.feeStructure = feeObj;
      }
      })
    }
    catch (error) {
      this.commonServObj.logErrors(null,"application-instructions.component.ts - getFeeStructure - outer catch",error,new Error().stack);
    }
  }


}


export interface FeeStructure{
  Handler:number;
  Investigator:number;
  Supervisor:number;
  HandlerRestricted:number;
  Duplicate:number;
}
export interface IStateApplicationInstructions{
  showFirst:boolean;
  showSecond:boolean;
  showThird:boolean;
  feeStructure:FeeStructure;
}
