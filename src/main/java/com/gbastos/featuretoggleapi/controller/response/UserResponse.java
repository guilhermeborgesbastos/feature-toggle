package com.gbastos.featuretoggleapi.controller.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gbastos.featuretoggleapi.model.Role;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Builder
@ToString
public class UserResponse {
  private Integer id;
  private Role role;
  private String name, email;
  private UserStatusEnum status;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
  private LocalDateTime createdAt;
}
