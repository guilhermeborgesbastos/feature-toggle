package com.gbastos.featuretoggleapi.model.enumerator;

public enum UserStatusEnum {
  DISABLED(2), ENABLED(1);

  private int status;

  private UserStatusEnum(int status) {
    this.status = status;
  }

  public int getStatus() {
    return this.status;
  }

  public void setStatus(int status) {
    this.status = status;
  }
}
