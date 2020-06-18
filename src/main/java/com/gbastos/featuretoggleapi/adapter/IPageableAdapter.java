package com.gbastos.featuretoggleapi.adapter;

import org.springframework.data.domain.Page;

public interface IPageableAdapter<Entity, Response> {
  Page<Response> mapEntityToPageableResponse(Page<Entity> pageableEntities);
}
