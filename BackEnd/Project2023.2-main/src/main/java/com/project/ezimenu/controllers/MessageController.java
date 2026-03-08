package com.project.ezimenu.controllers;

import com.project.ezimenu.entities.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @MessageMapping("/private")
    public void sendToSpecificUser(@Payload Message notification){
        System.out.println(notification.toString());
        simpMessagingTemplate.convertAndSendToUser("admin", "/specific", notification);
    }
}
