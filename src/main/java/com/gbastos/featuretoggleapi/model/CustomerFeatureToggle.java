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
public class CustomerFeatureToggle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @OneToOne @NonNull @JsonBackReference private Customer customer;

  @OneToOne @NonNull private FeatureToggle featureToggle;

  @Enumerated(EnumType.ORDINAL)
  @Column(length = 1)
  @NonNull
  private FeatureToggleStatusEnum status;
}
