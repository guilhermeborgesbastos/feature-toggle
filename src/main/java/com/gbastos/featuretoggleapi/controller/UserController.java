package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.annotation.OAuthUserId;
import com.gbastos.featuretoggleapi.annotation.OAuthUserRoles;
import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.controller.response.UserResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import com.gbastos.featuretoggleapi.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.util.HashSet;

@RestController
@RequestMapping("/v1/user")
public class UserController {

  private IUserService userService;

  private IAdapter<User, UserRequest, UserResponse> userAdapter;

  @Autowired
  public UserController(
      IUserService userService, IAdapter<User, UserRequest, UserResponse> userAdapter) {
    this.userService = userService;
    this.userAdapter = userAdapter;
  }

  @GetMapping(value = "/{user-id}")
  public UserResponse findById(@PathVariable(UserRequest.FieldName.ID) @Min(1) int id) {
    return userAdapter.mapEntityToResponse(userService.findById(id));
  }

  @PutMapping(value = "/{user-id}")
  public void update(
      @PathVariable(UserRequest.FieldName.ID) Integer id,
      @RequestBody @Valid UserRequest userRequest)
      throws EntityNotFoundException {
    userService.update(id, userRequest);
  }

  @DeleteMapping("/{user-id}")
  public void delete(@PathVariable(UserRequest.FieldName.ID) Integer id)
      throws EntityNotFoundException {
    userService.delete(id);
  }

  @PutMapping("/{targetUserId}/changePassword")
  @PreAuthorize("hasAuthority('SUPER_ADMIN') || (#oldPassword != null && !#oldPassword.isEmpty()"
          + " && authentication.principal == @userRepository.findById(#targetUserId).orElse(new com.gbastos.featuretoggleapi.model.User()).email)")
  public void changePassword(
      @PathVariable int targetUserId,
      @RequestParam(required = false) String oldPassword,
      @Valid @Size(min = 6) @RequestParam String newPassword,
      @OAuthUserRoles HashSet<RoleEnum> userAuthRoles,
      @OAuthUserId Integer userAuthId)
      throws EntityNotFoundException {
    userService.changePassword(targetUserId, oldPassword, newPassword, userAuthRoles, userAuthId);
  }
}
