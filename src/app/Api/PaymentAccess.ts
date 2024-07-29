import { Constants } from "../Constants/Constants";
import { IPaymentDetails } from "../Models/paymentDetails";
import * as $ from 'jquery';
import CommonService from "../Api/CommonService";
import { ApiService } from "./api.service";
import { MsalService } from "@azure/msal-angular";

export default class PaymentAccess {
  constructor(private apiservice: ApiService, private authService: MsalService) {}
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
    public  paymentBAL(data:IPaymentDetails):Promise<any>{
      try{
        let url = Constants.PaymentIntegration;
        var body={
          "ReqId": data.reqId,
          "ApplicationType": data.applicationType,
          "CertificateType": data.certificateType,
          "FisrtName":data.firstName,
          "MiddleName":data.middleName,
          "LastName":data.lastName,
          "UserEmail":Constants.userEmail,
          "RetailPaymentRequest": {
            "displayTransactionDescription_1": data.reqId,
              "displayTransactionDescription_2": data.ApplicantName,
              "displayTransactionDescription_3": data.certificateType,
              "paymentExtraData": "n/a",
              "retailPaymentRequestLineItems": {
                  "displayLongDescription": data.reqId+"-"+data.ApplicantName+"-"+data.applicationType,
                  "displayShortDescription_1": data.reqId,
                  "displayShortDescription_2": data.ApplicantName,
                  "displayShortDescription_3": data.certificateType,
                  "displayShortDescription_4": "n/a",
                  "flexField_2": data.ApplicantName,
                  "flexField_3": data.certificateType,
                  "flexField_4": data.applicationType,
              }
          }
      }
          return this.apiservice?this.apiservice
          .postMethodAxios(url, body)
          .then(async (response: any) => {
            if (response && response.data && response.data.RetailPaymentResponse) {
                return response.data.RetailPaymentResponse;
            }
          }).catch((err:any) => { console.log(err);
            this.commonServObj.logErrors(body.ReqId,"PaymentAccess.ts - paymentBAL - inner catch",err,new Error().stack);
            return Promise.reject();
          }) : Promise.reject() ;

        } catch (err) {
          this.commonServObj.logErrors(null,"PaymentAccess.ts - paymentBAL - outer catch",err,new Error().stack);
          return Promise.reject();
        }
      }
      public async postAndRedirect(CartKey:any){
        try{
        let url=Constants.ProcessPreparedRetail;
        var postFormStr = "<form method='POST' action='" + url + "'>\n";
            postFormStr += `<input name="cartKey" id="myInput" style="width: 150px; height: 30px" value=${CartKey} />`;

            postFormStr += "</form>";

            var formElement = $(postFormStr);

            $('body').append(formElement);

            $(formElement).submit();

          } catch (err) {
            this.commonServObj.logErrors(null,"PaymentAccess.ts - postAndRedirect",err,new Error().stack);

          }
        }
}
