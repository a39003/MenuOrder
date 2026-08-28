package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.TableDTO.TableRequestDTO;
import com.project.ezimenu.dtos.TableDTO.TableResponseDTO;
import com.project.ezimenu.dtos.BillDTO.PaymentConfirmDTO;
import com.project.ezimenu.entities.Bill;
import com.project.ezimenu.entities.Message;
import com.project.ezimenu.entities.Table;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.services.NotificationService;
import com.project.ezimenu.services.TableService;
import com.project.ezimenu.repositories.BillRepository;
import com.project.ezimenu.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class TableController {
    @Autowired
    private TableService tableService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private MessageController messageController;
    @Autowired
    private BillRepository billRepository;

    @RequestMapping(path = "/admin/tables", method = RequestMethod.GET)
    public ResponseEntity<?> getAllTables() throws NotFoundException {
        List<TableResponseDTO> tables = tableService.getAllTables();
        if(tables.isEmpty()){
            throw new NotFoundException("Hiện không có bàn nào!");
        }
        return ResponseEntity.ok(tables);
    }
    @RequestMapping(path = "/admin/tables/{tableId}", method = RequestMethod.GET)
    public ResponseEntity<?> getTableById(@PathVariable Long tableId) throws NotFoundException {
        TableResponseDTO table = tableService.getTableById(tableId);
        return ResponseEntity.ok(table);
    }
    @RequestMapping(path = "/tables/{tableId}", method = RequestMethod.GET)
    public ResponseEntity<?> getPublicTableById(@PathVariable Long tableId) throws NotFoundException {
        TableResponseDTO table = tableService.getTableById(tableId);
        return ResponseEntity.ok(table);
    }
    @RequestMapping(path = "/admin/tables/status", method = RequestMethod.GET)
    public ResponseEntity<?> getTablesByStatus(@RequestParam("status") String status) throws NotFoundException {
        List<TableResponseDTO> tables = tableService.getTablesByStatus(status);
        return ResponseEntity.ok(tables);
    }
    @RequestMapping(path = "/admin/tables", method = RequestMethod.POST)
    public ResponseEntity<?> addTable(@RequestBody TableRequestDTO tableRequestDTO) throws BadRequestException {
        Table table = tableService.addTable(tableRequestDTO);
        return new ResponseEntity<Table>(table, HttpStatus.OK);
    }
    @PostMapping("/tables/{tableId}/payment/request")
    public ResponseEntity<?> sendPaymentRequest(@PathVariable Long tableId) throws NotFoundException {
        TableResponseDTO table = tableService.getTableById(tableId);
        tableService.updateTableStatus(tableId, "Đang yêu cầu thanh toán");
        notificationService.addNotification(tableId, "Khách ở bàn " + table.getTableName() + " đang yêu cầu thanh toán");
        Message request = new Message();
        request.setTo("admin");
        request.setText(LocalDateTime.now().format(DateUtils.FORMATTER) + ": Khách ở bàn " + table.getTableName() + " đang yêu cầu thanh toán");
        messageController.sendToSpecificUser(request);
        return new ResponseEntity<>("Yêu cầu đã được gửi đi", HttpStatus.OK);
    }

    @PostMapping("/tables/{tableId}/support/request")
    public ResponseEntity<?> sendSupportRequest(@PathVariable Long tableId,
                                                @RequestBody(required = false) Map<String, String> body)
            throws NotFoundException {
        TableResponseDTO table = tableService.getTableById(tableId);
        String reason = body == null ? null : body.get("reason");
        if (reason == null || reason.isBlank()) reason = "Gọi nhân viên";
        String type = table.getTableType() == null ? "THƯỜNG" : table.getTableType();
        String location = table.getTableName() + " · Tầng " + table.getFloorNumber() + " · " + type;
        String text = location + " cần hỗ trợ: " + reason.trim();
        notificationService.addNotification(tableId, text);
        Message request = new Message();
        request.setTo("admin");
        request.setText(LocalDateTime.now().format(DateUtils.FORMATTER) + ": " + text);
        messageController.sendToSpecificUser(request);
        return ResponseEntity.ok(Map.of("message", "Yêu cầu hỗ trợ đã được gửi"));
    }


    @RequestMapping(path = "/admin/tables/{tableId}/payment/accept", method = RequestMethod.POST)
    public ResponseEntity<?> acceptPaymentRequest(@PathVariable Long tableId,
                                                   @RequestBody(required = false) PaymentConfirmDTO payment) throws NotFoundException{
        Table table = tableService.updateTableStatus(tableId, "Đã thanh toán");
        if (table.getOrders() != null && !table.getOrders().isEmpty()) {
            Bill bill = table.getOrders().get(table.getOrders().size() - 1).getBill();
            if (bill != null) {
                bill.setPaymentMethod(payment == null || payment.getPaymentMethod() == null
                        ? "TIEN_MAT" : payment.getPaymentMethod());
                bill.setTransactionCode(payment == null ? null : payment.getTransactionCode());
                bill.setPaymentStatus("DA_THANH_TOAN");
                billRepository.save(bill);
            }
        }
        return ResponseEntity.ok(table);
    }

    @RequestMapping(path = "/admin/tables/{tableId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateTableName(@PathVariable Long tableId,
                                             @RequestBody TableRequestDTO tableRequestDTO)
            throws NotFoundException, BadRequestException {
        Table table = tableService.updateTable(tableId, tableRequestDTO);
        return new ResponseEntity<Table>(table, HttpStatus.ACCEPTED);
    }
    @RequestMapping(path = "/admin/tables/{tableId}/status", method = RequestMethod.PUT)
    public ResponseEntity<?> updateEmptyTable(@PathVariable Long tableId)
            throws NotFoundException
    {
        Table table = tableService.updateTableStatus(tableId, "Đang trống");
        return new ResponseEntity<Table>(table, HttpStatus.ACCEPTED);
    }
    @RequestMapping(path = "/admin/tables/{tableId}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteTable(@PathVariable Long tableId) throws NotFoundException {
        tableService.deleteTable(tableId);
        return new ResponseEntity<>("Đã xóa bàn thành công", HttpStatus.OK);
    }
}
