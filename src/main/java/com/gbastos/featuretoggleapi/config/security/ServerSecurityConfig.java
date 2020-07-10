package com.gbastos.featuretoggleapi.config.security;

import com.gbastos.featuretoggleapi.exception.handler.CustomAccessDeniedHandler;
import com.gbastos.featuretoggleapi.exception.handler.CustomAuthenticationEntryPoint;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class ServerSecurityConfig extends WebSecurityConfigurerAdapter {

  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

  private final UserDetailsService userDetailsService;

  @Autowired
  public ServerSecurityConfig(
      CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
      @Qualifier("userSignInService") UserDetailsService userDetailsService) {
    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    this.userDetailsService = userDetailsService;
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder());
    provider.setUserDetailsService(userDetailsService);
    return provider;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
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
