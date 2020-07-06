package com.gbastos.featuretoggleapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity(name = "FeatureToggle")
@Table(name = "feature_toggle")
public class FeatureToggle extends AbstractEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String displayName;

  @NonNull private String technicalName;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime expiresOn;

  private String description;
  private Boolean inverted;

  @OneToMany(
      mappedBy = "featureToggle",
      fetch = FetchType.LAZY,
      orphanRemoval = true)
  private List<CustomerFeatureToggle> customerFeatureToggles = new ArrayList<>();
}
