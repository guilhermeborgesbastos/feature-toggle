package com.gbastos.featuretoggleapi.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
public class Customer extends AbstractEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NonNull private String name;

  @JsonManagedReference
  @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  Set<CustomerFeatureToggle> featureToggles = new HashSet<>();

  public void setFeatureToggles(CustomerFeatureToggle newCustomerFeatureToggle) {
    this.getFeatureToggles().add(newCustomerFeatureToggle);
  }
}
