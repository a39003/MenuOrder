package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.NotificationDTO.NotificationResponseDTO;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @RequestMapping(path = "/admin/notifications/tables/{tableId}", method = RequestMethod.GET)
    public ResponseEntity<?> getTableNotifications(@PathVariable Long tableId) throws NotFoundException {
        List<NotificationResponseDTO> notifications = notificationService.getNotificationsByTableId(tableId);
        return ResponseEntity.ok(notifications);
    }
    @PostMapping("/notifications/{tableId}")
    public ResponseEntity<?> addTableNotification(@PathVariable Long tableId,
                                                  @RequestBody String text)
            throws NotFoundException
    {
        Notification notification = notificationService.addNotification(tableId, text);
        return ResponseEntity.ok(notification);
    }
    @RequestMapping(path = "/admin/notifications/{notificationId}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId)
            throws NotFoundException {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Đã xóa thông báo thành công");
    }
    @RequestMapping(path = "/admin/notifications/tables/{tableId}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteAllNotifications(@PathVariable Long tableId)
            throws NotFoundException {
        notificationService.deleteAllTableNotifications(tableId);
        return ResponseEntity.ok("Đã xóa thông báo thành công");
    }
}
