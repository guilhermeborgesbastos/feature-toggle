package com.gbastos.featuretoggleapi.model.enumerator;

/** It represents the possible Feature Toggle statuses. */
public enum FeatureToggleStatusEnum {
  ENABLED(2),
  ARCHIVED(1);

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
