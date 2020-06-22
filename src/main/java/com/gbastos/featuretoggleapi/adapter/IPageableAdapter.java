package com.gbastos.featuretoggleapi.adapter;

import org.springframework.data.domain.Page;

/**
 * It provides the capability of mapping the pageable persistence entity into a pageable response.
 *
 * @See @{@link Page}
 * @param <S> the persistence entity object.
 * @param <T> the response model object.
 * @author Guilherme Borges Bastos
 */
public interface IPageableAdapter<S, T> {

  /**
   * It maps @{@link Page} Entity models into pageable persistence models.
   *
   * @param pageableEntities the pageable entities.
   * @return the pageable response model.
   */
  Page<T> mapEntityToPageableResponse(Page<S> pageableEntities);
}
