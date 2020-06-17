package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.model.User;

public interface IUserSignInService {
  User signIn(User entity);
}
