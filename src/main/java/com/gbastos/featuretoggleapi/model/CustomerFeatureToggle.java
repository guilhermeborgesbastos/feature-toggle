package com.gbastos.featuretoggleapi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@IdClass(CustomerFeatureToggleId.class)
public class CustomerFeatureToggle {

  @Id @OneToOne @NonNull @JsonBackReference private Customer customer;

  @Id @OneToOne @NonNull private FeatureToggle featureToggle;

  @Enumerated(EnumType.ORDINAL)
  @Column(length = 1)
  @NonNull
  private FeatureToggleStatusEnum status;
}
