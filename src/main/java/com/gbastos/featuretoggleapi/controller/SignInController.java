package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.controller.request.SignInRequest;
import com.gbastos.featuretoggleapi.controller.response.SignInResponse;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.service.IUserSignInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Validated
@RestController
@RequestMapping("/v1/signin")
public class SignInController {

  private IUserSignInService userSignInService;
  private IAdapter<User, SignInRequest, SignInResponse> userSignInAdapter;

  @Autowired
  public SignInController(
      IUserSignInService userSignInService,
      IAdapter<User, SignInRequest, SignInResponse> userSignInAdapter) {
    this.userSignInService = userSignInService;
    this.userSignInAdapter = userSignInAdapter;
  }

  @PostMapping
  public SignInResponse signIn(@RequestBody @Valid SignInRequest signInRequest) {
    User user = userSignInAdapter.mapRequestToEntity(signInRequest);
    return userSignInAdapter.mapEntityToResponse(userSignInService.signIn(user));
  }
}
