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

@ToString
@Component
public class CustomerFeaturesAdapter
    implements IAdapter<Customer, CustomerRequest, CustomerFeaturesResponse> {

  private boolean isFeatureToggleActive(FeatureToggleStatusEnum status) {
    return FeatureToggleStatusEnum.ENABLED.equals(status);
  }

  private boolean isFeatureToggleExpired(LocalDateTime expiresOn) {
    return expiresOn != null && LocalDateTime.now().isAfter(expiresOn);
  }

  @Override
  public Customer mapRequestToEntity(CustomerRequest request) {
    Customer entity = new Customer();
    entity.setId(request.getId());
    entity.setName(request.getName());
    return entity;
  }

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

  @Override
  public CustomerFeaturesResponse mapEntityToResponse(Customer dbModel) {
    List<FeatureResponse> features =
        dbModel.getCustomerFeatureToggles().stream()
            .map(f -> mapToFeatureResponse(f.getFeatureToggle(), f.getStatus()))
            .collect(Collectors.toList());

    return CustomerFeaturesResponse.builder().features(features).build();
  }
}
