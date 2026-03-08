package com.project.ezimenu.services.interfaces;

import com.project.ezimenu.dtos.NotificationDTO.NotificationResponseDTO;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.exceptions.NotFoundException;

import java.util.List;

public interface INotificationService {
    List<NotificationResponseDTO> getNotificationsByTableId(Long tableId) throws NotFoundException;
    Notification addNotification(Long tableId, String text) throws NotFoundException;
    void deleteNotification(Long notificationId) throws NotFoundException;
    void deleteAllTableNotifications(Long tableId) throws NotFoundException;
}
