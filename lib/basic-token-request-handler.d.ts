import {
  AuthorizationServiceConfiguration,
  QueryStringUtils,
  Requestor,
  RevokeTokenRequest,
  TokenRequest,
  TokenRequestHandler,
  TokenResponse,
} from '@openid/appauth';
/**
 * The default token request handler.
 */
export declare class BasicTokenRequestHandler implements TokenRequestHandler {
  readonly requestor: Requestor;
  readonly utils: QueryStringUtils;
  constructor(requestor?: Requestor, utils?: QueryStringUtils);
  private isTokenResponse;
  performRevokeTokenRequest(configuration: AuthorizationServiceConfiguration, request: RevokeTokenRequest): Promise<boolean>;
  performTokenRequest(configuration: AuthorizationServiceConfiguration, request: TokenRequest): Promise<TokenResponse>;
}
