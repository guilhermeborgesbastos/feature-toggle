package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.response.FeatureToggleResponse;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import lombok.ToString;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * It provides ways of mapping pageable Feature Toggle persistence entity into pageable Feature
 * Toggle Response model.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IPageableAdapter
 * @see @{@link Page}
 */
@ToString
@Component
public class FeatureTogglePageableAdapter extends FeatureToggleAdapter
    implements IPageableAdapter<FeatureToggle, FeatureToggleResponse> {

  /** {@inheritDoc} */
  @Override
  public Page<FeatureToggleResponse> mapEntityToPageableResponse(Page<FeatureToggle> pageable) {
    List<FeatureToggleResponse> responseFeatures = new ArrayList<>();
    pageable.forEach(feature -> responseFeatures.add(mapEntityToResponse(feature)));
    return new PageImpl<FeatureToggleResponse>(
        responseFeatures, pageable.getPageable(), pageable.getTotalElements());
  }
}
