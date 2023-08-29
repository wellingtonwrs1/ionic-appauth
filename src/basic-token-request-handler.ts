import {
  AppAuthError,
  AuthorizationServiceConfiguration,
  BasicQueryStringUtils,
  JQueryRequestor,
  QueryStringUtils,
  Requestor, RevokeTokenRequest, TokenError, TokenErrorJson, TokenRequest,
  TokenRequestHandler, TokenResponse, TokenResponseJson
} from '@openid/appauth';

/**
 * The default token request handler.
 */
export class BasicTokenRequestHandler implements TokenRequestHandler {
  constructor(
      public readonly requestor: Requestor = new JQueryRequestor(),
      public readonly utils: QueryStringUtils = new BasicQueryStringUtils()) {}

  private isTokenResponse(response: TokenResponseJson|
                          TokenErrorJson): response is TokenResponseJson {
    return (response as TokenErrorJson).error === undefined;
  }

  performRevokeTokenRequest(
      configuration: AuthorizationServiceConfiguration,
      request: RevokeTokenRequest): Promise<boolean> {
    let revokeTokenResponse = this.requestor.xhr<boolean>({
      url: configuration.revocationEndpoint,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: this.utils.stringify(request.toStringMap())
    });

    return revokeTokenResponse.then(response => {
      return true;
    });
  }

  performTokenRequest(configuration: AuthorizationServiceConfiguration, request: TokenRequest): Promise<TokenResponse> {
    let tokenResponse = this.requestor.xhr<TokenResponseJson|TokenErrorJson>({
      url: configuration.tokenEndpoint,
      method: 'POST',
      dataType: 'json',  // adding implicit dataType
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${request.clientId}:${request.extras.client_secret}`)}`
      },
      data: this.utils.stringify(request.toStringMap())
    });

    return tokenResponse.then(response => {
      if (this.isTokenResponse(response)) {
        return new TokenResponse(response);
      } else {
        return Promise.reject<TokenResponse>(
            new AppAuthError(response.error, new TokenError(response)));
      }
    });
  }
}
