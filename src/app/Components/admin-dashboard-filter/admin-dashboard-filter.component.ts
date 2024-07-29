import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IMultiSelectOption } from 'ngx-bootstrap-multiselect';
import * as moment from 'moment';
@Component({
  selector: 'app-admin-dashboard-filter',
  templateUrl: './admin-dashboard-filter.component.html',
  styleUrls: ['./admin-dashboard-filter.component.scss'],
})

export class AdminDashboardFilterComponent implements OnInit {
  @Input() adminDashboard:any;
  moment:any;
  // Dropdown list for Application Type
  selectApplicationType: IMultiSelectOption[] = [
    { id: "Initial", name: "Initial" },
    { id: "Duplicate", name: "Duplicate" },
    { id: "Renewal", name: "Renewal" }
  ];
  // Dropdown list for Certificate Type
  selectCertificate: IMultiSelectOption[] = [
    { id: "Handler", name: "Handler" },
    { id: "Handler Restricted", name: "Handler Restricted" },
    { id: "Investigator", name: "Investigator" },
    { id: "Supervisor", name: "Supervisor" }
  ]
  // Dropdown list for ExamStatus
  selectExamStatus: IMultiSelectOption[] = [
    { id: "Failed", name: "Failed" },
    { id: "Incompleted", name: "Incompleted" },
    { id: "Passed", name: "Passed" },
    { id: "Rescheduled", name: "Rescheduled" },
    { id: "Scheduled", name: "Scheduled" },
  ];
  // Dropdown list for Application Status
  selectApplicationStatus: IMultiSelectOption[] = [
    { id: "Approved", name: "Approved" },
    { id: "Draft", name: "Draft" },
    { id: "Objected", name: "Objected" },
    { id: "Pending", name: "Pending" },
    { id: "Rejected", name: "Rejected" },
    // { id: "Discarded", name: "Discarded" }
  ];
  //Dmv Status Options
  selectDMVStatus: IMultiSelectOption[] = [
    { id: "U01", name: "U01" },
    { id: "U02", name: "U02" },
    { id: "U03", name: "U03" },
    { id: "U04", name: "U04" },
    { id: "U05", name: "U05" },
    { id: "U06", name: "U06" },
    { id: "E01", name: "E01" },
    { id: "E02", name: "E02" },
    { id: "P", name: "P" },
    { id: "Pending", name: "Pending" },
  ];
  // Dropdown list for OCSE Status
  OCSEStatusOptions: IMultiSelectOption[] = [
    { id: "Approved", name: "Approved" },
    { id: "Pending", name: "Pending" },
    { id: "Rejected", name: "Rejected" },
  ];
  today:string;
  constructor() {
    this.today=new Date().toISOString().split("T")[0];
  }

  applyButtonAction(){
    if(this.adminDashboard.state.isDateOrOtherField==false){
      this.validateDaterange();
      this.adminDashboard.state.searchDate=null;
      this.adminDashboard.state.searchValue="";
    }
    else if(this.adminDashboard.state.isDateOrOtherField==true){
      this.adminDashboard.getSearchData();
    }
    this.clearButton();
  }
  clearButton(){
    this.adminDashboard.state.ApplicationData=[]
    this.adminDashboard.state.CertificateData=[]
    this.adminDashboard.state.ExamStatusData=[]
    this.adminDashboard.state.ApplicationStatusData=[]
    this.adminDashboard.state.selectedDMVStatus=[]
    this.adminDashboard.state.selectedOCSEStatus=[]
    this.adminDashboard.state.modifiedStartDate=""
    this.adminDashboard.state.modifiedEndDate=""
  }

  public validateDaterange() {
    if ((this.adminDashboard.state.applicationStartDate != "") && (this.adminDashboard.state.applicationEndDate != "")) {
      if(this.adminDashboard.state.applicationStartDate <= moment(new Date()).format('YYYY-MM-DD') && this.adminDashboard.state.applicationEndDate <= moment(new Date()).format('YYYY-MM-DD')){
        if((this.adminDashboard.state.applicationStartDate <= this.adminDashboard.state.applicationEndDate )){
          this.adminDashboard.getDataForAdminDashboard();
        }
        else{
          Swal.fire({
            title: "Error!",
            text: "Start Date is greater than End Date.",
            icon: "error"
          })
        }
      }else{
        Swal.fire({
          title: "Error!",
          text: "You can not search for future records.",
          icon: "error"
        })
      }

    }
  }
  ngOnInit(): void {
    if(this.adminDashboard?.state.searchDate || this.adminDashboard?.state.searchValue != ""){
      document.getElementById('filterType')?.click();
    }
  }
  refresh(){
    this.adminDashboard.state.isDateOrOtherField=false;
    this.adminDashboard.state.searchValue="";
    this.adminDashboard.state.searchDate=null;
    this.adminDashboard.state.selectedSearchParameter= this.adminDashboard.searchParameters[0].value;
    this.adminDashboard.refresh();
  }

}
