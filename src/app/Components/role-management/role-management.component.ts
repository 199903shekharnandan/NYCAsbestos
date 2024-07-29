import { ApiService } from 'src/app/Api/api.service';
import { Constants } from 'src/app/Constants/Constants';
import { Component, OnInit } from '@angular/core';
import { IroleManagement } from '../../Models/roleManagement';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import CommonService from 'src/app/Api/CommonService';
import BlobAccess from 'src/app/Api/BlobAccess';
import { MsalService } from '@azure/msal-angular';
declare var window: any;
@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  isAdmin: boolean = false;
  roleManagementData = {} as IroleManagement;
  InspectorDetails: any[] = [];
  dataObj: any[] = [];
  first = 0;
  rows = 5;
  formModal: any;
  isEdit: boolean = false;
  isLoading: boolean = false;
  loaderText: string = "";
  isDoc: boolean = false;
  currentTab: string = 'I';
  constructor(private apiservice: ApiService, private authService: MsalService) { }
  commonServObj: CommonService = new CommonService(this.apiservice, this.authService);
  blobAccessObj: BlobAccess = new BlobAccess(this.apiservice, this.authService);

  ngOnInit(): void {
    this.roleManagementData.document = [];
    this.roleManagementData.documentLinks = [];
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    if (Constants.UserRole == "Admin")
      this.isAdmin = true;
    this.GetInspectorAndContractorUserData('I');
  }
  GetInspectorAndContractorUserData(data: any) {
    try {
      this.isLoading = true;
      this.loaderText="Loading...";
      this.dataObj = [];
      let url = Constants.GetUserRoles;
      var body = {};
      this.currentTab = data;
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        if (data == "I") {
          if (response && response.data && response.data.table && response.data.table.length > 0) {
            this.dataObj = response['data']['table'];
            this.isLoading = false;
          }
        }
        else {
          if (response && response.data && response.data.table1 && response.data.table1.length > 0) {
            this.dataObj = response['data']['table1'];
            this.isLoading = false;
          }
        }
      }).catch((err) => {
        this.isLoading = false;
        console.log(err);
        this.commonServObj.logErrors(null, "role-management.component.ts - GetInspectorAndContractorUserData - inner catch", err, new Error().stack);
      });
    }
    catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "role-management.component.ts - GetInspectorAndContractorUserData - outer catch", ex, new Error().stack);
    }
  }
  next() {
    this.first = this.first + this.rows;
  }
  prev() {
    this.first = this.first - this.rows;
  }
  reset() {
    this.first = 0;
  }
  isLastPage(): boolean {
    return this.InspectorDetails ? this.first === (this.InspectorDetails.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.InspectorDetails ? this.first === 0 : true;
  }
  handleHiglight(data: any) {
    if (data == 'I') {
      $('#Inspector').addClass('active');
      $('#Contractor').removeClass('active');
      this.GetInspectorAndContractorUserData(data);
    }
    else {
      $('#Contractor').addClass('active');
      $('#Inspector').removeClass('active');
      this.GetInspectorAndContractorUserData(data);
    }
  }
  openFormModal(type: any, data: any) {
    if (type == "A") {
      this.roleManagementData = {
        name: "",
        loginUserEmailId: "",
        status: "",
        contactNumber: "",
        document: [],
        documentLinks: []
      } as IroleManagement;
      this.isEdit = false;
      this.roleManagementData.status = "";
    }
    else {
      this.isEdit = true;
      this.roleManagementData = data;
      this.roleManagementData = {
        name: data.name,
        contactNumber: data.contactNumber,
        loginUserEmailId: data.loginUserEmailId,
        status: data.status,
        document: data.licenseLink ? [{ name: this.getName(data.licenseLink) }] : [],
        documentLinks: data.licenseLink ? [{ link: data.licenseLink }] : []
      }
      this.changePosition();
    }
    this.formModal.show();
  }

  public async createRole() {
    try {
      this.isLoading=true;
      this.loaderText="Adding...";
      this.formModal.hide();
      let url = Constants.IsUserExists
      var body = {
        "EmailId": this.roleManagementData.loginUserEmailId,
        "Role": this.roleManagementData.status
      }
      this.apiservice.postMethodAxios(url, body).then(async (response: any) => {
        if (response && response.data && response.data.table && response.data.table.length == 0) {

          if (this.roleManagementData.status == 'Contractor') {
            let documentUrl: any[] = [];
            if (this.roleManagementData.document.length > 0 && this.roleManagementData.documentLinks.length == 0) {
              await this.blobAccessObj.uploadToBlobBAL(this.roleManagementData.document[0], Constants.License, this.roleManagementData.loginUserEmailId).then((url) => {
                if (url) {
                  documentUrl.push({ link: url });
                }
                this.roleManagementData.documentLinks = documentUrl;
                this.postCreateUser();
              }).catch((err) => {
                this.isLoading=false;
                console.log(err);
              })
            }
          } else {
            this.postCreateUser();
          }
        }
        else {
          this.isLoading=false;
          this.formModal.show();
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'User already exists as ' +response.data.table[0].role +'!',
            showConfirmButton: true,
          })
        }

      }).catch((err) => {
        this.isLoading=false;
        this.formModal.show();
        console.log(err);
        this.commonServObj.logErrors(null, "role-management.component.ts - createRole - inner catch", err, new Error().stack);
      });
    } catch (ex) {
      this.isLoading=false;
      this.formModal.show();
      console.log(ex);
      this.commonServObj.logErrors(null, "role-management.component.ts - createRole - outer catch", ex, new Error().stack);
    }
  }
  public postCreateUser() {
    let url1 = Constants.CreateUpdateRoleDetails;
    var body1 = {
      "Name": this.roleManagementData.name,
      "EmailId": this.roleManagementData.loginUserEmailId,
      "ContactNumber": this.roleManagementData.contactNumber,
      "Role": this.roleManagementData.status,
      "IsDeleted": false,
      "IsEdit": false,
      "LicenseLink": this.roleManagementData.status == 'Contractor' ? this.roleManagementData.documentLinks[0].link.split("?")[0] : ""

    }
    this.apiservice.postMethodAxios(url1, body1).then((response: any) => {
      this.isLoading=false;
      if (response.status == 200) {
        if (response.data != false) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Details added succesfully',
            showConfirmButton: false,
            timer: 1500
          });
          this.roleManagementData.status == 'Inspector' ? this.GetInspectorAndContractorUserData('I') : this.GetInspectorAndContractorUserData('C');
        this.roleManagementData.status == 'Inspector' ? this.handleHiglight('I') : this.handleHiglight('C');
        this.formModal.hide();
        this.roleManagementData = {} as IroleManagement;
        } else {
          this.formModal.show();
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Failed to add user role',
            text: 'User first need to signup to the system to be assigned a role.',
            showConfirmButton: true,
          });
        }

      }
    }).catch((ex)=>{
      this.isLoading=false;
    });
  }
  public async updateRoleCheck() {
    this.isLoading=true;
    this.loaderText="Updating...";
    this.formModal.hide();
    if (this.roleManagementData.status == 'Contractor') {
      let documentUrl: any[] = [];
      if (this.roleManagementData.document.length > 0 && this.roleManagementData.documentLinks.length == 0) {
        await this.blobAccessObj.uploadToBlobBAL(this.roleManagementData.document[0], Constants.License, this.roleManagementData.loginUserEmailId).then((url) => {
          if (url) {
            documentUrl.push({ link: url });
          }
          this.roleManagementData.documentLinks = documentUrl;
          this.updateRole();
          // });
        }).catch((err) => {
          this.isLoading=false;
          this.formModal.show();
          console.log(err);
        })
      } else {
        this.updateRole();
      }
    } else {
      this.updateRole();
    }
  }
  updateRole() {
    try {
      let url = Constants.CreateUpdateRoleDetails

      var body = {
        "Name": this.roleManagementData.name,
        "EmailId": this.roleManagementData.loginUserEmailId,
        "ContactNumber": this.roleManagementData.contactNumber,
        "Role": this.roleManagementData.status,
        "IsDeleted": false,
        "IsEdit": true,
        "LicenseLink": this.roleManagementData.status == 'Contractor' ? this.roleManagementData.documentLinks[0].link : ""
      }
      this.apiservice.postMethodAxios(url, body).then((response: any) => {
        this.isLoading=false;
        if (response.status == 200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Details updated succesfully',
            showConfirmButton: false,
            timer: 1500
          })
          this.roleManagementData.status == 'Inspector' ? this.GetInspectorAndContractorUserData('I') : this.GetInspectorAndContractorUserData('C')
          this.roleManagementData.status == 'Inspector' ? this.handleHiglight('I') : this.handleHiglight('C');
          this.formModal.hide();
          this.roleManagementData = {} as IroleManagement;
        }
      }).catch((err) => {
        this.isLoading=false;
        console.log(err);
        this.commonServObj.logErrors(null, "role-management.component.ts - updateRole - inner catch", err, new Error().stack);
      });
    }
    catch (ex) {
      this.isLoading=false;
      console.log(ex);
      this.commonServObj.logErrors(null, "role-management.component.ts - updateRole - outer catch", ex, new Error().stack);
    }
  }
  deleteData(data?: any) {
    try {
      let url = Constants.CreateUpdateRoleDetails;
      var body = {
        "Name": data.name,
        "EmailId": data.loginUserEmailId,
        "ContactNumber": data.contactNumber,
        "Role": data.status,
        "IsDeleted": true,
        "IsEdit": false,
        "LicenseLink": ""
      }
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this user",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.isLoading=true;
          this.loaderText="Deleting...";
          this.apiservice.postMethodAxios(url, body).then((response: any) => {
            this.isLoading=false;
            if (response.status == 200) {
              Swal.fire(
                'Deleted!',
                'user has been deleted succesfully.',
                'success'
              );
              data.status == 'Inspector' ? this.GetInspectorAndContractorUserData('I') : this.GetInspectorAndContractorUserData('C');
              data.status == 'Inspector' ? this.handleHiglight('I') : this.handleHiglight('C');
            }
          }).catch((err) => {
            this.isLoading=false;
            console.log(err);
            this.commonServObj.logErrors(null, "role-management.component.ts - deleteRole - inner catch", err, new Error().stack);
          });
        }
      });
    } catch (ex) {
      this.isLoading=false;
      console.log(ex);
      this.commonServObj.logErrors(null, "role-management.component.ts - deleteRole - outer catch", ex, new Error().stack);
    }
  }
  changePosition() {
    if (this.roleManagementData.status == 'Contractor') {
      if (this.roleManagementData.document && this.roleManagementData.document.length > 0) {
        this.isDoc = false;
      } else {
        this.isDoc = true;
      }
    } else {
      this.isDoc = false;
      this.roleManagementData.document = [];
    }
  }
  changeImg(e: any, type: any) {
    this.handleAttachments(e, type);
  }
  handleAttachments(e: any, type: any) {
    try {
      let errorType = "";
      var isValid = true;
      for (let i = 0; i < e.target.files.length; i++) {
        if (Constants.fileExtensionsAllowed.indexOf(e.target.files[0].name.split('.').pop().toLowerCase()) == -1) {
          isValid = false;
          errorType = "filetype";
          break;
        }
      }
      for (let i = 0; i < e.target.files.length; i++) {
        if (this.commonServObj.isFileSizeValid(e.target.files[i], type)) {
        } else {
          errorType = "filesize";
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        if (errorType == "filetype") {
          Swal.fire("Only the attachments with these extensions are allowed(.png, .jpeg, .jpg, .pdf )!")
        } else {
          Swal.fire("Attachment size should not exceed 10mb!");
        }
        return false;
      } else {
        this.FileAttach(e, type);
      }
    } catch (error) {
      this.commonServObj.logErrors(null, "role-management.component.ts - handleAttachments - outer catch", error, new Error().stack);

    }
  }
  public async FileAttach(e: any, type: any) {
    try {
      let files = e.target.files;
      let data: any[] = [];
      for (let i = 0; i < files.length; i++) {
        let name = e.target.files[i];
        data.push(name);
      }
      if (type == "doc") {
        this.roleManagementData.document = data;
        this.isDoc = false;
      }
    } catch (ex) {
      console.log(ex);
      this.commonServObj.logErrors(null, "role-management.component.ts - FileAttach", ex, new Error().stack);
    }
  }
  removeAttachment() {
    let attachments: String[] = this.roleManagementData.document;
    let attachmentLinks = this.roleManagementData.documentLinks;
    attachments.splice(0, 1);
    $("#attachment-doc").val("");
    this.roleManagementData.document = attachments;
    let deleteFile = attachmentLinks.length > 0 ? attachmentLinks[0] : "";
    if (deleteFile && deleteFile.link) {
      this.blobAccessObj.deleteFileFromBlobBAL(this.commonServObj.getNameForDelete(deleteFile.link));
    }
    if (attachmentLinks && attachmentLinks.length > 0) {
      attachmentLinks.splice(0, 1);
    }

    this.roleManagementData.documentLinks = attachmentLinks;
    this.isDoc = true;
  }
  public getName(url: any) {
    try {
      let urlArr: any[] = [];
      let name = "";
      if (url) {
        if (url.includes("?")) {
          urlArr = url.split("?")[0].split("/");
        } else {
          urlArr = url.split("/");
        }
        let extArr = urlArr[urlArr.length - 1].split(".");
        let ext = extArr[extArr.length - 1];
        name = urlArr[urlArr.length - 1].split("_")[0] + "." + ext;
      }
      return name;
    } catch (error) {
      this.commonServObj.logErrors(null, "role-management.component.ts - getName - inner catch", error, new Error().stack);

    }
  }
  openDoc(link: any) {
    window.open(link, "_blank");
  }
  validateInput(e: any, len: any) {
    var inp = String.fromCharCode(e.keyCode);
    if (len == "10") {
      if (e.target.value.length == 10) return false;
      if (/[0-9]/.test(inp)) { return true; }
      else { e.preventDefault(); return false; }
    }
  }
}
