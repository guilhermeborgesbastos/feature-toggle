package com.gbastos.featuretoggleapi.model;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class CustomerFeatureToggleId implements Serializable {

  @Column(name = "customer_id")
  private Integer customerId;

  @Column(name = "feature_toggle_id")
  private Integer featureToggleId;
}
