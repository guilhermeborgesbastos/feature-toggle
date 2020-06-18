package com.gbastos.featuretoggleapi.controller.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CustomerResponse {
  private Integer id;
  private String name;
}
