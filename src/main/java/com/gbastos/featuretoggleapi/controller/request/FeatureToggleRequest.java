package com.gbastos.featuretoggleapi.controller.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@ToString
public class FeatureToggleRequest {

  private Integer id;

  private String displayName;

  @NotEmpty(message = "Please, provide a valid technical name")
  private String technicalName;

  @Future(message = "Please, provide a valid date in the future")
  private LocalDateTime expiresOn;

  private String description;

  private Boolean inverted;

  private Set<Integer> customerIds;

  public static final class FieldName {
    public static final String ID = "feature-toggle-id";

    private FieldName() {}
  }
}
