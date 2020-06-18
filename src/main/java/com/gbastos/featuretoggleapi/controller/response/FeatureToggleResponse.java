package com.gbastos.featuretoggleapi.controller.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FeatureToggleResponse {
  private Integer id;
  private String displayName;
  private String technicalName;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
  private LocalDateTime expiresOn;

  private String description;
  private Boolean inverted;
}
