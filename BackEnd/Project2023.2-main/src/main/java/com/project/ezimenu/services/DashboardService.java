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
import java.time.YearMonth;
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

        YearMonth currentMonth = YearMonth.from(today);
        Map<YearMonth, List<Bill>> billsByMonth = new LinkedHashMap<>();
        for (int offset = 11; offset >= 0; offset--) {
            billsByMonth.put(currentMonth.minusMonths(offset), new ArrayList<>());
        }
        paidBills.stream()
                .filter(bill -> bill.getBillDateTime() != null)
                .filter(bill -> !YearMonth.from(bill.getBillDateTime()).isBefore(currentMonth.minusMonths(11)))
                .filter(bill -> !YearMonth.from(bill.getBillDateTime()).isAfter(currentMonth))
                .forEach(bill -> billsByMonth.get(YearMonth.from(bill.getBillDateTime())).add(bill));

        List<RevenuePointDTO> revenueByMonth = billsByMonth.entrySet().stream()
                .map(entry -> new RevenuePointDTO(
                        entry.getKey().toString(),
                        entry.getValue().stream().mapToLong(Bill::getTotalAmount).sum(),
                        entry.getValue().size()))
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
        long allTimeRevenue = paidBills.stream().mapToLong(Bill::getTotalAmount).sum();
        response.setAllTimeRevenue(allTimeRevenue);
        response.setTotalPaidBills(paidBills.size());
        response.setAverageBillValue(paidBills.isEmpty() ? 0L : allTimeRevenue / paidBills.size());
        response.setVipRevenue(paidBills.stream()
                .filter(bill -> "VIP".equalsIgnoreCase(resolveTableType(bill)))
                .mapToLong(Bill::getTotalAmount).sum());
        response.setRegularRevenue(paidBills.stream()
                .filter(bill -> !"VIP".equalsIgnoreCase(resolveTableType(bill)))
                .mapToLong(Bill::getTotalAmount).sum());
        response.setRevenueByDay(revenueByDay);
        response.setRevenueByMonth(revenueByMonth);
        response.setTopDishes(topDishes);
        return response;
    }

    private boolean isPaid(Bill bill) {
        return bill.getOrder() != null && "Đã thanh toán".equalsIgnoreCase(bill.getOrder().getOrderStatus());
    }

    private String resolveTableType(Bill bill) {
        if (bill.getTableTypeSnapshot() != null) return bill.getTableTypeSnapshot();
        if (bill.getOrder() != null && bill.getOrder().getTable() != null
                && bill.getOrder().getTable().getTableType() != null) {
            return bill.getOrder().getTable().getTableType();
        }
        return "THƯỜNG";
    }
}
