package com.gbastos.featuretoggleapi.controller.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FeatureResponse {
  private Integer id;
  private String name;
  private boolean active;
  private boolean inverted;
  private boolean expired;
}
