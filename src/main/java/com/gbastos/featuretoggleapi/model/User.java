package com.gbastos.featuretoggleapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gbastos.featuretoggleapi.model.enumerator.UserStatusEnum;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
public class User extends AbstractEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @OneToOne @NonNull private Role role;
  @NonNull private String name;
  @NotEmpty @Email private String email;
  @JsonIgnore @ToString.Exclude private String password;

  @Enumerated(EnumType.ORDINAL)
  @Column(length = 1)
  @NonNull
  private UserStatusEnum status;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  Set<UserPasswordHistory> passwordHistoric = new HashSet<>();

  public void setPasswordHistoric(UserPasswordHistory newUserPasswordHistory) {
    this.getPasswordHistoric().add(newUserPasswordHistory);
  }
}
