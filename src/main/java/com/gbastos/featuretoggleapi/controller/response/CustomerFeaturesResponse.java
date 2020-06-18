package com.gbastos.featuretoggleapi.controller.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CustomerFeaturesResponse {
  private List<FeatureResponse> features;
}
