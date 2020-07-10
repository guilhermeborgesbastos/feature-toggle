package com.gbastos.featuretoggleapi.config.security;

import com.gbastos.featuretoggleapi.exception.handler.CustomAccessDeniedHandler;
import com.gbastos.featuretoggleapi.exception.handler.CustomAuthenticationEntryPoint;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {

  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

  public ResourceServerConfiguration(
      CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
  }

  @Override
  public void configure(ResourceServerSecurityConfigurer resources) {
    resources.resourceId("v1");
  }

  @Override
  public void configure(HttpSecurity http) throws Exception {
    http.sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .antMatcher("/v1/**")
            .authorizeRequests()
            .antMatchers("/v1/signin/**")
            .permitAll()
            .antMatchers("/v1/feature/**")
            .hasAnyAuthority(RoleEnum.SUPER_ADMIN.name(), RoleEnum.PRODUCT_OWNER.name())
            .antMatchers("/v1/features/**")
            .hasAnyAuthority(RoleEnum.SUPER_ADMIN.name(), RoleEnum.PRODUCT_OWNER.name())
            .antMatchers("/v1/user/**")
            .hasAnyAuthority(RoleEnum.SUPER_ADMIN.name(), RoleEnum.PRODUCT_OWNER.name())
        .antMatchers("/v1/**")
        .authenticated()
        .anyRequest()
        .authenticated()
        .and()
        .exceptionHandling()
        .authenticationEntryPoint(customAuthenticationEntryPoint)
        .accessDeniedHandler(new CustomAccessDeniedHandler());
  }
}
