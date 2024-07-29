import { Component, Input, OnInit } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import Swal from 'sweetalert2';

@Component({
  selector: 'camera-popup',
  templateUrl: './camera-popup.component.html',
  styleUrls: ['./camera-popup.component.scss']
})
export class CameraPopupComponent implements OnInit {
  @Input() parent:any;
  @Input() parentThis?:any;
  constructor() { }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId?: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage?: WebcamImage = undefined;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  closeCamera(){
    this.parent.isCameraPopup=false;
  }
  saveImage(){
    Swal.fire({
      text:'Do you want to continue with the following caputerd picture...',
      showCancelButton: true,
      confirmButtonText:"Yes",
      imageUrl: this.webcamImage?.imageAsDataUrl,
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: 'Custom image'
    }).then((result)=>{
      if(result.isConfirmed){
        this.parent.attachmentPhoto = this.webcamImage;
        if(this.parentThis)
          this.parentThis.getImage(this.parent.attachmentPhoto.imageAsDataUrl);
        this.closeCamera()
      }
    })
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    Swal.fire({
      title:"Camera Error: " + error.message,
      text:"Please check browser's camera permissions of your device..."
    })
    .then(()=>this.closeCamera())
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

}
