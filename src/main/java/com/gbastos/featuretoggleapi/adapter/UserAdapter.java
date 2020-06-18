package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.controller.response.UserResponse;
import com.gbastos.featuretoggleapi.model.Role;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@ToString
@Component
public class UserAdapter implements IAdapter<User, UserRequest, UserResponse> {

  @Autowired private PasswordEncoder passwordEncoder;

  @Override
  public User mapRequestToEntity(UserRequest request) {
    User entity = new User();
    if (request.getId() != null) {
      entity.setId(request.getId());
    }
    entity.setName(request.getName());
    entity.setEmail(request.getEmail());
    entity.setRole(new Role(request.getRoleId()));
    entity.setStatus(UserStatusEnum.valueOf(request.getStatus()));
    return entity;
  }

  @Override
  public UserResponse mapEntityToResponse(User dbModel) {
    return UserResponse.builder()
        .id(dbModel.getId())
        .name(dbModel.getName())
        .email(dbModel.getEmail())
        .role(dbModel.getRole())
        .status(dbModel.getStatus())
        .createdAt(dbModel.getCreatedAt())
        .build();
  }
}
