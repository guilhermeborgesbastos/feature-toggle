package com.gbastos.featuretoggleapi.controller.request;

import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import com.gbastos.featuretoggleapi.validation.ValueOfEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class UserRequest {

  private Integer id;

  /** @see com.gbastos.featuretoggleapi.model.enumerator.RoleEnum */
  @NotNull(message = "The User's Role cannot be null.")
  @ValueOfEnum(enumClass = RoleEnum.class)
  private String role;

  private String name;

  @Email(message = "The email is not valid.")
  private String email;

  @ValueOfEnum(enumClass = UserStatusEnum.class)
  private String status;

  public static final class FieldName {
    public static final String ID = "user-id";
    public static final String EMAIL = "user-email";

    private FieldName() {}
  }
}
