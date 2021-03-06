package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.response.UserResponse;
import com.gbastos.featuretoggleapi.model.User;
import lombok.ToString;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * It provides ways of mapping pageable User persistence entity into pageable User Response model.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IPageableAdapter
 * @see @{@link Page}
 */
@ToString
@Component
public class UserPageableAdapter extends UserAdapter
    implements IPageableAdapter<User, UserResponse> {

  /** {@inheritDoc} */
  @Override
  public Page<UserResponse> mapEntityToPageableResponse(Page<User> pageable) {
    List<UserResponse> responseFeatures = new ArrayList<>();
    pageable.forEach(feature -> responseFeatures.add(mapEntityToResponse(feature)));
    return new PageImpl<UserResponse>(
        responseFeatures, pageable.getPageable(), pageable.getTotalElements());
  }
}
