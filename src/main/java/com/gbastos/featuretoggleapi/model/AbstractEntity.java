package com.gbastos.featuretoggleapi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

/**
 * This class is an abstraction that contains common properties for the model objects.
 *
 * @author Guilherme Borges Bastos
 */
@Getter
@Setter
@MappedSuperclass
public class AbstractEntity {
  @CreationTimestamp
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime createdAt;
}
