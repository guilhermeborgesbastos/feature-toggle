package com.gbastos.featuretoggleapi.adapter;

public interface IAdapter<Entity, Request, Response> {

  Entity mapRequestToEntity(Request request);

  Response mapEntityToResponse(Entity entity);
}
