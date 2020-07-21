package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.FeaturesRequest;
import com.gbastos.featuretoggleapi.controller.response.FeaturesResponse;
import com.gbastos.featuretoggleapi.controller.response.FeatureResponse;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import lombok.ToString;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * It provides ways of mapping Feature Toggle's entities and request objects to Features Response.
 */
@ToString
@Component
public class FeaturesAdapter
    implements ICollectionAdapter<FeatureToggle, FeaturesRequest, FeaturesResponse> {

  /**
   * It verifies if the Feature Toggle is active or not.
   *
   * @param status the feature toggle's status
   * @return true in case of active feature toggle.
   */
  private boolean isFeatureToggleActive(FeatureToggleStatusEnum status) {
    return FeatureToggleStatusEnum.ENABLED.equals(status);
  }

  /**
   * It verifies if the Feature Toggle is expired or not.
   *
   * @param expiresOn the feature toggle expiration date.
   * @return true in case of feature toggle is expired.
   */
  private boolean isFeatureToggleExpired(LocalDateTime expiresOn) {
    return expiresOn != null && LocalDateTime.now().isAfter(expiresOn);
  }

  /**
   * It maps Feature Toggle persistence entity into a Feature Response model.
   *
   * @param feature the Feature Toggle entity.
   * @param status the status of the Feature Toggle for an specific Customer.
   * @return the Feature Response model object.
   */
  private FeatureResponse mapToFeatureResponse(
      FeatureToggle feature, FeatureToggleStatusEnum status) {
    return FeatureResponse.builder()
        .id(feature.getId())
        .name(feature.getDisplayName())
        .active(isFeatureToggleActive(status))
        .inverted(feature.getInverted())
        .expired(isFeatureToggleExpired(feature.getExpiresOn()))
        .build();
  }

  /** {@inheritDoc} */
  @Override
  public FeaturesResponse mapEntityToResponse(List<FeatureToggle> entities) {
    List<FeatureResponse> featureResponses =
            entities.stream().map(featureToggle -> mapToFeatureResponse(featureToggle, FeatureToggleStatusEnum.ENABLED))
            .collect(Collectors.toList());

    return FeaturesResponse.builder().features(featureResponses).build();
  }
}
