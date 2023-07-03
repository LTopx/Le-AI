import React from "react";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, BarChart, CanvasRenderer]);

const Cost: React.FC = () => {
  const costRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const dom = costRef.current;
    const myChart = echarts.init(dom as HTMLDivElement);
    const option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };
    myChart.setOption(option);
  }, []);

  return <div ref={costRef} className="w-full h-80 bg-fuchsia-100" />;
};

export default Cost;
