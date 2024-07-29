import { Component, OnInit } from '@angular/core';
import { IgetResult } from 'src/app/Models/getresult';
import { ApiService } from 'src/app/Api/api.service';
import { Constants } from 'src/app/Constants/Constants';
import { MsalService } from '@azure/msal-angular';
import  {jsPDF} from 'jspdf';
import CommonService from 'src/app/Api/CommonService';


@Component({
  selector: 'app-get-result',
  templateUrl: './get-result.component.html',
  styleUrls: ['./get-result.component.scss']
})
export class GetResultComponent implements OnInit {

  getResultData = {} as IgetResult;
  dataObj: any[] = [];
  formModal: any;
  currentLogin: any;
  userEmail: any;
  ReqId:any;
  id:any;
  data:any;
  DatasByID: any;
  isLoading:boolean=false;
  constructor(private apiservice: ApiService, private authService: MsalService) {

  }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);

  ngOnInit(){
    this.currentLogin = this.authService.instance.getAllAccounts()[0];
    this.userEmail = this.currentLogin.username;
    this.DatasByID = localStorage.getItem("ApplicantReqId");
    this.GetDetailsForExamResult(this.DatasByID);
  }

  async generateExamResultPDF(){
    this.isLoading=true;
    $('.download_format1').css('width','600px')
    let doc = new jsPDF("p", "pt",[595.28, 841.89]);
    doc.setFontSize(11);
    $(".hall-ticket-page").css("font-size", "11px");
    $(".guests-name-list").css("font-size", "11px");// change property value
    const htmltag = document.querySelector('#data') as HTMLElement
    await doc.html(htmltag, {
        callback: function (pdf) {
            pdf.save("AsbestosExamResult.pdf");
            let array = pdf.output("arraybuffer");
        }
    })
    $('.download_format1').css('width','unset')
    this.isLoading=false
}

  GetDetailsForExamResult(id: any) {
    this.dataObj = [];
    let url = Constants.GetResult;
    var body = {
      ReqId: id
    }
    this.apiservice.postMethodAxios(url, body).then((response: any) => {
      if (response.data.table.length > 0)
      {
        this.dataObj = response.data.table;
      }
      }
    ).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "get-result.component.ts -GetDetailsForExamResult", err, new Error().stack);
    });
  }



}
