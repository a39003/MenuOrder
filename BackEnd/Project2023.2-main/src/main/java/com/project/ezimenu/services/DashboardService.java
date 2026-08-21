package com.project.ezimenu.services;

import com.project.ezimenu.dtos.DashboardDTO.DashboardResponseDTO;
import com.project.ezimenu.dtos.DashboardDTO.RevenuePointDTO;
import com.project.ezimenu.dtos.DashboardDTO.TopDishDTO;
import com.project.ezimenu.entities.Bill;
import com.project.ezimenu.entities.BillItem;
import com.project.ezimenu.repositories.BillRepository;
import com.project.ezimenu.repositories.TableRepository;
import com.project.ezimenu.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private TableRepository tableRepository;

    @Transactional(readOnly = true)
    public DashboardResponseDTO getDashboard(int requestedDays) {
        int days = Math.max(1, Math.min(requestedDays, 31));
        LocalDate today = LocalDate.now();
        LocalDate firstDay = today.minusDays(days - 1L);
        List<Bill> paidBills = billRepository.findAllByOrderByBillDateTimeDesc().stream()
                .filter(this::isPaid)
                .toList();

        Map<LocalDate, List<Bill>> billsByDate = new LinkedHashMap<>();
        for (int offset = 0; offset < days; offset++) {
            billsByDate.put(firstDay.plusDays(offset), new ArrayList<>());
        }
        paidBills.stream()
                .filter(bill -> bill.getBillDateTime() != null)
                .filter(bill -> !bill.getBillDateTime().toLocalDate().isBefore(firstDay))
                .filter(bill -> !bill.getBillDateTime().toLocalDate().isAfter(today))
                .forEach(bill -> billsByDate.get(bill.getBillDateTime().toLocalDate()).add(bill));

        List<RevenuePointDTO> revenueByDay = billsByDate.entrySet().stream()
                .map(entry -> new RevenuePointDTO(
                        entry.getKey().toString(),
                        entry.getValue().stream().mapToLong(Bill::getTotalAmount).sum(),
                        entry.getValue().size()))
                .toList();

        List<Bill> todayBills = billsByDate.getOrDefault(today, List.of());
        Map<String, long[]> dishTotals = new LinkedHashMap<>();
        paidBills.stream()
                .filter(bill -> bill.getBillDateTime() != null)
                .filter(bill -> !bill.getBillDateTime().toLocalDate().isBefore(firstDay))
                .flatMap(bill -> bill.getBillItems().stream())
                .forEach(item -> {
                    long[] totals = dishTotals.computeIfAbsent(item.getBillItemName(), key -> new long[2]);
                    totals[0] += item.getBillItemQuantity();
                    totals[1] += (long) item.getBillItemPrice() * item.getBillItemQuantity();
                });

        List<TopDishDTO> topDishes = dishTotals.entrySet().stream()
                .map(entry -> new TopDishDTO(entry.getKey(), entry.getValue()[0], entry.getValue()[1]))
                .sorted(Comparator.comparingLong(TopDishDTO::getQuantity).reversed())
                .limit(5)
                .toList();

        DashboardResponseDTO response = new DashboardResponseDTO();
        response.setTodayRevenue(todayBills.stream().mapToLong(Bill::getTotalAmount).sum());
        response.setTodayOrders(todayBills.size());
        response.setTodayDishes(todayBills.stream().flatMap(bill -> bill.getBillItems().stream())
                .mapToLong(BillItem::getBillItemQuantity).sum());
        response.setActiveTables(tableRepository.findByStatus(Constants.ENTITY_STATUS.ACTIVE).stream()
                .filter(table -> table.getTableStatus() != null && !"Đang trống".equalsIgnoreCase(table.getTableStatus()))
                .count());
        response.setPeriodRevenue(revenueByDay.stream().mapToLong(RevenuePointDTO::getRevenue).sum());
        response.setRevenueByDay(revenueByDay);
        response.setTopDishes(topDishes);
        return response;
    }

    private boolean isPaid(Bill bill) {
        return bill.getOrder() != null && "Đã thanh toán".equalsIgnoreCase(bill.getOrder().getOrderStatus());
    }
}
