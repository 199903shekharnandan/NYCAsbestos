export interface IverificationHistory{
    applicantFirstName:string,
    applicantMiddleName:string,
    applicantLastName:string,
    certificateNumber:string,
    certificateType:string,
    expiryDate:Date,
    verifiedDate:Date,
    inspectorName:string,
    verifierName:string,
    isVerified:boolean,
    jobID:string,

    applicationEndDate:Date,

}