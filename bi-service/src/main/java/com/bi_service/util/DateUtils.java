package com.bi_service.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class DateUtils {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static LocalDateTime parseDateTime(String dateTimeStr) {
        return LocalDateTime.parse(dateTimeStr, formatter);
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(formatter);
    }

    public static List<LocalDateTime> generateTimePoints(LocalDateTime start, LocalDateTime end, String interval) {
        List<LocalDateTime> timePoints = new ArrayList<>();
        LocalDateTime current = start;
        ChronoUnit unit;

        switch (interval.toLowerCase()) {
            case "daily":
                unit = ChronoUnit.DAYS;
                break;
            case "weekly":
                unit = ChronoUnit.WEEKS;
                break;
            case "monthly":
                unit = ChronoUnit.MONTHS;
                break;
            case "yearly":
                unit = ChronoUnit.YEARS;
                break;
            default:
                unit = ChronoUnit.DAYS;
        }

        while (!current.isAfter(end)) {
            timePoints.add(current);
            current = current.plus(1, unit);
        }

        return timePoints;
    }

    public static String getIntervalKey(LocalDateTime dateTime, String interval) {
        switch (interval.toLowerCase()) {
            case "daily":
                return dateTime.toLocalDate().toString();
            case "weekly":
                int weekNumber = dateTime.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
                return dateTime.toLocalDate().toString() + " - Week " + weekNumber;
            case "monthly":
                return dateTime.getYear() + "-" + String.format("%02d", dateTime.getMonthValue());
            case "yearly":
                return String.valueOf(dateTime.getYear());
            default:
                return dateTime.toLocalDate().toString();
        }
    }
}
