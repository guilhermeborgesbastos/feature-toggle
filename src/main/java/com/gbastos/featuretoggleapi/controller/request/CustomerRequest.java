package com.gbastos.featuretoggleapi.controller.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Getter
@Setter
@ToString
public class CustomerRequest {

  private Integer id;

  @NotEmpty(message = "Please, provide a valid name.")
  private String name;

  private Set<Integer> featureIds;

  public static final class FieldName {
    public static final String ID = "customer-id";

    private FieldName() {}
  }
}
