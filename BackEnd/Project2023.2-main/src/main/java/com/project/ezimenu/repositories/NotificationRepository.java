package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
