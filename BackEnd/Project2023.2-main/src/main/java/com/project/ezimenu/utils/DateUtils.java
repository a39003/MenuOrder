package com.project.ezimenu.utils;

import java.time.format.DateTimeFormatter;

public class DateUtils {
    public static final String DATE_FORMAT_ISO = "dd-MM-yyyy HH:mm:ss";

    public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT_ISO);
}
