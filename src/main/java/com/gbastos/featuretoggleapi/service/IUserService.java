package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface IUserService {

  void save(UserRequest user);

  Page<User> listAll(Pageable pageable);

  void update(int userId, UserRequest user) throws EntityNotFoundException;

  void delete(int userId) throws EntityNotFoundException;

  User findById(int userId);

  User findByEmail(String email);

  Boolean existsByEmail(String email);

  void enable(Integer userId) throws EntityNotFoundException;

  void disable(Integer userId) throws EntityNotFoundException;

  void changePassword(
          Integer targetUserId,
          String oldPassword,
          String newPassword,
          Set<RoleEnum> userAuthRoles,
      Integer userAuthId)
      throws EntityNotFoundException;
}
