package com.gbastos.featuretoggleapi.model.enumerator;

/** It represents the possible Role types. */
public enum RoleEnum {
  SUPER_ADMIN(1),
  PRODUCT_OWNER(2);

  private int role;

  private RoleEnum(int status) {
    this.role = status;
  }

  public int getRoleId() {
    return this.role;
  }

  public void setRoleId(int role) {
    this.role = role;
  }

  public static RoleEnum fromString(String status) {
    for (RoleEnum roleEnum : RoleEnum.values()) {
      if (roleEnum.name().equalsIgnoreCase(status)) {
        return roleEnum;
      }
    }
    return null;
  }
}
