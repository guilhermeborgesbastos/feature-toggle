package com.gbastos.featuretoggleapi.model;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@EqualsAndHashCode
public class CustomerFeatureToggleId implements Serializable {
  private Customer customer;
  private FeatureToggle featureToggle;
}
