package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerFeaturesResponse;
import com.gbastos.featuretoggleapi.controller.response.FeatureResponse;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import lombok.ToString;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * It provides ways of mapping Customer's entity and request objects to Customer Feature Response.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IAdapter
 */
@ToString
@Component
public class CustomerFeaturesAdapter
    implements IAdapter<Customer, CustomerRequest, CustomerFeaturesResponse> {

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
  public Customer mapRequestToEntity(CustomerRequest request) {
    Customer entity = new Customer();
    entity.setId(request.getId());
    entity.setName(request.getName());
    return entity;
  }

  /** {@inheritDoc} */
  @Override
  public CustomerFeaturesResponse mapEntityToResponse(Customer entity) {
    List<FeatureResponse> featureResponses =
        entity.getCustomerFeatureToggles().stream()
            .map(
                customerFeatureToggle ->
                    mapToFeatureResponse(
                        customerFeatureToggle.getFeatureToggle(),
                        customerFeatureToggle.getStatus()))
            .collect(Collectors.toList());

    return CustomerFeaturesResponse.builder().features(featureResponses).build();
  }
}
