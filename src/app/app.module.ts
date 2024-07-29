import { AsbetosCertificateComponent } from './Components/asbetos-certificate/asbetos-certificate.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IvyCarouselModule} from 'carousel-angular';
import {WebcamModule} from 'ngx-webcam';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { HomeComponent } from './Components/home/home.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ApplicationInstructionsComponent } from './Components/application-instructions/application-instructions.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

// Import MSAL and MSAL browser libraries.
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

// Import the Azure AD B2C configuration
import { msalConfig, protectedResources } from './auth-config';

// Import the Angular HTTP interceptor.
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Add the essential Angular materials.
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule, MatInputModule,MatNativeDateModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ApiService } from './Api/api.service';
import { Constants } from './Constants/Constants';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { RoleManagementComponent } from './Components/role-management/role-management.component';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { SuspendOrRemovesuspendComponent } from './Components/suspend-or-removesuspend/suspend-or-removesuspend.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component'
import { ExamDateManagementComponent } from './Components/exam-date-management/exam-date-management.component';
import {CalendarModule} from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import { ViewProfileComponent } from './Components/view-profile/view-profile.component';
import { AdminDashboardFilterComponent } from './Components/admin-dashboard-filter/admin-dashboard-filter.component';
import { VerifycertificateComponent } from './Components/verifycertificate/verifycertificate.component';
import { AttendanceHistoryComponent } from './Components/attendance-history/attendance-history.component';
import { VerificationHistoryComponent } from './Components/verification-history/verification-history.component';
import { ApplicationFormComponent } from './Components/application-form/application-form.component';
import { DuplicateFormComponent } from './Components/duplicate-form/duplicate-form.component';
import { PaymentResponsePagesComponent } from './Components/payment-response-pages/payment-response-pages.component';
import { GetResultComponent } from './Components/get-result/get-result.component';
import { RenewalFormComponent } from './Components/renewal-form/renewal-form.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ScheduleRescheduleComponent } from './Components/dashboard/schedule-reschedule/schedule-reschedule.component';
import { HallTicketPageComponent } from './Components/hall-ticket-page/hall-ticket-page.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
//import { TestPageComponent } from './Components/test-page/test-page.component';
import { CameraPopupComponent } from './Components/camera-popup/camera-popup.component';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    ApplicationInstructionsComponent,
    RoleManagementComponent,
    SuspendOrRemovesuspendComponent,
    AdminDashboardComponent,
    ExamDateManagementComponent,
    DashboardComponent,
    ViewProfileComponent,
    AdminDashboardFilterComponent,
    VerifycertificateComponent,
    AttendanceHistoryComponent,
    VerificationHistoryComponent,
    ApplicationFormComponent,
    DuplicateFormComponent,
    PaymentResponsePagesComponent,
    AsbetosCertificateComponent,
    GetResultComponent,
    RenewalFormComponent,
    ScheduleRescheduleComponent,
    HallTicketPageComponent,
    //TestPageComponent,
    CameraPopupComponent
  ],
  imports: [
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    WebcamModule,
    IvyCarouselModule,
    NgxQRCodeModule,
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    CheckboxModule,
    // Import the following Angular materials.
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    FormsModule,
    BrowserAnimationsModule,
    // Import the HTTP client.
    HttpClientModule,
    // NgToastModule,
    NgxBootstrapMultiselectModule,
    MatDatepickerModule, MatInputModule,MatNativeDateModule,
    ReactiveFormsModule,
    WebcamModule,
    AutocompleteLibModule,
    DropdownModule,
    //NgbModule,

    // Initiate the MSAL library with the MSAL configuration object
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration.
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: protectedResources.backendApi.scopes
        }
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [protectedResources.backendApi.endpoint, protectedResources.backendApi.scopes]
        ])
      })

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
    ApiService,
    Constants,
    DatePipe,
    VerificationHistoryComponent,
    AttendanceHistoryComponent
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
