// src/services/auth.ts
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,

  ChangePasswordCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_REACT_APP_AWS_REGION!,
});

const CLIENT_ID = import.meta.env.VITE_REACT_APP_COGNITO_CLIENT_ID!;

export interface SignUpData {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface SignInData {
  usernameOrEmail: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export class AuthService {
  private static tokenKey = 'devgram_tokens';

  static async signUp(data: SignUpData) {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: data.username,
      Password: data.password,
      UserAttributes: [
        {
          Name: 'email',
          Value: data.email,
        },
        {
          Name: 'name',
          Value: data.fullName,
        },
      ],
    });

    return await client.send(command);
  }

  static async confirmSignUp(username: string, code: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
    });

    return await client.send(command);
  }

  static async signIn(data: SignInData): Promise<AuthTokens> {
    
    const authParams = {
      USERNAME: data.usernameOrEmail,
      PASSWORD: data.password,
    };

    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: authParams,
    });

    const response = await client.send(command);

    if (!response.AuthenticationResult) {
      throw new Error('Authentication failed');
    }

    const tokens: AuthTokens = {
      accessToken: response.AuthenticationResult.AccessToken!,
      refreshToken: response.AuthenticationResult.RefreshToken!,
      idToken: response.AuthenticationResult.IdToken!,
    };

    this.saveTokens(tokens);
    return tokens;
  }

  static saveTokens(tokens: AuthTokens) {
    localStorage.setItem(this.tokenKey, JSON.stringify(tokens));
  }

  static getTokens(): AuthTokens | null {
    const tokens = localStorage.getItem(this.tokenKey);
    return tokens ? JSON.parse(tokens) : null;
  }


  static async resendConfirmationCode(username: string) {
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: username,
    });

    return await client.send(command);
  }

  static async forgotPassword(username: string) {
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
    });

    return await client.send(command);
  }

  static async confirmForgotPassword(
    username: string,
    code: string,
    newPassword: string
  ) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
      Password: newPassword,
    });

    return await client.send(command);
  }

  static async changePassword(
    accessToken: string,
    oldPassword: string,
    newPassword: string
  ) {
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    });

    return await client.send(command);
  }



  static async getCurrentUser(accessToken: string) {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    return await client.send(command);
  }

  static async signOut(accessToken: string) {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await client.send(command);
    this.clearTokens();
  }



  static clearTokens() {
    localStorage.removeItem(this.tokenKey);
  }

  static isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!tokens?.accessToken;
  }

  static isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    });

    const response = await client.send(command);
    if (!response.AuthenticationResult) {
      throw new Error('Refresh failed');
    }

    return {
      accessToken: response.AuthenticationResult.AccessToken!,
      refreshToken: refreshToken, 
      idToken: response.AuthenticationResult.IdToken!,
    };
  }
}
