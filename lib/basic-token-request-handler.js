import { AppAuthError, BasicQueryStringUtils, JQueryRequestor, TokenError, TokenResponse } from '@openid/appauth';
/**
 * The default token request handler.
 */
export class BasicTokenRequestHandler {
  constructor(requestor = new JQueryRequestor(), utils = new BasicQueryStringUtils()) {
    this.requestor = requestor;
    this.utils = utils;
  }
  isTokenResponse(response) {
    return response.error === undefined;
  }
  performRevokeTokenRequest(configuration, request) {
    let revokeTokenResponse = this.requestor.xhr({
      url: configuration.revocationEndpoint,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: this.utils.stringify(request.toStringMap()),
    });
    return revokeTokenResponse.then((response) => {
      return true;
    });
  }
  performTokenRequest(configuration, request) {
    let tokenResponse = this.requestor.xhr({
      url: configuration.tokenEndpoint,
      method: 'POST',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${request.clientId}:${request.extras.client_secret}`)}`,
      },
      data: this.utils.stringify(request.toStringMap()),
    });
    return tokenResponse.then((response) => {
      if (this.isTokenResponse(response)) {
        return new TokenResponse(response);
      } else {
        return Promise.reject(new AppAuthError(response.error, new TokenError(response)));
      }
    });
  }
}
