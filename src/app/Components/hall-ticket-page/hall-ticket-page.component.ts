import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Constants';
import { ApiService } from 'src/app/Api/api.service';
import { MsalService } from '@azure/msal-angular';
import CommonService from 'src/app/Api/CommonService';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
import { encode, decode } from 'base64-arraybuffer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

var id: any;
var base64Html: any;

@Component({
  selector: 'app-hall-ticket-page',
  templateUrl: './hall-ticket-page.component.html',
  styleUrls: ['./hall-ticket-page.component.scss', '../../../assets/css/pdf.css']

})
export class HallTicketPageComponent implements OnInit {

  moment: any;
  state: any;
  Constants: any
  constructor(private apiservice: ApiService, private authService: MsalService, private route: ActivatedRoute) {
    this.moment = moment;
    this.state = {
      encodedId: null,
      isLoading: true,
      userEmail: Constants.userEmail,
      UserRole: Constants.UserRole,
      userName: Constants.userName,
      Results: null,
      viewDataId: null,
      SlotTime: null,
      preferredLanguage: null,
    };
    this.state.encodedId = this.route.snapshot.paramMap.get("encodedId");
    this.firstAction();
  }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);

  firstAction() {
    if (this.state.UserRole == "Applicant" || this.state.UserRole == "Supervisor" || this.state.UserRole == "User") {
      let decodedId = Buffer.from(this.state.encodedId, 'base64').toString('ascii');

      let isValidId: boolean = false;
      if (decodedId.includes('NYC') && decodedId.includes('-')) {
        let IdArr = decodedId.split('-');
        for (let i = 0; i < IdArr.length; i++) {
          if (IdArr[0] == 'NYC' && IdArr[2] == 'NYC' && Number(IdArr[1])) {
            id = IdArr[1];
            isValidId = true;
          }
        }
      }
      if (isValidId) {
        this.GetDataForHallTicket(id);

      }
      else {
        this.state.isLoading = false;
      }
    }
  }
  SendAndGenerate_PDF() {
    try {
      $('.download_format').css('display', 'block')
      $('.mob-pdf').css('display', 'none')
      this.generatePDF().then((resp: any) => {

        $('.download_format').css('width', 'unset')

      }).catch((e) => {
        this.commonServObj.logErrors(null, "hall-ticket-page.component.ts - sendandgeneratepdf - inner catch", e, new Error().stack);
      });

    } catch (error) {
      this.commonServObj.logErrors(null, "hall-ticket-page.component.ts - sendandgeneratepdf - outer catch", error, new Error().stack);
    }
  }
  public async generatePDF() {
    try {

      this.state.isLoading = true;
      var doc = new jsPDF("p", "pt", [595.28, 841.89], true);
      $(".pdf").css("font-size", "11px");
      $(".pdf").css("width", "595px");
      $(".pdf").css("height", "835px");
      $(".pdf").css("padding-top", "10px");
      $(".right-section .w-20").css("height", "auto");
      $(".right-section .w-20").css("margin-left", "-21px");
      $(".right-section .w-20 img").css("height", "100px");
      $(".right-section .w-20 img").css("width", "80px");
      $(".guests-name-list").css("font-size", "11px");
      $("p").css("font-size", "12px");
      $("p").css("text-align", "justify");
      $(".tab-rightsection .w-80 tr>td").css("font-size", "11px");
      //$(".pdf").css("margin","0px auto");
      $("tr>td").css("font-size", "12px");
      $("tr td").css("font-size", "12px");
      $("tr th").css("font-size", "12px");
      const htmltag = document.querySelector('#data') as HTMLElement;
      html2canvas(htmltag, { scale: 2.5 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png', 0.8);
          const pdf = new jsPDF("p", "mm", "a4");
          $(".tab-rightsection .w-80 tr>td").css("font-size", "11px");
          pdf.setFontSize(11);
          $(".pdf").css("font-size", "11px");
          $(".guests-name-list").css("font-size", "11px");
          $(".tab-rightsection .w-80 tr>td").css("font-size", "11px");
          const imgProperties = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight =
            (imgProperties.height * pdfWidth) / imgProperties.width;
          const getHeight1 = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
          pdf.save("AsbestosExamHallTicket.pdf");
          var array = pdf.output("arraybuffer");
          base64Html = encode(array);
          this.EmailForSent_PDF().then((res:any)=>{
            Swal.fire({
              title: "Success!",
              text: "Please check your mail for hall ticket",
              icon: "success",
              preConfirm:() => {
                window.close();
              }
            })
          });
        })
      this.state.isLoading = false;
    } catch (error) {
      this.commonServObj.logErrors(null, "hall-ticket-page.component.ts - generatepdf - inner catch", error, new Error().stack);
    }
  }
  // Email Triger on send PFD
  public EmailForSent_PDF(): Promise<any> {
    try {

      let url = Constants.SendMail;
      var body = {
        "UserEmailId": [this.state.Results.loginUserEmailId],
        "EmailEventName": "ExamScheduledEmail",
        "ExamHallTicketLink": base64Html,
        "UserFisrtName": this.state.Results.applicantFirstName,
        "RequestId": id,
        "UserMiddleName": this.state.Results.applicantMiddleName,
        "UserLastName": this.state.Results.applicantLastName,
        "CertificateType": this.state.Results.certificateType,
        "PaymentStatus": "Successful",

      }
      return this.apiservice.postMethodAxios(url, body).then((response: any) => {
      }).catch((err) => {
        this.commonServObj.logErrors(null, "hall-ticket-page.component.ts - emailforsentpdf - inner catch", err, new Error().stack);
        console.log(err);
        return Promise.reject();
      })

    } catch (error) {
      this.commonServObj.logErrors(null, "hall-ticket-page.component.ts - emailforsentpdf - outer catch", error, new Error().stack);
      return Promise.reject();
    }
  }

  ngOnInit(): void {

  }

  // getting Data for Generating hall Ticket
  public GetDataForHallTicket(id: any) {
    try {
      let url = Constants.DataForGenerating_PDF;
      var body = {
        ReqId: id
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (response && response.data && response.data.length > 0) {
          let resArr = response.data[0];
          var Timeslot = response.data[0].examSlotTime
          var language = response.data[0].language && response.data[0].language == "EN" ? "English" : response.data[0].language == "ES" ? "Spanish" :
            response.data[0].language == "RU" ? "Russian" : response.data[0].language == "PL" ? "Polish"
              : response.data[0].language == "KO" ? "Korean" : response.data[0].language == "SH" ? "Serbo-Croatian" : "";
          var slot = Timeslot.split('-')

          this.state.Results = resArr;
          this.state.SlotTime = slot[0];
          this.state.isLoading = false;
          this.state.preferredLanguage = language;
          this.state.userName = this.state.Results.applicantFirstName + (this.state.Results.applicantMiddleName != "" ? " " + this.state.Results.applicantMiddleName + " " : " ") + this.state.Results.applicantLastName;
        } else {
          this.state.isLoading = false;
        }
      }).catch((err) => {
        this.commonServObj.logErrors(body.ReqId, "hall-ticket-page.component.ts - GetDataForHallTicket - inner catch", err, new Error().stack);
        console.log(err);
        this.state.isLoading = false;
      })
    } catch (error) {
      this.commonServObj.logErrors(null, "hall-ticket-page.component.ts - GetDataForHallTicket - outer catch", error, new Error().stack);
      this.state.isLoading = false;
    }
  }

}
