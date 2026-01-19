"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyFinancials {
  month: string;
  totalRevenue: number;
  totalCommissions: number;
  netIncome: number;
  studentEnrollments: number;
}

interface RevenueChartProps {
  monthlyTrends: MonthlyFinancials[];
}

export default function RevenueChart({ monthlyTrends }: RevenueChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#3B82F6", "#EF4444", "#10B981"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.1,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      show: true,
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
    },
    xaxis: {
      categories: monthlyTrends.map(item => item.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
        formatter: (value: number) => {
          return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
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

  const series = [
    {
      name: "Total Revenue",
      data: monthlyTrends.map(item => item.totalRevenue),
    },
    {
      name: "Commissions Paid",
      data: monthlyTrends.map(item => item.totalCommissions),
    },
    {
      name: "Net Income",
      data: monthlyTrends.map(item => item.netIncome),
    },
  ];

  return (
    <div className="h-[350px]">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
}