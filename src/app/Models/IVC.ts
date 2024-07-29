export interface ICreateQR {
  expiry: number;
  id: string;
  pin: string;
  requestId: string;
  url: string;
}

export interface IVerifyQR {
  expiry: number;
  id: string;
  pin: string;
  requestId: string;
  url: string;
}


export interface IQRClaims {
  firstName: string;
  lastName: string;
  Address: string;
  Gender: string;
  Certificatenumber: string;
  certificate: string;
  loginUserEmailId: string;
}

export interface IQRClaimsstatus {
  certificateStatus: string;
}
