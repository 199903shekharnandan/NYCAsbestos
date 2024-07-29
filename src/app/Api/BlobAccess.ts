import { Constants } from "../Constants/Constants";
import BlobService from "../Api/BlobService";

import CommonService from "../Api/CommonService";
import * as moment from "moment";
import { MsalService } from "@azure/msal-angular";
import { ApiService } from "./api.service";

export default class BlobAccess {
  constructor(private apiservice: ApiService, private authService: MsalService) {}
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  blobservObj:BlobService = new BlobService(this.apiservice, this.authService);
  public uploadToBlobBAL(file: any, type: any, contractorEmail?: any): Promise<any> {
    try {
      let name = file.name.replace(/[\!@#$%^&*_+=;<(){}>?/|\ ,:-]+/g, "");
      let nameArr = name.split(".");
      return this.commonServObj.toBase64(file).then(async (result: any) => {
        let fileName = type == "Receipt" ? Constants.ReceiptImagePattern : type == "SSC" ? Constants.SSCImagePattern :
          type == "DYS" ? Constants.NYSDOHImagePattern : type == "OCSE" ? Constants.OCSEImagePattern : type == "Appendix" ? Constants.AppendicesImagePattern :
            type == "Reference" ? Constants.ReferenceImagePattern : type == "Signature" ? Constants.SignatureImagePattern :
              type == Constants.Course ? Constants.CourseImagePattern : type == Constants.Background ? Constants.BackgroundImagePattern :
                type == Constants.Reason ? Constants.ReasonImagePattern : type == Constants.RequestChange ? Constants.RequestChangeImagePattern :
                  type == Constants.License ? Constants.LicenseImagePattern : "";
        let time = moment(new Date()).format('DD-MM-YY,HH:mm:ss');
        fileName = fileName.replace("<Time>", time);
        if (type != Constants.License) {
          fileName = fileName.replace("<Email>", Constants.userEmail);
        } else {
          fileName = fileName.replace("<Email>", contractorEmail);

        }

        fileName = nameArr[0] + "_" + fileName.replace(/[\!@#$%^&*_.+=;<(){}>?/|\ ,:-]+/g, "") + "." + nameArr[1];
        let url = Constants.uploadFileToBlobUrl;
        let base64 = result.split(",")[1];
        const body = {
          "BlobName": fileName,
          "Base64": base64
        }
        return this.blobservObj.postFileToBlob(url, body).then((blobUrl: any) => {
          return blobUrl.data;
        }).catch((err) => {
          console.log(err);
          this.commonServObj.logErrors(null, "BlobAccess.ts - uploadToBlobBAL - inner catch", err, new Error().stack);
          return Promise.reject();
        })
      });
    } catch (err) {
      this.commonServObj.logErrors(null, "BlobAccess.ts - uploadToBlobBAL - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }
  public uploadToBlobBALID(type: any, base64: any) {
    try {
      let fileName = type == "DMVFront" ? Constants.DMVFrontImagePattern : type == "DMVBack" ? Constants.DMVBackImagePattern : Constants.PhotoImagePattern;
      let time = moment(new Date()).format('DD-MM-YY,HH:mm:ss').replace(/[\!@#$%^&*_+=;<(){}>?/|\ ,:-]+/g, "");
      fileName = fileName.replace("<Time>", time);
      fileName = fileName.replace("<Email>", Constants.userEmail.replace(/[\!@#$%^&*_.+=;<(){}>?/|\ ,:-]+/g, ""));
      fileName = fileName;

      fileName = fileName + ".png";
      let url = Constants.uploadFileToBlobUrl;
      const body = {
        "BlobName": fileName,
        "Base64": base64
      }
      return this.blobservObj.postFileToBlob(url, body).then((blobUrl: any) => {
        return blobUrl.data;
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "BlobAccess.ts - uploadToBlobBALID - inner catch", err, new Error().stack);
        return Promise.reject();
      })
    } catch (err) {
      this.commonServObj.logErrors(null, "BlobAccess.ts - uploadToBlobBALID - outer catch", err, new Error().stack);
      return Promise.reject();
    }
  }
  public deleteFileFromBlobBAL(name: any) {
    try {
      let url = Constants.deleteFileFromBlobUrl;
      const body = {
        "BlobName": name
      }
      this.blobservObj.postFileToBlob(url, body).then((blobUrl: any) => {
      }).catch((err) => {
        console.log(err);
        this.commonServObj.logErrors(null, "BlobAccess.ts - deleteFileFromBlobBAL - inner catch", err, new Error().stack);
      })

    } catch (err) {
      this.commonServObj.logErrors(null, "BlobAccess.ts - deleteFileFromBlobBAL - outer catch", err, new Error().stack);
    }
  }
}
