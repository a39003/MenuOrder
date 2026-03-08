package com.project.ezimenu.dtos.NotificationDTO;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class NotificationResponseDTO {
    private long notificationId;
    private LocalDateTime notificationTime;
    private String text;
}
