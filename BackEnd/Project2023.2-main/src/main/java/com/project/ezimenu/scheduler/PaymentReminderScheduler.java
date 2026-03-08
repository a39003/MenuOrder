package com.project.ezimenu.scheduler;

import com.project.ezimenu.controllers.MessageController;
import com.project.ezimenu.entities.Message;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.entities.Table;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.TableRepository;
import com.project.ezimenu.services.NotificationService;
import com.project.ezimenu.services.TableService;
import com.project.ezimenu.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PaymentReminderScheduler {
    @Autowired
    private TableService tableService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private MessageController messageController;
    @Autowired
    private TableRepository tableRepository;
    @Scheduled(fixedRate = 1*60*1000)
    public void sendPaymentRemindersVer2() {
        try {
            List<Table> tables = tableRepository.findAll();
            for (Table table : tables) {
                if ("Đã thanh toán".equals(table.getTableStatus())) {
                    String text = "Bàn " + table.getTableId() + " đã thanh toán, bạn có muốn chuyển về bàn trống không?";
                    if(table.getNotifications() != null && !table.getNotifications().isEmpty()){
                        Notification notification = table.getNotifications().get(table.getNotifications().size() - 1);
                        if (text.equals(notification.getText())){
                            LocalDateTime lastNotificationTime = notification.getNotificationTime();
                            LocalDateTime currentTime = LocalDateTime.now();
                            Duration durationSinceLastNotification = Duration.between(lastNotificationTime, currentTime);
                            if (durationSinceLastNotification.toMinutes() >= 29) {
                                notificationService.addNotification(table.getTableId(), text);
                                Message request = new Message();
                                request.setTo("admin");
                                request.setText(currentTime.format(DateUtils.FORMATTER) + ": " + text);
                                messageController.sendToSpecificUser(request);
                            }
                        } else {
                            LocalDateTime billDateTime = table.getOrders().get(table.getOrders().size() - 1).getBill().getBillDateTime();
                            LocalDateTime currentTime = LocalDateTime.now();
                            Duration duration = Duration.between(billDateTime, currentTime);
                            if (duration.toMinutes() >= 29) {
                                notificationService.addNotification(table.getTableId(), text);
                                Message request = new Message();
                                request.setTo("admin");
                                request.setText(LocalDateTime.now().format(DateUtils.FORMATTER) + ": " + text);
                                messageController.sendToSpecificUser(request);
                            }
                        }
                    } else {
                        LocalDateTime billDateTime = table.getOrders().get(table.getOrders().size() - 1).getBill().getBillDateTime();
                        LocalDateTime currentTime = LocalDateTime.now();
                        Duration duration = Duration.between(billDateTime, currentTime);
                        if (duration.toMinutes() >= 29) {
                            notificationService.addNotification(table.getTableId(), text);
                            Message request = new Message();
                            request.setTo("admin");
                            request.setText(LocalDateTime.now().format(DateUtils.FORMATTER) + ": " + text);
                            messageController.sendToSpecificUser(request);
                        }
                    }
                }
            }
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }
}