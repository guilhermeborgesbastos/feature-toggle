package com.gbastos.featuretoggleapi.controller.request;

import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import com.gbastos.featuretoggleapi.validation.ValueOfEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class SignInRequest {

  private Integer id;

  @NotNull(message = "The User's Role cannot be null.")
  @Min(value = 1, message = "The Role ID cannot be less than one.")
  private Integer roleId;

  private String name;

  @Email(message = "The Email should be valid.")
  private String email;

  @NotEmpty private String password;

  @ValueOfEnum(enumClass = UserStatusEnum.class)
  private String status;

  public static final class FieldName {
    public static final String ID = "userId";
    public static final String EMAIL = "email";

    private FieldName() {}
  }
}
