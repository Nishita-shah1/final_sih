import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

type RangeSliderProps = {
  label: string;
  range: [number, number];
  setRange: (value: [number, number]) => void;
  min: number;
  max: number;
  unit: string;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  range,
  setRange,
  min,
  max,
  unit,
}) => {
  return (
    <div className="filter-section">
      <label>{label}</label>
      <Slider
        range
        min={min}
        max={max}
        value={range}
        onChange={(value) => setRange(value as [number, number])}
        railStyle={{ backgroundColor: "#575757" }}
        trackStyle={[{ backgroundColor: "#0d2b5d" }]}
        handleStyle={[
          { borderColor: "#0d2b5d", backgroundColor: "#0d2b5d" },
          { borderColor: "#0d2b5d", backgroundColor: "#0d2b5d" },
        ]}
      />
      <div className="slider-values">
        <span>
          {range[0].toFixed(2)}{unit}
        </span>
        <span>
          {range[1].toFixed(2)}{unit}
        </span>
      </div>
    </div>
  );
};

export default RangeSlider;