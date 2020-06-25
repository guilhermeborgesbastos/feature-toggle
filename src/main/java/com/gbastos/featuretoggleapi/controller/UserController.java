package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.adapter.IPageableAdapter;
import com.gbastos.featuretoggleapi.annotation.OAuthUserId;
import com.gbastos.featuretoggleapi.annotation.OAuthUserRoles;
import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.controller.response.UserResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import com.gbastos.featuretoggleapi.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.util.HashSet;

@RestController
@RequestMapping("/v1/user")
public class UserController {

  private final IUserService userService;
  private final IAdapter<User, UserRequest, UserResponse> userAdapter;
  private final IPageableAdapter<User, UserResponse> userPageableAdapter;

  @Autowired
  public UserController(
          IUserService userService,
          IAdapter<User, UserRequest, UserResponse> userAdapter,
          IPageableAdapter<User, UserResponse> userPageableAdapter) {
    this.userService = userService;
    this.userAdapter = userAdapter;
    this.userPageableAdapter = userPageableAdapter;
  }

  @GetMapping(value = "/{user-id}")
  @PreAuthorize("hasAuthority('SUPER_ADMIN')")
  public UserResponse findById(@PathVariable(UserRequest.FieldName.ID) @Min(1) int id) {
    return userAdapter.mapEntityToResponse(userService.findById(id));
  }

  @GetMapping(value = "/find-by-email")
  public UserResponse findByEmail(@RequestParam("email") String email) {
    return userAdapter.mapEntityToResponse(userService.findByEmail(email));
  }

  @PutMapping(value = "/{user-id}")
  @PreAuthorize("hasAuthority('SUPER_ADMIN')")
  public void update(
      @PathVariable(UserRequest.FieldName.ID) Integer id,
      @RequestBody @Valid UserRequest userRequest)
      throws EntityNotFoundException {
    userService.update(id, userRequest);
  }

  @DeleteMapping("/{user-id}")
  @PreAuthorize("hasAuthority('SUPER_ADMIN')")
  public void delete(@PathVariable(UserRequest.FieldName.ID) Integer id)
      throws EntityNotFoundException {
    userService.delete(id);
  }

  @GetMapping("/list")
  @PreAuthorize("hasAuthority('SUPER_ADMIN')")
  public Page<UserResponse> list(@PageableDefault(size = 10) Pageable pageable) {
    return userPageableAdapter.mapEntityToPageableResponse(userService.listAll(pageable));
  }

  @PutMapping("/{user-id}/enable")
  @PreAuthorize("hasAuthority('SUPER_ADMIN')")
  public void enable(@PathVariable(UserRequest.FieldName.ID) Integer userId)
      throws EntityNotFoundException {
    userService.enable(userId);
  }

  @PutMapping("/{user-id}/disable")
  @PreAuthorize("hasAuthority('SUPER_ADMIN')")
  public void disable(@PathVariable(UserRequest.FieldName.ID) Integer userId)
      throws EntityNotFoundException {
    userService.disable(userId);
  }

  @PutMapping("/{user-id}/change-password")
  @PreAuthorize(
      "hasAuthority('SUPER_ADMIN') || (#oldPassword != null && !#oldPassword.isEmpty()"
          + " && authentication.principal == @userRepository.findById(#targetUserId).orElse(new com.gbastos.featuretoggleapi.model.User()).email)")
  public void changePassword(
      @PathVariable(UserRequest.FieldName.ID) Integer targetUserId,
      @RequestParam(required = false) String oldPassword,
      @Valid @Size(min = 6) @RequestParam String newPassword,
      @OAuthUserRoles HashSet<RoleEnum> userAuthRoles,
      @OAuthUserId Integer userAuthId)
      throws EntityNotFoundException {
    userService.changePassword(targetUserId, oldPassword, newPassword, userAuthRoles, userAuthId);
  }
}
