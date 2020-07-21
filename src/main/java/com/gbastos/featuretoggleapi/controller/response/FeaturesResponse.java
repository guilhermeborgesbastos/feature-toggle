package com.gbastos.featuretoggleapi.controller.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FeaturesResponse {
  private List<FeatureResponse> features;
}
