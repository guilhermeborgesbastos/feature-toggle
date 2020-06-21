package com.gbastos.featuretoggleapi.internationalization;

import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * It provides the capability of internationalizing the response messages for the client based on
 * their preferred language. In the case of a not supported language, the en-US in going to be used
 * as default.
 */
public class CustomLocaleResolver extends AcceptHeaderLocaleResolver implements WebMvcConfigurer {
  List<Locale> LOCALES = Arrays.asList(new Locale("en"), new Locale("pt"));

  @Override
  public Locale resolveLocale(HttpServletRequest request) {
    String headerLang = request.getHeader("Accept-Language");
    return headerLang == null || headerLang.isEmpty()
        ? Locale.getDefault()
        : Locale.lookup(Locale.LanguageRange.parse(headerLang), LOCALES);
  }

  @Bean
  public ResourceBundleMessageSource messageSource() {
    ResourceBundleMessageSource resource = new ResourceBundleMessageSource();
    resource.setBasename("messages");
    resource.setDefaultEncoding("UTF-8");
    resource.setUseCodeAsDefaultMessage(true);
    return resource;
  }
}
