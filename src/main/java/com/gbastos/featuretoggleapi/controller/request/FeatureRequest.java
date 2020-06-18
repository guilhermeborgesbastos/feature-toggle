package com.gbastos.featuretoggleapi.controller.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
public class FeatureRequest {

  private Integer id;

  private String displayName;

  @NotEmpty(message = "Please, provide a valid technical name.")
  private String technicalName;

  @Future(message = "Please, provide a valid date in the future.")
  private LocalDateTime expiresOn;

  private String description;

  private boolean inverted;

  @Pattern(regexp = "^[0-9]+$") // numbers only
  private List<String> customerIds;
}
