package com.gbastos.featuretoggleapi.controller.request;

import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import com.gbastos.featuretoggleapi.validation.ValueOfEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.*;

@Getter
@Setter
@ToString
public class SignInRequest {

  private Integer id;

  /** @see com.gbastos.featuretoggleapi.model.enumerator.RoleEnum */
  @NotNull(message = "The User's Role cannot be null.")
  @Min(value = 1, message = "The Role ID cannot be less than one.")
  @Max(value = 2, message = "The Role ID cannot be higher than two.")
  private Integer roleId;

  private String name;

  @Email(message = "The email is not valid.")
  private String email;

  @NotEmpty private String password;
}
