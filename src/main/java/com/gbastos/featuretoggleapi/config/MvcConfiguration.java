package com.gbastos.featuretoggleapi.config;

import com.gbastos.featuretoggleapi.annotation.OAuthUserIdResolver;
import com.gbastos.featuretoggleapi.annotation.OAuthUserRolesResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableWebMvc
public class MvcConfiguration implements WebMvcConfigurer {

  @Autowired private TokenStore tokenStore;

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
    argumentResolvers.add(new OAuthUserIdResolver(tokenStore));
    argumentResolvers.add(new OAuthUserRolesResolver());
  }
}
