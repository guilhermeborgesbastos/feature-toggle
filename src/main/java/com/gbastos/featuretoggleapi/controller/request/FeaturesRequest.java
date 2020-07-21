package com.gbastos.featuretoggleapi.controller.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Getter
@Setter
@ToString
public class FeaturesRequest {

  @NotNull(message = "The Customer ID cannot be null.")
  @Min(value = 1, message = "The Customer ID cannot be zero or negative.")
  private Integer customerId;

  private Set<Integer> featureIds;
}
