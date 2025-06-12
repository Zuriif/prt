package com.bi_service.dto.request;

import lombok.Data;

@Data
public class DateRangeRequest {
    private String startDate;
    private String endDate;
    private String interval; // daily, weekly, monthly, yearly
    private String metric; // Optional: specific metric to analyze
}
