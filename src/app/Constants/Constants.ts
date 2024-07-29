export class Constants {

  public static fileExtensionsAllowed = [
    "jpg", "jpeg", "png", "pdf"
  ];

  //  //#region DEV-Acuvate

  //   //#region B2C-login
  //   public static logoutUrl="https://asbestospoc.b2clogin.com/tfp/asbestospoc.onmicrosoft.com/b2c_1_flow3/oauth2/v2.0/logout?client_id=e2436720-e920-41bc-86e2-98dfae7a0dff&response_type=eyJpZCI6ImZjNGMzMTgyLWJhYWEtNDM4YS1iYzg2LTBmOGIyNGQwYTZjMiIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&redirect_uri=https://nyc-asbestos.azurewebsites.net&scope=openid%20offline_access"

  //   public static SingUpSignInName="B2C_1_Flow3";
  //   public static SingUpSignInFlow="https://asbestospoc.b2clogin.com/asbestospoc.onmicrosoft.com/B2C_1_Flow3";
  //   public static AuthorityDomain = "asbestospoc.b2clogin.com";
  //   public static ClientID = "e2436720-e920-41bc-86e2-98dfae7a0dff";
  //   //#endregion B2C-login

  //    //#region VC-QR
  //    public static IssueVCQR='https://nyc-vc-qrgeneration.azurewebsites.net/api/issuer/issuance-request';
  //    public static VerifyVCQR='https://nyc-vc-qrgeneration.azurewebsites.net/api/verifier/presentation-request';
  //    public static VerifyVCQRResponse = 'https://nyc-vc-qrgeneration.azurewebsites.net/api/verifier/presentation-response?id=';
  //   //  #endregion VC-QR

  //    public static InvestigatorInitialAppendixA="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Investigator Initial -Appendix A.pdf";

  //    public static InvestigatorInitialAppendixB="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Investigator Initial-Appendix B.pdf";

  //    public static InvestigatorInitialAppendixD="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Investigator Initial -Appendix D.pdf";

  //    public static InvestigatorInitialAppendixE="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Investigator Initial -Appendix E.pdf";

  //    public static InvestigatorRenewalAppendixA="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Investigator Renewal-Appendix A.pdf";

  //    public static InvestigatorRenewalAppendixB="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Investigator Renewal-Appendix B.pdf";

  //    public static SupervisorAppendixC="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Supervisor-Appendix C.pdf";

  //    public static SupervisorAppendixF="https://meshstorageportal2.blob.core.windows.net/appendixstaticfiles/Supervisor-Appendix F.pdf";

  //    //Please put the api code devided into 2-3 segments as shown below it helps the encoder to process the code seprately which helps in hidding the api code.
  //    //public static MasterKeyFunctionApp ="?code="+"hTDOcxDAQUpRovd3w8Ebgtz"+"jyqmAKq4EQzBYQ5M5"+"7vPTAzFue0k5tg==";

  //    public static FunctionAppUrl="https://crudoperationsasbestos.azurewebsites.net/api/";
  //    public static WebAppUrl="https://nyc-asbestos.azurewebsites.net";
  //    public static GetAccessToken = "https://asbestospoc.b2clogin.com/asbestospoc.onmicrosoft.com/user.read";
  //    public static ProcessPreparedRetail="https://a836-citypay.nyc.gov/citypay/retail/depatc-tst/processPreparedRetail";

  //    public static PaymentUnSuccessUrl="https://nyc-vc-qrgeneration.azurewebsites.net/api/FunctionApp/Payment?name=PaymentUnSuccessful";
  //    public static PaymentSuccessUrl="https://nyc-vc-qrgeneration.azurewebsites.net/api/FunctionApp/Payment?name=PaymentSuccessful";
  //    public static PaymentCancelUrl=this.WebAppUrl+"/paymentCancel/{certificate}/{applicateType}/{reqId}";
  //    public static PaymentConfirmation="https://nyc-vc-qrgeneration.azurewebsites.net/api/FunctionApp/Payment?name=PaymentConfirmation";
  //    public static EndpointADB2C="https://crudoperationsasbestos.azurewebsites.net/api";

  //#endregion DEV-Acuvate

  // //#region QA-NYC
  //   //#region B2C-login
  //   public static logoutUrl = "https://nycepb2cdev.b2clogin.com/tfp/nycepb2cdev.onmicrosoft.com/b2c_1_asbestoscert_signupsignin/oauth2/v2.0/logout?client_id=542d8d3d-3006-4ca1-bc88-b8a7193354f2&response_type=eyJpZCI6IjU3MGUyZDIyLTY5NTMtNDJiZS1iODg5LWNmMzU0ZjcyMWJiMSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&redirect_uri=http://localhost:3000&scope=openid%20offline_access";
  //   public static SingUpSignInName = "B2C_1_AsbestosCert_SignupSignIn";
  //   public static SingUpSignInFlow = "https://nycepb2cdev.b2clogin.com/nycepb2cdev.onmicrosoft.com/B2C_1_AsbestosCert_SignupSignIn";
  //   public static AuthorityDomain = "nycepb2cdev.b2clogin.com";
  //   public static ClientID = "542d8d3d-3006-4ca1-bc88-b8a7193354f2";

  //   //#endregion B2C-login


  //   //#region VC-QR
  //   public static IssueVCQR = 'https://nycasbestosqrgeneration-issuance-dev.azurewebsites.net/api/issuer/issuance-request';
  //   public static VerifyVCQR = 'https://nycasbestosqrgeneration-issuance-dev.azurewebsites.net/api/verifier/presentation-request';
  //   public static VerifyVCQRResponse = 'https://nycasbestosqrgeneration-issuance-dev.azurewebsites.net/api/verifier/presentation-response?id=';
  //   //#endregion VC-QR

  //   public static InvestigatorInitialAppendixA = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Investigator Initial -Appendix A.pdf";

  //   public static InvestigatorInitialAppendixB = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Investigator Initial-Appendix B.pdf";

  //   public static InvestigatorInitialAppendixD = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Investigator Initial-Appendix D.pdf";

  //   public static InvestigatorInitialAppendixE = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Investigator Initial-Appendix E.pdf";

  //   public static InvestigatorRenewalAppendixA = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Investigator Renewal-Appendix A.pdf";

  //   public static InvestigatorRenewalAppendixB = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Investigator Renewal-Appendix B.pdf";

  //   public static SupervisorAppendixC = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Supervisor-Appendix C.pdf";

  //   public static SupervisorAppendixF = "https://becacsstoragedev.blob.core.windows.net/appendixstaticfiles/Supervisor-Appendix F.pdf";

  //   public static FunctionAppUrl = "https://nycasbestoscertfunc-dev.azurewebsites.net/api/";
  //   public static WebAppUrl = "https://nycasbestoscert-dev.azurewebsites.net";
  //   public static ProcessPreparedRetail = "https://a836-citypay.nyc.gov/citypay/retail/depatc-tst/processPreparedRetail";
  //   public static GetAccessToken = "https://nycepb2cdev.b2clogin.com/nycepb2cdev.onmicrosoft.com/user.read";
  //   public static EndpointADB2C = "https://nycasbestoscertfunc-dev.azurewebsites.net/api";
  //   //#endregion QA-NYC

  //#region Prod-NYC
  //#region B2C-login
  public static logoutUrl = "https://nycepb2c.b2clogin.com/tfp/nycepb2c.onmicrosoft.com/B2C_1_TCUSignUpSignIn/oauth2/v2.0/logout?client_id=1c247412-38c7-4c17-964a-00f8443e8bbb&response_type=eyJpZCI6IjU3MGUyZDIyLTY5NTMtNDJiZS1iODg5LWNmMzU0ZjcyMWJiMSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&redirect_uri=https://nycasbestoscert.azurewebsites.net&scope=openid%20offline_access%22";
  public static SingUpSignInName = "B2C_1_TCUSignUpSignIn";
  public static SingUpSignInFlow = "https://nycepb2c.b2clogin.com/nycepb2c.onmicrosoft.com/B2C_1_TCUSignUpSignIn"
  public static AuthorityDomain = "nycepb2c.b2clogin.com";
  public static ClientID = "1c247412-38c7-4c17-964a-00f8443e8bbb";

  //#endregion B2C-login
  //#region VC-QR
  public static IssueVCQR = 'https://nycasbestosqrgeneration-issuance-prod.azurewebsites.net/api/issuer/issuance-request';
  public static VerifyVCQR = 'https://nycasbestosqrgeneration-issuance-prod.azurewebsites.net/api/verifier/presentation-request';
  public static VerifyVCQRResponse = 'https://nycasbestosqrgeneration-issuance-prod.azurewebsites.net/api/verifier/presentation-response?id=';
  //#endregion VC-QR

  public static InvestigatorInitialAppendixA = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Investigator Initial -Appendix A.pdf";

  public static InvestigatorInitialAppendixB = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Investigator Initial-Appendix B.pdf";

  public static InvestigatorInitialAppendixD = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Investigator Initial-Appendix D.pdf";

  public static InvestigatorInitialAppendixE = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Investigator Initial-Appendix E.pdf";

  public static InvestigatorRenewalAppendixA = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Investigator Renewal-Appendix A.pdf";

  public static InvestigatorRenewalAppendixB = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Investigator Renewal-Appendix B.pdf";

  public static SupervisorAppendixC = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Supervisor-Appendix C.pdf";

  public static SupervisorAppendixF = "https://bectcustorageprod.blob.core.windows.net/asbestosstaticfilesprod/Supervisor-Appendix F.pdf";

  //public static MasterKeyFunctionApp = "?code=H4NmOVibKBXTIWsJGbDQvsvIHADNVq4-n1ZOgzeqiO0-AzFuHP1xVw==";
  public static FunctionAppUrl = "https://nycasbestoscertfunc-prod.azurewebsites.net/api/";
  public static WebAppUrl = "https://nycasbestoscert.azurewebsites.net";
  //public static ProcessPreparedRetail = "https://a836-citypay.nyc.gov/citypay/retail/depatc/processPreparedRetail";
  public static ProcessPreparedRetail = "https://a836-citypay.nyc.gov/citypay/retail/depatc-tst/processPreparedRetail";
  public static GetAccessToken = "https://nycepb2c.b2clogin.com/nycepb2c.onmicrosoft.com/user.read";
  public static EndpointADB2C = "https://nycasbestoscertfunc-prod.azurewebsites.net/api";

  //#endregion Prod-NYC

  public static gmailLogoutUrl: string = "https://accounts.google.com/logout";
  public static verifyID = "https://dvs2.idware.net/api/v3/Verify";
  public static RulesAndRegulations = "https://www1.nyc.gov/assets/dep/downloads/pdf/air/asbestos/asbestos-rules-regulations-title-15.pdf";
  public static AzureRevoKeCredential = "https://portal.azure.com/#view/Microsoft_AAD_DecentralizedIdentity/CardMenuBlade/~/cardRevokeBlade/contract~/%7B%22id%22%3A%22OWEwYzc1NTItMzgzMy00NmM0LWJiYWMtOGJjN2Y5NjBlZTUybnlj%22%2C%22tenantId%22%3A%229a0c7552-3833-46c4-bbac-8bc7f960ee52%22%2C%22contractName%22%3A%22nyc%22%2C%22issuerId%22%3A%22eb0b2949-c8e7-e218-6c94-f9fdcbb00b9b%22%2C%22status%22%3A%22Enabled%22%2C%22issueNotificationEnabled%22%3Afalse%2C%22issueNotificationAllowedToGroupOids%22%3A%5B%5D%2C%22availableInVcDirectory%22%3Afalse%2C%22rulesFile%22%3A%22https%3A%2F%2Fnycstoragevc.blob.core.windows.net%2Fnycvc%2FVerifiedCredentialExpertRules.json%22%2C%22displayFile%22%3A%22https%3A%2F%2Fnycstoragevc.blob.core.windows.net%2Fnycvc%2FVerifiedCredentialExpertDisplay.json%22%2C%22rulesFileContainerMetadata%22%3A%7B%22container%22%3A%22nycvc%22%2C%22resourceGroup%22%3A%22NYCasbestos%22%2C%22resourceUrl%22%3A%22https%3A%2F%2Fnycstoragevc.blob.core.windows.net%2Fnycvc%2FVerifiedCredentialExpertRules.json%22%2C%22resourceName%22%3A%22nycstoragevc%22%2C%22subscriptionId%22%3A%22d4ee47cc-e8e4-4ce1-832e-064976ac8c00%22%7D%2C%22displayFileContainerMetadata%22%3A%7B%22container%22%3A%22nycvc%22%2C%22resourceGroup%22%3A%22NYCasbestos%22%2C%22resourceUrl%22%3A%22https%3A%2F%2Fnycstoragevc.blob.core.windows.net%2Fnycvc%2FVerifiedCredentialExpertDisplay.json%22%2C%22resourceName%22%3A%22nycstoragevc%22%2C%22subscriptionId%22%3A%22d4ee47cc-e8e4-4ce1-832e-064976ac8c00%22%7D%7D/created~/false/issuer~/%7B%22id%22%3A%22eb0b2949-c8e7-e218-6c94-f9fdcbb00b9b%22%2C%22tenantId%22%3A%229a0c7552-3833-46c4-bbac-8bc7f960ee52%22%2C%22issuerName%22%3A%22nyc%22%2C%22keyVaultUrl%22%3A%22https%3A%2F%2Fnyckeyvault.vault.azure.net%2F%22%2C%22status%22%3A%22Enabled%22%2C%22didModel%22%3A%7B%22did%22%3A%22did%3Aion%3AEiDZg2qmLiUd6aAcD3IsnY_P_Dmhbg1u-N7o999QtgSbfQ%3AeyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiI0ODU0Y2Q1OGQzMmU0ZTY0OWVhZThjODNlNmYwYmRkMXZjU2lnbmluZ0tleS1lYjBiMiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJjQXRDZUE1ZDdCSmFBVmFGS3dVUFRQbjB1aUJlbXdQTldHTm93dDVyZzBBIiwieSI6ImhrSnQ5ZkNrTzh0NEh4S3h4a1dBejRsbUdvaE00LVpZWno3dWk0U3k4SFUifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iLCJhc3NlcnRpb25NZXRob2QiXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XSwic2VydmljZXMiOlt7ImlkIjoibGlua2VkZG9tYWlucyIsInNlcnZpY2VFbmRwb2ludCI6eyJvcmlnaW5zIjpbImh0dHBzOi8vbnljc3RvcmFnZXZjLmNvbS8iXX0sInR5cGUiOiJMaW5rZWREb21haW5zIn0seyJpZCI6Imh1YiIsInNlcnZpY2VFbmRwb2ludCI6eyJpbnN0YW5jZXMiOlsiaHR0cHM6Ly9iZXRhLmh1Yi5tc2lkZW50aXR5LmNvbS92MS4wLzlhMGM3NTUyLTM4MzMtNDZjNC1iYmFjLThiYzdmOTYwZWU1MiJdfSwidHlwZSI6IklkZW50aXR5SHViIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlEdjQxUDZNSkl0QTVjR2tzTUI2amFtUEwyNkYzMC1EUDlnRFVGQ1pVUjY5QSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQ01LLUJ3NWZIaS10aXZidG83VWtlUFkxLVFpWS0tbi1abWhJQWFBSTVfOUEiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUExdWVnaUFlM1NHN0ZMV2FBdTNOLW5KZ3dxWnFKWDFrT2J6eElsQ2ZlZTJ3In19%22%2C%22signingKeys%22%3A%5B%22https%3A%2F%2Fnyckeyvault.vault.azure.net%2Fkeys%2FvcSigningKey-eb0b2949-c8e7-e218-6c94-f9fdcbb00b9b%2F4854cd58d32e4e649eae8c83e6f0bdd1%22%5D%2C%22recoveryKeys%22%3A%5B%22https%3A%2F%2Fnyckeyvault.vault.azure.net%2Fkeys%2FvcRecoveryKey-eb0b2949-c8e7-e218-6c94-f9fdcbb00b9b%2Fac25ed9b75064669906321999f867a85%22%5D%2C%22updateKeys%22%3A%5B%22https%3A%2F%2Fnyckeyvault.vault.azure.net%2Fkeys%2FvcUpdateKey-eb0b2949-c8e7-e218-6c94-f9fdcbb00b9b%2F562b2e4e05454eff830e17f9824a0b99%22%5D%2C%22encryptionKeys%22%3A%5B%5D%2C%22linkedDomainUrls%22%3A%5B%22https%3A%2F%2Fnycstoragevc.com%2F%22%5D%2C%22didDocumentStatus%22%3A%22published%22%7D%2C%22keyVaultMetadata%22%3A%7B%22subscriptionId%22%3A%22d4ee47cc-e8e4-4ce1-832e-064976ac8c00%22%2C%22resourceGroup%22%3A%22NYCasbestos%22%2C%22resourceName%22%3A%22NycKeyvault%22%2C%22resourceUrl%22%3A%22https%3A%2F%2Fnyckeyvault.vault.azure.net%2F%22%7D%2C%22linkedDomainsVerified%22%3Afalse%7D/tenant~/%7B%22id%22%3A%229a0c7552-3833-46c4-bbac-8bc7f960ee52%22%2C%22servicePrincipal%22%3A%2285d720d2-589f-4561-bccb-140dee8a9729%22%2C%22status%22%3A%22Enabled%22%2C%22clientRequestServicePrincipal%22%3A%22b4c9ae74-d8df-414f-a17c-42ae6e249dd1%22%7D";

  public static getAppendixToken = this.FunctionAppUrl + "GetBlobSASTokenForappendixstaticfiles";
  public static uploadFileToBlobUrl = this.FunctionAppUrl + "UploadFile";
  public static deleteFileFromBlobUrl = this.FunctionAppUrl + "DeleteFile";
  public static getMasterData = this.FunctionAppUrl + "GetMasterData";
  public static getRequestsByEmail = this.FunctionAppUrl + "GetRequestData";
  public static getUserProfile = this.FunctionAppUrl + "GetUserProfileData";
  public static getViewFormDetails = this.FunctionAppUrl + "GetUserAllRecords";
  public static checkuserStatus = this.FunctionAppUrl + "GetDataForQRCode";
  public static getCumulativeTotal = this.FunctionAppUrl + "GetCumulativeTotal";
  public static getDataForAdminDashboard = this.FunctionAppUrl + "GetDataForAdminBoard";
  public static upadateRequestsComment = this.FunctionAppUrl + "UpdateRequestStatusAndComment";
  public static qualifiedUserList = this.FunctionAppUrl + "QualifiedUsersList";
  public static UpdateQualifiedUserStatus = this.FunctionAppUrl + "UpdateQualifiedUserStatus";
  public static postExamDate = this.FunctionAppUrl + "UpdateExamRescheduleData";
  public static getUserDetailsForDuplicateRequest = this.FunctionAppUrl + "GetUserDetailsForDuplicateRequest";
  public static getDataForRenewalForm = this.FunctionAppUrl + "GetUserDetailsForRenewalRequest";
  public static SendMail = this.FunctionAppUrl + "SendNotificationEmail";
  public static GetListOfState = this.FunctionAppUrl + "GetStateListForDropDown";
  public static DataForGenerating_PDF = this.FunctionAppUrl + "GetDataForExamTicket";
  public static getUserRole = this.FunctionAppUrl + "GetUserAccessDetails";
  public static getAdminDetails = this.FunctionAppUrl + "GetAdminDetailsForEmailNotification";
  public static CheckLoginUserValidations = this.FunctionAppUrl + "GetIsApplicationInProcess";
  public static GetScanningStatus = this.FunctionAppUrl + "GetScanningStatus";
  public static SaveApplication = this.FunctionAppUrl + "SaveApplicationAsDraft";
  public static InsertApplication = this.FunctionAppUrl + "InsertApplicationAsDraft";
  public static SubmitApplication = this.FunctionAppUrl + "SubmitApplication";
  public static GetDraftRequestData = this.FunctionAppUrl + "GetDraftRequestData";
  public static GetUserRoles = this.FunctionAppUrl + "GetAllUserAccessDetails";
  public static CreateUpdateRoleDetails = this.FunctionAppUrl + "UpdateUserAccessDetails";
  public static IsUserExists = this.FunctionAppUrl + "IsUserExists";
  public static DiscardDraftRequest = this.FunctionAppUrl + "DiscardDraftRequest";
  public static GetResult = this.FunctionAppUrl + "GetDataOfExamResult"
  public static GetCertificateTypesForUser = this.FunctionAppUrl + "GetCertificateTypesForUser";
  public static GetFeeAmount = this.FunctionAppUrl + "GetFeeAmount";
  public static GetStatusOfCertificate = this.FunctionAppUrl + "GetStatusOfCertificate";
  public static GetAdminDataManagement = this.FunctionAppUrl + "GetAdminDataManagement";
  public static checkAvailableSlot = this.FunctionAppUrl + "GetExamSlotsCount";
  public static PaymentIntegration = this.FunctionAppUrl + "PaymentIntegration";
  public static ErrorLogger = this.FunctionAppUrl + "ErrorLogger";
  public static UpdateStatus = this.FunctionAppUrl + "UpdatePaymentAsCancelled";
  public static UpdateDocumentVerifiedStatus = this.FunctionAppUrl + "UpdateDocumentVerifiedStatus";
  public static UpdateDocumentStatus = this.FunctionAppUrl + "UpdateDocumentStatus";
  public static GetDocumentVerifiedStatus = this.FunctionAppUrl + "GetDocumentVerifiedStatus";
  public static UpdateAdminExamDataManagement = this.FunctionAppUrl + "UpdateAdminBlockedSlots";
  public static getLoggedCountOnPaticularSlot = this.FunctionAppUrl + "CheckAdminBlockedSlots";
  public static GetFeeStructure = this.FunctionAppUrl + "GetFeeStructure";
  public static UpdateCertificateStatus = this.FunctionAppUrl + "UpdateCertificateStatus";
  public static GetDMVStatusMessage = this.FunctionAppUrl + "GetDMVStatusMessages";
  public static GetDataForSupervisor = this.FunctionAppUrl + "GetDataForSupervisor";
  public static getAllPremises = this.FunctionAppUrl + "GetAllPremiseAddresses";
  public static InsertAttendanceLog = this.FunctionAppUrl + "InsertAttendanceLog";
  public static TriggerOCSEWebJob = this.FunctionAppUrl + "TriggerOCSEWebJob";
  public static TriggerExamWebJob = this.FunctionAppUrl + "TriggerExamWebJob";
  public static GetVerifiedData = this.FunctionAppUrl + "GetVerifiedData";
  public static InsertVerifiedInspectorDetails = this.FunctionAppUrl + "InsertVerifiedInspectorDetails";
  public static GetDataForAdminBoardWithSeachKeyword = this.FunctionAppUrl + "GetDataForAdminBoardWithSeachKeyword";;

  public static userName: string;
  public static userEmail: string;
  public static loginType: string;
  public static IsLoggedIn: boolean = false;
  public static accessToken = "";
  public static CurrentLogin: any;
  public static DMVFrontImagePattern = "DMVFront_<Email>_<Time>";
  public static DMVBackImagePattern = "DMVBack_<Email>_<Time>";
  public static PhotoImagePattern = "Photo_<Email>_<Time>";
  public static ReceiptImagePattern = "Receipt_<Email>_<Time>";
  public static SSCImagePattern = "SSC_<Email>_<Time>";
  public static OCSEImagePattern = "OCSE_<Email>_<Time>";
  public static NYSDOHImagePattern = "DOH_<Email>_<Time>";
  public static SignatureImagePattern = "Signature<Email>_<Time>";
  public static ReferenceImagePattern = "DOH_<Email>_<Time>";
  public static AppendicesImagePattern = "Appendix_<Email>_<Time>";
  public static CourseImagePattern = "Course_<Email>_<Time>";
  public static BackgroundImagePattern = "Background_<Email>_<Time>";
  public static ReasonImagePattern = "Reason_<Email>_<Time>";
  public static RequestChangeImagePattern = "Request_<Email>_<Time>";
  public static LicenseImagePattern = "License_<Email>_<Time>";

  public static SSC = "SSC";
  public static DMVFront = "DMVFront";
  public static DMVBack = "DMVBack";
  public static Photo = "Photo";
  public static Reference = "Reference";
  public static Signature = "Signature";
  public static Receipt = "Receipt";
  public static DYS = "DYS";
  public static Appendix = "Appendix";
  public static OCSE = "OCSE";
  public static Course = "Course";
  public static Background = "Background";
  public static Reason = "Reason";
  public static RequestChange = "RequestChange";
  public static License = "License";
  public static Exam = "Exam";

  //CertificateTypes
  public static HandlerCertificate = "Handler";
  public static HandlerRestrictedCertificate = "Handler Restricted";
  public static InvestigatorCertificate = "Investigator";
  public static InvestigatorRestrictedCertificate = "Investigator Restricted";
  public static SupervisorCertificate = "Supervisor";
  public static SupervisorRestrictedCertificate = "Supervisor Restricted";
  public static MasterTechCertificate = "Master Env Haz Remi Tech";

  //ApplicateTypes
  public static New = "Initial";
  public static Duplicate = "Duplicate";
  public static Renewal = "Renewal";


  //Roles
  public static UserRole = "";
  public static UserRoleClaim = "";

  //Roles
  public static tokenExp = "";

  //SectionTypes
  public static Personal = "Personal";
  public static Additional = "Additional";
  public static Documents = "Documents";

  //RequestTypes
  public static Submit = "Submit";
  public static Save = "Save";
  public static Next = "Next";

  //Messages
  public static CameraAccessMessage = "Please allow access for camera and try again!";
  public static RestrictMessage = "You cannot apply for this application or one application is still under process. Please edit that request from dashboard!";
  public static verifyMessage = "Certificate holder details are not matching. Please scan again with correct devices containing respective credentials.";

  public static TimeZone = "America/New_York";
}
