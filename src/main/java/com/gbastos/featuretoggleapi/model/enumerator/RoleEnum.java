package com.gbastos.featuretoggleapi.model.enumerator;

public enum RoleEnum {
  SUPER_ADMIN(1), PRODUCT_OWNER(2);

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
}
