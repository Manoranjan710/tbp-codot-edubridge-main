"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface RevenueBreakdownChartProps {
  revenueBreakdown: RevenueBreakdown[];
}

export default function RevenueBreakdownChart({ revenueBreakdown }: RevenueBreakdownChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    labels: revenueBreakdown.map(item => item.category),
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      fontSize: "14px",
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              offsetY: 10,
              formatter: (val: string) => {
                return new Intl.NumberFormat('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(parseFloat(val));
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Revenue",
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7280",
              formatter: () => {
                const total = revenueBreakdown.reduce((sum, item) => sum + item.amount, 0);
                return new Intl.NumberFormat('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(total);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#FFFFFF"],
      },
      dropShadow: {
        enabled: true,
        blur: 1,
        color: "#000000",
        opacity: 0.8,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          const item = revenueBreakdown[seriesIndex];
          return `${new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.amount)} (${item.percentage.toFixed(1)}%)`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = revenueBreakdown.map(item => item.amount);

  return (
    <div className="h-[350px]">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
}