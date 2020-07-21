package com.gbastos.featuretoggleapi.model;

import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = { "customerId", "featureToggleId" })
@Entity(name = "CustomerFeatureToggle")
@Table(name = "customer_feature_toggle")
public class CustomerFeatureToggle implements Serializable {

  @EmbeddedId private CustomerFeatureToggleId id;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("customerId")
  private Customer customer;

  @ManyToOne(fetch = FetchType.LAZY)
  @MapsId("featureToggleId")
  private FeatureToggle featureToggle;

  @Enumerated(EnumType.ORDINAL)
  @Column(name = "status", length = 1)
  private FeatureToggleStatusEnum status;

  public CustomerFeatureToggle(Customer customer, FeatureToggle featureToggle) {
    this.customer = customer;
    this.featureToggle = featureToggle;
    this.id = new CustomerFeatureToggleId(customer.getId(), featureToggle.getId());
  }

  public CustomerFeatureToggle(
      Customer customer, FeatureToggle featureToggle, FeatureToggleStatusEnum status) {
    this.customer = customer;
    this.featureToggle = featureToggle;
    this.status = status;
    this.id = new CustomerFeatureToggleId(customer.getId(), featureToggle.getId());
  }
}
