package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.FeatureToggleResponse;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import lombok.ToString;
import org.springframework.stereotype.Component;

@ToString
@Component
public class FeatureToggleAdapter
    implements IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> {

  @Override
  public FeatureToggle mapRequestToEntity(FeatureToggleRequest request) {
    FeatureToggle entity = new FeatureToggle();
    entity.setId(request.getId());
    entity.setDisplayName(request.getDisplayName());
    entity.setTechnicalName(request.getTechnicalName());
    entity.setDescription(request.getDescription());
    entity.setInverted(request.getInverted());
    entity.setExpiresOn(request.getExpiresOn());
    return entity;
  }

  @Override
  public FeatureToggleResponse mapEntityToResponse(FeatureToggle dbModel) {
    return FeatureToggleResponse.builder()
        .id(dbModel.getId())
        .displayName(dbModel.getDisplayName())
        .technicalName(dbModel.getTechnicalName())
        .description(dbModel.getDescription())
        .inverted(dbModel.getInverted())
        .expiresOn(dbModel.getExpiresOn())
        .build();
  }
}
