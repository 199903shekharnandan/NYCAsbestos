export interface IDuplicateForm {
  SSN: string;
  DMV: string;
  lastName: string;
  firstName: string;
  middleName: string;
  address: string;
  apartment: string;
  city: string;
  state: any;
  zipCode: string;
  postOnWebsite: string;
  feet: string;
  inches: string;
  weight: string;
  birthDay: any;
  gender: string;
  homeNumber: string;
  workNumber: string;
  SSNValidation: string;
  IsValidated: boolean;
  employerName: string;
  employerAddress: string;
  employerCity: string;
  employerState: any;
  employerZipCode: string;
  employmentStartDate: string;
  CertificateDuplicate: any;
  expiryDateDuplicate: any;
  errorCertificateDuplicate:boolean;
  errorExpiryDateDuplicate:boolean;
  IsGuilty: string;
  IsDisciplined: string;
  IsCriminalCharged: string;
  hasHandlerCertificate: string;
  hasMisconductCharges: string;
  hasHandlerCertificateOtherState: string;
  certificateExpiryDate: any;
  oldCertificate: string;
  certificateState: any;
  certificateExpiryDateOtherState: any;
  schoolName: string;
  schoolAddress: string;
  schoolCity: string;
  schoolState: any;
  schoolZipCode: string;
  attachmentPhoto: any;
  attachmentPhotoLinks: any;
  attachmentReason: any;
  attachmentReasonLinks: any;
  attachmentRequestChange: any;
  attachmentRequestChangeLinks: any;
  attachmentSignature: any;
  attachmentSignatureLinks: any;
  base64Photo: any;
  showPersonalInfo: boolean;
  showOtherInfo: boolean;
  showRequiredDoc: boolean;
  openCapturePhoto: boolean;
  errorSSN: boolean;
  errorDMV: boolean;
  errorLastName: boolean;
  errorFirstName: boolean;
  errorAddress: boolean;
  errorCity: boolean;
  errorState: boolean;
  errorZipCode: boolean;
  errorBirthDay: boolean;
  errorGender: boolean;
  errorFeet: boolean;
  errorInches: boolean;
  errorWeight: boolean;
  errorHomeNumber: boolean;
  errorWorkNumber: boolean;
  errorSchoolName: boolean;
  errorIsGuilty: boolean;
  errorIsDisciplined: boolean;
  errorIsCriminalCharged: boolean;
  errorHasMisConductCharges: boolean;
  errorHasHandlerCertificate: boolean;
  errorOldCertificate: boolean;
  errorCertificateExpiryDate: boolean;
  errorHasHandlerCertificateOtherState: boolean;
  errorCertificateState: boolean;
  errorCertificateExpiryDateOtherState: boolean;
  errorReason: boolean;
  errorRequestChange: boolean;
  errorPhoto: boolean;
  errorSignature: boolean;
  isLoading: boolean;
  showPaymentGateway: boolean;
  showSummary: boolean;
  stateTypeValues: any[];
  selectedState: any;
  selectedEmployerState: any;
  selectedSchoolState: any;
  selectedCertificateState: any;
  hasCertificate: boolean;
  loaderMessage: any;
  draftReqId: any;
  feeAmount: any;
  IsPaymentComplete: boolean;
}
export interface IPropsDuplicateForm {
  parameters: any;
}