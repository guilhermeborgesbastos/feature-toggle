package com.gbastos.featuretoggleapi.annotation;

import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.HashSet;
import java.util.Set;

/**
 * This class is an annotation resolver that interrogates the request's token in order to inject
 * into the @Controller a collection with the roles of the token's owner.
 *
 * @author Guilherme Borges Bastos
 */
@Component
public class OAuthUserRolesResolver implements HandlerMethodArgumentResolver {

  private Set<RoleEnum> retrieveJwtUserRole(Authentication authentication) {
    Set<RoleEnum> roles = new HashSet<>();
    authentication
        .getAuthorities()
        .forEach(authority -> roles.add(RoleEnum.valueOf(authority.getAuthority())));
    return roles;
  }

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.getParameterAnnotation(OAuthUserRoles.class) != null;
  }

  @Override
  public Object resolveArgument(
      MethodParameter parameter,
      ModelAndViewContainer mavContainer,
      NativeWebRequest userId,
      WebDataBinderFactory binderFactory)
      throws Exception {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return retrieveJwtUserRole(auth);
  }
}
