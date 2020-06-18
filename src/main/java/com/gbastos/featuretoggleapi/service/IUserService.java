package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;

import java.util.Set;

public interface IUserService {

  void save(UserRequest user);

  void update(int userId, UserRequest user) throws EntityNotFoundException;

  void delete(int userId) throws EntityNotFoundException;

  User findById(int userId);

  void changePassword(
      Integer targetUserId,
      String oldPassword,
      String newPassword,
      Set<RoleEnum> userAuthRoles,
      Integer userAuthId)
      throws EntityNotFoundException;
}
