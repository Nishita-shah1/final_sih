import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, setDateRange }) => {
  return (
    <div className="filter-section">
      <label>Date Range</label>
      <div className="date-picker-wrapper">
        <DatePicker
          selected={dateRange.startDate}
          onChange={(date: Date | null) => setDateRange({ ...dateRange, startDate: date })}
          selectsStart
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="Start Date"
        />
        <DatePicker
          selected={dateRange.endDate}
          onChange={(date: Date | null) => setDateRange({ ...dateRange, endDate: date })}
          selectsEnd
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          minDate={dateRange.startDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="End Date"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;