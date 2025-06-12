package com.bi_service.dto.request;

import lombok.Data;

@Data
public class TimeframeRequest {
    private String timeframe; // daily, weekly, monthly, yearly
    private String startDate;
    private String endDate;
    private String metric; // metric to analyze
    private String interval; // interval for analysis
}
