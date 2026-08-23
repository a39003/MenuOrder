package com.project.ezimenu.services;

import com.project.ezimenu.dtos.DishDTO.DishRequestDTO;
import com.project.ezimenu.dtos.DishDTO.DishResponseDTO;
import com.project.ezimenu.dtos.MenuDTO.MenuRequestDTO;
import com.project.ezimenu.dtos.MenuDTO.MenuResponseDTO;
import com.project.ezimenu.entities.Dish;
import com.project.ezimenu.entities.Menu;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.Table;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.DishRepository;
import com.project.ezimenu.repositories.MenuRepository;
import com.project.ezimenu.repositories.OrderRepository;
import com.project.ezimenu.repositories.TableRepository;
import com.project.ezimenu.services.interfaces.IMenuService;
import com.project.ezimenu.utils.Constants;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class MenuService implements IMenuService {
    @Autowired
    private MenuRepository menuRepository;
    @Autowired
    private DishRepository dishRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private TableRepository tableRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private Type listType;
    @Autowired
    private NotificationService notificationService;
    public List<MenuResponseDTO> getAllMenus() {
        List<Menu> menus = menuRepository.findByStatus(Constants.ENTITY_STATUS.ACTIVE);
        return menus.stream()
                .map(menu -> {
                    MenuResponseDTO menuResponseDTO = modelMapper.map(menu, MenuResponseDTO.class);
                    List<DishResponseDTO> dishResponseDTOs = menu.getDishes().stream()
                            .filter(dish -> dish.getStatus() == Constants.ENTITY_STATUS.ACTIVE)
                            .map(dish -> modelMapper.map(dish, DishResponseDTO.class))
                            .collect(Collectors.toList());
                    menuResponseDTO.setDishResponseDTO(dishResponseDTOs);
                    return menuResponseDTO;
                })
                .collect(Collectors.toList());
    }
    @Transactional
    public List<MenuResponseDTO> getAllMenusAndCreateOrder(Long tableId, String customerName) throws NotFoundException {
        Table table = tableRepository.findByIdWithoutRelations(tableId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn với id: " + tableId));
        // Tạo order mới nếu bàn trống
        if(table.getTableStatus().equals("Đang trống")){
            table.setTableStatus("Đang order");
            table.setStartOrderingTime(LocalDateTime.now());
            Order newOrder = new Order();
            newOrder.setTable(table);
            newOrder.setOrderStatus("Đang order");
            newOrder.setCustomerName(customerName);
            tableRepository.save(table);
            orderRepository.save(newOrder);
            notificationService.addNotification(tableId, "Khách ở bàn " + tableId + " đang order.");
        } else {
            orderRepository.findFirstByTableOrderByOrderIdDesc(table)
                    .filter(currentOrder -> currentOrder.getCustomerName() == null || currentOrder.getCustomerName().isBlank())
                    .ifPresent(currentOrder -> {
                        currentOrder.setCustomerName(customerName);
                        orderRepository.save(currentOrder);
                    });
        }
        List<Menu> menus = menuRepository.findByStatus(Constants.ENTITY_STATUS.ACTIVE);
        return menus.stream()
                .map(menu -> {
                    MenuResponseDTO menuResponseDTO = modelMapper.map(menu, MenuResponseDTO.class);
                    List<DishResponseDTO> dishResponseDTOs = menu.getDishes().stream()
                            .filter(dish -> dish.getStatus() == Constants.ENTITY_STATUS.ACTIVE)
                            .map(dish -> modelMapper.map(dish, DishResponseDTO.class))
                            .collect(Collectors.toList());
                    menuResponseDTO.setDishResponseDTO(dishResponseDTOs);
                    return menuResponseDTO;
                })
                .collect(Collectors.toList());
    }

    public MenuResponseDTO getMenuById(Long menuId) throws NotFoundException{
        Menu menu = menuRepository.findByMenuIdAndStatus(menuId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy thực đơn có id: " + menuId));
        MenuResponseDTO menuResponseDTO = modelMapper.map(menu, MenuResponseDTO.class);
        List<DishResponseDTO> dishResponseDTOs = menu.getDishes().stream()
                .filter(dish -> dish.getStatus() == Constants.ENTITY_STATUS.ACTIVE)
                .map(dish -> modelMapper.map(dish, DishResponseDTO.class))
                .collect(Collectors.toList());
        menuResponseDTO.setDishResponseDTO(dishResponseDTOs);
        return menuResponseDTO;
    }

    public Menu addMenu(MenuRequestDTO menuRequestDTO) throws BadRequestException {
        if(menuRequestDTO.getMenuTitle() == null || "".equals(menuRequestDTO.getMenuTitle())){
            throw new BadRequestException("Vui lòng điền tên thực đơn!");
        }
        Optional<Menu> existingMenu = menuRepository.findByMenuTitleAndStatus(menuRequestDTO.getMenuTitle(), Constants.ENTITY_STATUS.ACTIVE);
        if(existingMenu.isPresent()){
            throw new BadRequestException("Tên thực đơn đã tồn tại!");
        }
        Menu newMenu = new Menu();
        newMenu.setMenuTitle(menuRequestDTO.getMenuTitle());
        newMenu.setStatus(Constants.ENTITY_STATUS.ACTIVE);
        newMenu.setMenuDescription(menuRequestDTO.getMenuDescription());
        return menuRepository.save(newMenu);
    }

    public Menu updateMenu(Long menuId, MenuRequestDTO menuRequestDTO) throws NotFoundException, BadRequestException {
        if(menuRequestDTO.getMenuTitle() == null || "".equals(menuRequestDTO.getMenuTitle())){
            throw new BadRequestException("Vui lòng điền tên thực đơn!");
        }
        Menu updatedMenu = menuRepository.findByMenuIdAndStatus(menuId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy thực đơn có id: " + menuId));
        updatedMenu.setMenuTitle(menuRequestDTO.getMenuTitle());
        updatedMenu.setMenuDescription(menuRequestDTO.getMenuDescription());
        return menuRepository.save(updatedMenu);
    }

    public Menu deleteMenu(Long menuId) throws NotFoundException {
        Menu menu = menuRepository.findByMenuIdAndStatus(menuId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy thực đơn có id: " + menuId));
        menu.setStatus(Constants.ENTITY_STATUS.INACTIVE);
        return menuRepository.save(menu);
    }
    private Dish convertToDish(DishRequestDTO dishRequestDTO) {
        Dish dish = new Dish();
        dish.setDishName(dishRequestDTO.getDishName());
        dish.setDishPrice(dishRequestDTO.getDishPrice());
        dish.setDishStatus(dishRequestDTO.getDishStatus());
        dish.setMenu(null);
        return dish;
    }
}
