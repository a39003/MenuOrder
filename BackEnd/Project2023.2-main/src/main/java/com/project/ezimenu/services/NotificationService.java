package com.project.ezimenu.services;

import com.project.ezimenu.dtos.NotificationDTO.NotificationResponseDTO;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.entities.Table;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.NotificationRepository;
import com.project.ezimenu.repositories.TableRepository;
import com.project.ezimenu.services.interfaces.INotificationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class NotificationService implements INotificationService {
    @Autowired
    private TableRepository tableRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ModelMapper modelMapper;
    public List<NotificationResponseDTO> getNotificationsByTableId(Long tableId) throws NotFoundException {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn có id: " + tableId));
        List<Notification> notifications = table.getNotifications();
        Comparator<Notification> comparator = Comparator.comparing(Notification::getNotificationTime).reversed();
        notifications.sort(comparator);
        return notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationResponseDTO.class))
                .collect(Collectors.toList());
    }

    public Notification addNotification(Long tableId, String text) throws NotFoundException {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn có id: " + tableId));
        Notification notification = new Notification();
        notification.setNotificationTime(LocalDateTime.now());
        notification.setText(text);
        notification.setTable(table);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) throws NotFoundException {
        notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy thông báo có id: " + notificationId));
        notificationRepository.deleteById(notificationId);
    }

    @Transactional
    public void deleteAllTableNotifications(Long tableId) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with id: " + tableId));
        Hibernate.initialize(table.getNotifications());
        table.getNotifications().clear();
        tableRepository.save(table);
    }
}
