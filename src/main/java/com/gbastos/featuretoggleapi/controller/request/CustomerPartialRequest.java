package com.gbastos.featuretoggleapi.controller.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Getter
@Setter
@ToString
public class CustomerPartialRequest {

  private Integer id;
  private String name;
  private Set<Integer> featureIds;

  public static final class FieldName {
    public static final String ID = "customer-id";

    private FieldName() {}
  }
}
