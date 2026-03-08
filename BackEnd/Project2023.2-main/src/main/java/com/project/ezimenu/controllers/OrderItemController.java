package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.OrderItemDTO.OrderItemRequestDTO;
import com.project.ezimenu.entities.Message;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.OrderItem;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.services.NotificationService;
import com.project.ezimenu.services.OrderItemService;
import com.project.ezimenu.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

@RestController
public class OrderItemController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderItemService orderItemService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private MessageController messageController;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    private BlockingQueue<String> orderStatusQueue = new LinkedBlockingQueue<>();
    @PostMapping("orders/{orderId}/items")
    public ResponseEntity<?> addOrderItem(@PathVariable Long orderId,
                                          @RequestBody OrderItemRequestDTO orderItemRequestDTO)
            throws NotFoundException, BadRequestException {
        OrderItem createdOrderItem = orderItemService.addOrderItem(orderId, orderItemRequestDTO);
        return new ResponseEntity<>(createdOrderItem, HttpStatus.CREATED);
    }
    @PutMapping("orders/{orderId}/items/{orderItemId}")
    public ResponseEntity<?> updateOrderItem(@PathVariable Long orderId,
                                             @PathVariable Long orderItemId,
                                             @RequestBody OrderItemRequestDTO orderItemRequestDTO)
        throws NotFoundException, BadRequestException {
        Order updatedOrder = orderItemService.updateOrderItem(orderId, orderItemId, orderItemRequestDTO);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
    @RequestMapping(path = "admin/orders/{orderId}/items/{orderItemId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateOrderItemForAdmin(@PathVariable Long orderId,
                                                     @PathVariable Long orderItemId,
                                                     @RequestBody OrderItemRequestDTO orderItemRequestDTO)
            throws NotFoundException {
        Order updatedOrder = orderItemService.updateOrderItemForAdmin(orderId, orderItemId, orderItemRequestDTO);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
    @RequestMapping(path = "admin/orders/{orderId}/items/{orderItemId}/status", method = RequestMethod.PUT)
    public ResponseEntity<?> updateOrderItemStatus(@PathVariable Long orderId,
                                                   @PathVariable Long orderItemId)
            throws NotFoundException {
        OrderItem updatedOrderItem = orderItemService.updateOrderItemStatus(orderId, orderItemId);
        orderStatusQueue.offer(updatedOrderItem.getDishStatus());
        return new ResponseEntity<>(updatedOrderItem, HttpStatus.OK);
    }
    @GetMapping("/orders/updates")
    public String getOrderUpdates() throws InterruptedException {
        return orderStatusQueue.poll(5, TimeUnit.SECONDS);
    }
    @PostMapping("orders/{orderId}/items/{orderItemId}/request")
    public ResponseEntity<?> sendOrderItemRequest(@PathVariable Long orderId,
                                                  @PathVariable Long orderItemId)
            throws NotFoundException {
        Order order = orderService.getOrderById(orderId);
        OrderItem orderItem = orderItemService.getOrderItemById(orderItemId);
        if(orderItem.getOrder().getOrderId() != order.getOrderId()){
            throw new NotFoundException("Món này không nằm trong order " + orderId + "!");
        }
        Notification notification = notificationService.addNotification(order.getTable().getTableId(), "Khách ở bàn " + order.getTable().getTableName() + " đang yêu cầu hỗ trợ cho món " + orderItem.getDish().getDishName() + ".");
        Message request = new Message();
        request.setTo("admin");
        request.setText(LocalDateTime.now().format(formatter) + ": Khách ở bàn " + order.getTable().getTableName() + " đang yêu cầu hỗ trợ cho món " + orderItem.getDish().getDishName() + ".");
        messageController.sendToSpecificUser(request);
        return new ResponseEntity<>(notification, HttpStatus.OK);
    }
    @DeleteMapping("orders/{orderId}/items/{orderItemId}")
    public ResponseEntity<?> deleteOrderItem(@PathVariable Long orderId,
                                             @PathVariable Long orderItemId)
            throws NotFoundException, BadRequestException {
        Order updatedOrder = orderItemService.deleteOrderItem(orderId, orderItemId);
        return ResponseEntity.ok(updatedOrder);
    }
}
