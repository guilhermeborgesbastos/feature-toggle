package com.gbastos.featuretoggleapi.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
public class Customer extends AbstractEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NonNull private String name;

  @JsonManagedReference
  @OneToMany(
      mappedBy = "customer",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<CustomerFeatureToggle> customerFeatureToggles = new ArrayList<>();

  public void removeFeatureToggle(FeatureToggle featureToggle) {
    CustomerFeatureToggle customerFeatureToggle =
            new CustomerFeatureToggle(this, featureToggle, FeatureToggleStatusEnum.ENABLED);
    customerFeatureToggles.remove(customerFeatureToggle);
    featureToggle.getCustomerFeatureToggles().remove(customerFeatureToggle);
  }

  public void addFeatureToggle(FeatureToggle featureToggle) {
    CustomerFeatureToggle customerFeatureToggle =
        new CustomerFeatureToggle(this, featureToggle, FeatureToggleStatusEnum.ENABLED);
    customerFeatureToggles.add(customerFeatureToggle);
    featureToggle.getCustomerFeatureToggles().add(customerFeatureToggle);
  }
}
