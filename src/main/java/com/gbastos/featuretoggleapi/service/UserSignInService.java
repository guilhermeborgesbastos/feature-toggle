package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class UserSignInService implements UserDetailsService, IUserSignInService {

  @Autowired private UserRepository userRepository;

  @Override
  public User signIn(User entity) {
    return userRepository.save(entity);
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username).get();
    GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getTitle());
    return new org.springframework.security.core.userdetails.User(
        user.getEmail(), user.getPassword(), Arrays.asList(authority));
  }
}
