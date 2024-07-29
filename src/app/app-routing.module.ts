import { AsbetosCertificateComponent } from './Components/asbetos-certificate/asbetos-certificate.component';
import { ExamDateManagementComponent } from './Components/exam-date-management/exam-date-management.component';
import { SuspendOrRemovesuspendComponent } from './Components/suspend-or-removesuspend/suspend-or-removesuspend.component';
import { RoleManagementComponent } from './Components/role-management/role-management.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './Components/profile/profile.component';
import { HomeComponent } from './Components/home/home.component';
import { ApplicationInstructionsComponent } from './Components/application-instructions/application-instructions.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { MsalGuard } from '@azure/msal-angular';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { VerifycertificateComponent } from './Components/verifycertificate/verifycertificate.component';
import { AttendanceHistoryComponent } from './Components/attendance-history/attendance-history.component';
import { VerificationHistoryComponent } from './Components/verification-history/verification-history.component';
import { ApplicationFormComponent } from './Components/application-form/application-form.component';
import { PaymentResponsePagesComponent } from './Components/payment-response-pages/payment-response-pages.component';
import { GetResultComponent } from './Components/get-result/get-result.component';
import { RenewalFormComponent } from './Components/renewal-form/renewal-form.component';
import { HallTicketPageComponent } from './Components/hall-ticket-page/hall-ticket-page.component';
import { DuplicateFormComponent } from './Components/duplicate-form/duplicate-form.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [MsalGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard] },
  { path: 'applicationInstructions', component: ApplicationInstructionsComponent, canActivate: [MsalGuard] },
  { path: 'roleManagement', component: RoleManagementComponent, canActivate: [MsalGuard] },
  { path: 'suspendOrRemoveSuspend', component: SuspendOrRemovesuspendComponent, canActivate: [MsalGuard] },
  { path: 'adminDashboard', component: AdminDashboardComponent, canActivate: [MsalGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard]},
  { path: 'examDateManagement', component: ExamDateManagementComponent, canActivate: [MsalGuard] },
  { path: 'verificationCertificate', component: VerifycertificateComponent, canActivate: [MsalGuard] },
  { path: 'attendanceHistory', component: AttendanceHistoryComponent, canActivate: [MsalGuard] },
  { path: 'asbetosCertificate', component: AsbetosCertificateComponent, canActivate: [MsalGuard] },
  { path: 'verificationHistory', component: VerificationHistoryComponent, canActivate: [MsalGuard] },
  { path: 'application', component: ApplicationFormComponent, canActivate: [MsalGuard] },
  { path: 'renewalApplication', component: RenewalFormComponent, canActivate: [MsalGuard] },
  { path: 'duplicateApplication', component: DuplicateFormComponent, canActivate: [MsalGuard] },
  { path: 'payment/:status/:certificateType/:applicationType/:reqId', component: PaymentResponsePagesComponent, canActivate: [MsalGuard] },
  { path: 'paymentSuccessful', component: PaymentResponsePagesComponent, canActivate: [MsalGuard] },
  { path: 'paymentSuccessful/:certificateType/:applicationType/:reqId', component: PaymentResponsePagesComponent, canActivate: [MsalGuard] },
  { path: 'paymentUnSuccessful', component: PaymentResponsePagesComponent, canActivate: [MsalGuard] },
  { path: 'paymentUnSuccessful/:certificateType/:applicationType/:reqId', component: PaymentResponsePagesComponent, canActivate: [MsalGuard] },
  { path: 'paymentCancel/:certificateType/:applicationType/:reqId', component: PaymentResponsePagesComponent, canActivate: [MsalGuard] },
  { path: 'certificate', component: AsbetosCertificateComponent, canActivate: [MsalGuard]},
  { path: 'getResult', component:GetResultComponent, canActivate: [MsalGuard]},
  { path: 'hallTicket/:encodedId', component:HallTicketPageComponent, canActivate: [MsalGuard]},
  { path: '**', redirectTo: "/home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation:'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
