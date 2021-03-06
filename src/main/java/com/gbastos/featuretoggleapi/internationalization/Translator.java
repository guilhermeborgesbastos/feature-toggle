package com.gbastos.featuretoggleapi.internationalization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * It provides an static method to fetch messages based on their key-pair of message-key and
 * language.
 */
@Component
public class Translator {

  private static ResourceBundleMessageSource messageSource;

  @Autowired
  Translator(ResourceBundleMessageSource messageSource) {
    Translator.messageSource = messageSource;
  }

  public static String toLocale(String msgCode) {
    Locale locale = LocaleContextHolder.getLocale();
    messageSource.setDefaultEncoding("ISO-8859-1");
    return messageSource.getMessage(msgCode, null, locale);
  }
}
