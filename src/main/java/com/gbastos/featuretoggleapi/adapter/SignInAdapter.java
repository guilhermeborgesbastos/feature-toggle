package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.SignInRequest;
import com.gbastos.featuretoggleapi.controller.response.SignInResponse;
import com.gbastos.featuretoggleapi.model.Role;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.UserPasswordHistory;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@ToString
@Component
public class SignInAdapter implements IAdapter<User, SignInRequest, SignInResponse> {

  @Autowired private PasswordEncoder passwordEncoder;

  @Override
  public User mapRequestToEntity(SignInRequest request) {
    User entity = new User();
    if (request.getId() != null) {
      entity.setId(request.getId());
    }
    entity.setName(request.getName());
    entity.setEmail(request.getEmail());
    String password = passwordEncoder.encode(request.getPassword());
    entity.setPassword(password);
    entity.setRole(new Role(request.getRoleId()));
    entity.setStatus(UserStatusEnum.valueOf(request.getStatus()));
    entity.setPasswordHistoric(new UserPasswordHistory(entity, password));
    return entity;
  }

  @Override
  public SignInResponse mapEntityToResponse(User dbModel) {
    return SignInResponse.builder()
        .id(dbModel.getId())
        .name(dbModel.getName())
        .email(dbModel.getEmail())
        .role(dbModel.getRole())
        .status(dbModel.getStatus())
        .createdAt(dbModel.getCreatedAt())
        .build();
  }
}
