package com.gbastos.featuretoggleapi.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import java.util.Arrays;

@Configuration
@EnableAuthorizationServer
public class OAuthConfiguration extends AuthorizationServerConfigurerAdapter {

  private final AuthenticationManager authenticationManager;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  @Qualifier("userSignInService")
  private final UserDetailsService userDetailsService;

  @Autowired private TokenStore tokenStore;

  @Value("${jwt.clientId:gbastos-my-interview}")
  private String clientId;

  @Value("${jwt.client-secret:secret}")
  private String clientSecret;

  @Value("${jwt.signing-key:123}")
  private String jwtSigningKey;

  @Value("${jwt.accessTokenValidititySeconds:43200}") // 12 hours
  private int accessTokenValiditySeconds;

  @Value("${jwt.authorizedGrantTypes:password,authorization_code,refresh_token}")
  private String[] authorizedGrantTypes;

  @Value("${jwt.refreshTokenValiditySeconds:2592000}") // 30 days
  private int refreshTokenValiditySeconds;

  public OAuthConfiguration(
      AuthenticationManager authenticationManager,
      PasswordEncoder passwordEncoder,
      UserDetailsService userSignInService) {
    this.authenticationManager = authenticationManager;
    this.passwordEncoder = passwordEncoder;
    this.userDetailsService = userSignInService;
  }

  @Override
  public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
    clients
        .inMemory()
        .withClient(clientId)
        .secret(passwordEncoder.encode(clientSecret))
        .accessTokenValiditySeconds(accessTokenValiditySeconds)
        .refreshTokenValiditySeconds(refreshTokenValiditySeconds)
        .authorizedGrantTypes(authorizedGrantTypes)
        .scopes("read", "write")
        .resourceIds("v1");
  }

  @Override
  public void configure(final AuthorizationServerEndpointsConfigurer endpoints) {
    TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
    tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));

    endpoints
        .tokenStore(this.tokenStore)
        .tokenEnhancer(tokenEnhancerChain)
        .accessTokenConverter(accessTokenConverter())
        .userDetailsService(userDetailsService)
        .authenticationManager(authenticationManager);
  }

  @Bean
  public TokenEnhancer tokenEnhancer() {
    return new CustomTokenEnhancer();
  }

  @Bean
  JwtAccessTokenConverter accessTokenConverter() {
    JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
    return converter;
  }
}
