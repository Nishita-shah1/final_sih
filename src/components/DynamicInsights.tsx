/* eslint-disable */
import React from "react";
import { Line, Pie } from "react-chartjs-2";

interface DynamicInsightsProps {
  title: string;
  graphType: "line" | "pie";
  data: any;
  calculateInsights: () => string[];
}

const DynamicInsights: React.FC<DynamicInsightsProps> = ({
  title,
  graphType,
  data,
  calculateInsights,
}) => {
  const insights = calculateInsights();

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h4 className="text-lg font-semibold mb-2">Insights:</h4>
        <ul className="list-disc pl-5">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
      {graphType === "line" && <Line data={data} />}
      {graphType === "pie" && <Pie data={data} />}
    </div>
  );
};

export default DynamicInsights;
