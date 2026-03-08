package com.project.ezimenu.utils;

import java.util.ResourceBundle;

public class Constants {
    public static final String COMMON_DATE_FORMAT = "dd/MM/yyyy";
    public static final String COMMON_DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
    public static final String LOCALE_VN = "vi_VN";
    public static final String TIMEZONE_VN = "Asia/Ho_Chi_Minh";
    public static final Long shippingFee = 15000L;
    public static final String LOCAL_HOST = "http://localhost:8080";
    public static final String DEPLOYED = "";
    public static final ResourceBundle messages = ResourceBundle.getBundle("messages");
    public interface DISH_STATUS {
        short AVAILABLE = 1;
        short OUT_OF_DISH = 0;
    }

    public interface ENTITY_STATUS {
        short ACTIVE = 1;
        short INACTIVE = 0;
    }
}