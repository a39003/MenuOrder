package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.OrderDTO.OrderListResponseDTO;
import com.project.ezimenu.dtos.OrderDTO.OrderResponseDTO;
import com.project.ezimenu.entities.Message;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.Table;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.TableRepository;
import com.project.ezimenu.services.NotificationService;
import com.project.ezimenu.services.OrderService;
import com.project.ezimenu.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
public class OrderController {
    @Autowired
    private MessageController messageController;
    @Autowired
    private OrderService orderService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private TableRepository tableRepository;
    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    @RequestMapping(path = "admin/orders", method = RequestMethod.GET)
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws NotFoundException {
        Pageable pageable = PageRequest.of(page, size);
        OrderListResponseDTO response = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/admin/orders/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) throws NotFoundException {
        OrderResponseDTO order = orderService.getOrderResponseById(orderId);
        return ResponseEntity.ok(order);
    }
    @GetMapping("/admin/orders/tables/{tableId}")
    public ResponseEntity<?> getOrderByTableId(@PathVariable Long tableId) throws NotFoundException {
        OrderResponseDTO order = orderService.getOrderResponseByTableId(tableId);
        return ResponseEntity.ok(order);
    }
    @GetMapping("/orders/tables/{tableId}")
    public ResponseEntity<?> getOrderForCustomerByTableId(@PathVariable Long tableId) throws NotFoundException {
        OrderResponseDTO order = orderService.getOrderResponseForCustomerByTableId(tableId);
        return ResponseEntity.ok(order);
    }
    @RequestMapping(path = "orders/{tableId}", method = RequestMethod.POST)
    public ResponseEntity<?> sendOrder(@PathVariable Long tableId) throws NotFoundException {
        LocalDateTime currentDateTime = LocalDateTime.now();
        Order newOrder = orderService.sendOrder(tableId);
        Table table = tableRepository.findByTableIdAndStatus(tableId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Bàn không tồn tại"));
        Message message = new Message();
        message.setText(currentDateTime.format(formatter) + ": " + "Bàn " + table.getTableName()  + " đã tạo order mới!");
        message.setTo("admin");
        Notification notification = notificationService.addNotification(tableId, "Khách ở bàn " + tableId + " đã đặt món.");
        messageController.sendToSpecificUser(message);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    @RequestMapping(path = "admin/orders/{orderId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId)
            throws NotFoundException {
        Order order = orderService.deleteOrder(orderId);
        return ResponseEntity.ok(order);
    }
}
