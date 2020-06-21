package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.controller.response.UserResponse;
import com.gbastos.featuretoggleapi.model.Role;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import lombok.ToString;
import org.springframework.stereotype.Component;

/**
 * It provides ways of mapping User Request into User persistence entity and User entity into User
 * response model.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IAdapter
 */
@ToString
@Component
public class UserAdapter implements IAdapter<User, UserRequest, UserResponse> {

  /** {@inheritDoc} */
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

  /** {@inheritDoc} */
  @Override
  public UserResponse mapEntityToResponse(User entity) {
    return UserResponse.builder()
        .id(entity.getId())
        .name(entity.getName())
        .email(entity.getEmail())
        .role(entity.getRole())
        .status(entity.getStatus())
        .createdAt(entity.getCreatedAt())
        .build();
  }
}
