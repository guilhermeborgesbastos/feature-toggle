package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.response.CustomerResponse;
import com.gbastos.featuretoggleapi.model.Customer;
import lombok.ToString;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * It provides ways of mapping pageable Customer persistence entity into pageable Customer Response
 * model.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IPageableAdapter
 * @see @{@link Page}
 */
@ToString
@Component
public class CustomerPageableAdapter extends CustomerAdapter
    implements IPageableAdapter<Customer, CustomerResponse> {

  /** {@inheritDoc} */
  @Override
  public Page<CustomerResponse> mapEntityToPageableResponse(Page<Customer> pageable) {
    List<CustomerResponse> responseFeatures = new ArrayList<>();
    pageable.forEach(feature -> responseFeatures.add(mapEntityToResponse(feature)));
    return new PageImpl<CustomerResponse>(
        responseFeatures, pageable.getPageable(), pageable.getTotalElements());
  }
}
