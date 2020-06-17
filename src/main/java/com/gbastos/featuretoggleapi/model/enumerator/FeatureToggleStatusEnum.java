package com.gbastos.featuretoggleapi.model.enumerator;

public enum FeatureToggleStatusEnum {
  ENABLED(1), ARCHIVED(0);

  private int status;

  private FeatureToggleStatusEnum(int status) {
    this.status = status;
  }

  public int getStatus() {
    return this.status;
  }

  public void setStatus(int status) {
    this.status = status;
  }
}
