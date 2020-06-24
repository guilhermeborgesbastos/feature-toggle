package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.controller.request.UserRequest;
import com.gbastos.featuretoggleapi.controller.response.UserResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.exception.UserNotFoundException;
import com.gbastos.featuretoggleapi.internationalization.Translator;
import com.gbastos.featuretoggleapi.model.Role;
import com.gbastos.featuretoggleapi.model.User;
import com.gbastos.featuretoggleapi.model.UserPasswordHistory;
import com.gbastos.featuretoggleapi.model.enumerator.RoleEnum;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import com.gbastos.featuretoggleapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.function.Predicate;

@Service("userDetailsService")
public class UserService implements IUserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final IAdapter<User, UserRequest, UserResponse> userAdapter;

  @Autowired
  public UserService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      IAdapter<User, UserRequest, UserResponse> userAdapter) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.userAdapter = userAdapter;
  }

  private User mapRequestToEntity(UserRequest request, User entity) {
    entity.setName(request.getName());
    entity.setEmail(request.getEmail());
    entity.setRole(new Role(request.getRoleId()));
    entity.setStatus(UserStatusEnum.valueOf(request.getStatus()));
    return entity;
  }

  private boolean hasPasswordAlreadyBeingUsed(User user, String rawPassword) {
    Predicate<UserPasswordHistory> hasBeingUsed =
        historic -> passwordEncoder.matches(rawPassword, historic.getPassword());
    return user.getPasswordHistoric().stream().anyMatch(hasBeingUsed);
  }

  @Override
  public void save(UserRequest request) {
    userRepository.save(userAdapter.mapRequestToEntity(request));
  }

  @Override
  public void update(int userId, UserRequest request) throws EntityNotFoundException {
    Optional<User> optionalEntity = userRepository.findById(userId);

    if (optionalEntity.isPresent()) {
      userRepository.save(mapRequestToEntity(request, optionalEntity.get()));
    } else {
      throw new EntityNotFoundException(
          User.class, UserRequest.FieldName.ID, String.valueOf(userId));
    }
  }

  @Override
  public void delete(int userId) throws EntityNotFoundException {
    Optional<User> optionalEntity = userRepository.findById(userId);

    if (optionalEntity.isPresent()) {
      userRepository.delete(optionalEntity.get());
    } else {
      throw new EntityNotFoundException(
          User.class, UserRequest.FieldName.ID, String.valueOf(userId));
    }
  }

  @Override
  public User findById(int userId) {
    Optional<User> optionalUser = userRepository.findById(userId);

    if (optionalUser.isPresent()) {
      return optionalUser.get();
    }

    throw new UserNotFoundException(
        String.format(Translator.toLocale("exception.user.not.found"), userId));
  }

  @Override
  public User findByEmail(String email) {
    Optional<User> optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isPresent()) {
      return optionalUser.get();
    }

    throw new UserNotFoundException(
            String.format(Translator.toLocale("exception.user.not.found"), email));
  }

  @Override
  public Page<User> listAll(Pageable pageable) {
    return userRepository.findAll(pageable);
  }

  @Override
  public void enable(Integer userId) throws EntityNotFoundException {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException(UserResponse.class));
    user.setStatus(UserStatusEnum.ENABLED);
    userRepository.save(user);
  }

  @Override
  public void disable(Integer userId) throws EntityNotFoundException {
    User user =
            userRepository
                    .findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException(UserResponse.class));
    user.setStatus(UserStatusEnum.DISABLED);
    userRepository.save(user);
  }

  @Override
  public void changePassword(
      Integer targetUserId,
      String oldPassword,
      String newPassword,
      Set<RoleEnum> userAuthRoles,
      Integer userAuthId)
      throws EntityNotFoundException {

    User user =
        userRepository
            .findById(targetUserId)
            .orElseThrow(() -> new EntityNotFoundException(UserResponse.class));

    if (userAuthRoles.contains(RoleEnum.SUPER_ADMIN)
        || (targetUserId.equals(userAuthId)
            && oldPassword != null
            && passwordEncoder.matches(oldPassword, user.getPassword()))) {

      if (!hasPasswordAlreadyBeingUsed(user, newPassword)) {
        String encodePwd = passwordEncoder.encode(newPassword);

        user.setPassword(encodePwd);
        user.setPasswordHistoric(new UserPasswordHistory(user, encodePwd));
        userRepository.save(user);
      } else {
        throw new ConstraintViolationException(
            Translator.toLocale("exception.user.credentials.already.used.password"),
            new HashSet<>());
      }
    } else {
      throw new ConstraintViolationException(
          Translator.toLocale("exception.user.credentials.unmatching.password"), new HashSet<>());
    }
  }
}
