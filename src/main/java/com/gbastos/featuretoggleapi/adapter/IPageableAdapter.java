package com.gbastos.featuretoggleapi.adapter;

import org.springframework.data.domain.Page;

/**
 * It provides the capability of mapping the pageable persistence entity into a pageable response.
 *
 * @See @{@link Page}
 * @param <Entity>
 * @param <Response>
 * @author Guilherme Borges Bastos
 */
public interface IPageableAdapter<Entity, Response> {

  /**
   * It maps @{@link Page} Entity models into pageable persistence models.
   *
   * @param pageableEntities the pageable entities.
   * @return the pageable response model.
   */
  Page<Response> mapEntityToPageableResponse(Page<Entity> pageableEntities);
}
