import { LogLevel, Configuration } from '@azure/msal-browser';
import { Constants } from './Constants/Constants';

export const b2cPolicies = {
     names: {
        signUpSignIn: Constants.SingUpSignInName,
        forgotPassword: "<Forgot Password Name - in the form of B2C_1_xxx>",
        editProfile: "<Edit Profile Name - in the form of B2C_1_xxx>"
    },
    authorities: {
        signUpSignIn: {
            authority: Constants.SingUpSignInFlow,
        },
        forgotPassword: {
            authority: "https://<AAD B2C Name>.b2clogin.com/<AAD B2C Name>.onmicrosoft.com/<Forgot Password Name - in the form of B2C_1_xxx>",
        },
        editProfile: {
            authority: "https://<AAD B2C Name>.b2clogin.com/<AAD B2C Name>.onmicrosoft.com/<Edit Profile Name - in the form of B2C_1_xxx>"
        }
    },
    authorityDomain: Constants.AuthorityDomain
 };


export const msalConfig: Configuration = {
    auth: {
        clientId: Constants.ClientID,
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
 }

export const protectedResources = {
  backendApi: {
    endpoint: Constants.EndpointADB2C,
    scopes: [Constants.EndpointADB2C],
  },
}
export const loginRequest = {
  scopes: []
};
