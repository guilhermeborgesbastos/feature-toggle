package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.FeatureToggleResponse;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import lombok.ToString;
import org.springframework.stereotype.Component;

/**
 * It provides ways of mapping Feature Toggle Request into Feature Toggle persistence entity and Feature Toggle entity
 * into Feature Toggle response model.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IAdapter
 */
@ToString
@Component
public class FeatureToggleAdapter
    implements IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> {

  /** {@inheritDoc} */
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

  /** {@inheritDoc} */
  @Override
  public FeatureToggleResponse mapEntityToResponse(FeatureToggle entity) {
    return FeatureToggleResponse.builder()
        .id(entity.getId())
        .displayName(entity.getDisplayName())
        .technicalName(entity.getTechnicalName())
        .description(entity.getDescription())
        .inverted(entity.getInverted())
        .expiresOn(entity.getExpiresOn())
        .build();
  }
}
