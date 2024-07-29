import Swal from 'sweetalert2';
import { Constants } from '../Constants/Constants';
import CommonService from '../Api/CommonService';
import IDScanService from '../Api/IDScanService';
import BlobAccess from './BlobAccess';
import { MsalService } from "@azure/msal-angular";
import { ApiService } from "./api.service";

export default class IDScanAccess {
  constructor(private apiservice: ApiService, private authService: MsalService) {}
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  blobAccessObj:BlobAccess = new BlobAccess(this.apiservice, this.authService);
  idScanServObj:IDScanService = new IDScanService(this.apiservice, this.authService)

  public checkIDBAL(front: string, back: string, face: string):Promise<any> {
    try{
    let url = Constants.verifyID
    var body = {
      "documentType": 1,
      "verifyFace": true,
      "frontImageBase64": front,
      "backOrSecondImageBase64": back,
      "faceImageBase64": face
    };
    return this.idScanServObj.verifyID(url, body).then((response:any) => {
      if (response && response.data && response.data.documentVerificationResult && response.data.documentVerificationResult.statusString == "Ok" && response.data.faceVerificationResult.confidence > 70) {
        return true;
      }
      else {
        Swal.fire({
          title: "Warning!",
          text: "Driver/Non-driver license ID and picture provided are not valid. Please check and upload again.",
          icon: "warning"
        })

        this.commonServObj.logErrors(null, "IDScanAccess.ts - checkIDBAL - inner catch", response, new Error().stack);
      }
    }).catch((err:any) => {
      console.log(err);
      this.commonServObj.logErrors(null, "IDScanAccess.ts - checkIDBAL - outer catch", err, new Error().stack);
      return Promise.reject();
    });
    }catch(err){
    this.commonServObj.logErrors(null,"IDScanAccess.ts - checkIDBAL - outer catch",err,new Error().stack);
    return Promise.reject();
  }
  }
  public checkIDBALRemovingScan(front: string, back: string, face: string) {
    let attachments: any[] = [];
    var body = {
      "documentType": 1,
      "verifyFace": true,
      "frontImageBase64": front,
      "backOrSecondImageBase64": back,
      "faceImageBase64": face
    };
    return this.blobAccessObj.uploadToBlobBALID("DMVFront", body.frontImageBase64).then((response) => {
      attachments.push({ DMVFront: response });
      return this.blobAccessObj.uploadToBlobBALID("DMVBack", body.backOrSecondImageBase64).then((response) => {
        attachments.push({ DMVBack: response });
        return this.blobAccessObj.uploadToBlobBALID("Photo", body.faceImageBase64).then((response) => {
          attachments.push({ Photo: response });
          return attachments;
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "IDScanAccess.ts - checkIDBALRemovingScan - Photo", err, new Error().stack);
        });
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "IDScanAccess.ts - checkIDBALRemovingScan - DMVBack", err, new Error().stack);
      });
    }).catch((err) => {
      console.log(err);
      this.commonServObj.logErrors(null, "IDScanAccess.ts - checkIDBALRemovingScan - DMVFront", err, new Error().stack);
    });
  }
}
