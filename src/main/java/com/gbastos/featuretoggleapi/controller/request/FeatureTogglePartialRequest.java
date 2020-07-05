package com.gbastos.featuretoggleapi.controller.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@ToString
public class FeatureTogglePartialRequest {

  private Integer id;

  private String displayName;

  private String technicalName;

  private LocalDateTime expiresOn;

  private String description;

  private Boolean inverted;

  private Set<Integer> customerIds;

  public static final class FieldName {
    public static final String ID = "feature-toggle-id";

    private FieldName() {}
  }
}
