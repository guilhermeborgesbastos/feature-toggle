package com.gbastos.featuretoggleapi.config.security;

import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class CustomTokenEnhancer implements TokenEnhancer {

  @Autowired UserRepository userRepository;

  @Override
  public OAuth2AccessToken enhance(
      OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
    Map<String, Object> additionalInfo = new HashMap<>();

    String username = authentication.getName();
    Optional<User> user = userRepository.findByEmail(username);

    if (user.isPresent()) {
      additionalInfo.put("user_id", user.get().getId());
      ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
    }

    return accessToken;
  }
}
