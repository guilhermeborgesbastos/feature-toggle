package com.gbastos.featuretoggleapi.annotation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Map;

/**
 * This class is a annotation resolver that interrogates the request's token in order to inject into
 * the @Controller as an integer parameter the user_id of the token's owner.
 *
 * @author Guilherme Borges Bastos
 */
@Component
public class OAuthUserIdResolver implements HandlerMethodArgumentResolver {

  private final TokenStore tokenStore;

  @Autowired
  public OAuthUserIdResolver(TokenStore tokenStore) {
    this.tokenStore = tokenStore;
  }

  private Map<String, Object> getAdditionalInfo(Authentication authentication) {
    OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();
    OAuth2AccessToken accessToken = tokenStore.readAccessToken(details.getTokenValue());
    return accessToken.getAdditionalInformation();
  }

  private Integer retrieveJwtUserId(Authentication authentication) {
    Map<String, Object> additionalInfo = getAdditionalInfo(authentication);
    return (int) additionalInfo.get("user_id");
  }

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.getParameterAnnotation(OAuthUserId.class) != null;
  }

  @Override
  public Object resolveArgument(
      MethodParameter parameter,
      ModelAndViewContainer mavContainer,
      NativeWebRequest userId,
      WebDataBinderFactory binderFactory)
      throws Exception {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return retrieveJwtUserId(auth);
  }
}
