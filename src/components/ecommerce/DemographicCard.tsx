"use client";
import Image from "next/image";

import CountryMap from "./CountryMap";
import { useState, useEffect } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface DemographicData {
  country: string;
  students: number;
  percentage: number;
}

interface MetricsData {
  demographics: DemographicData[];
  overview: {
    totalStudents: number;
  };
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics');
        const result = await response.json();
        if (result.success) {
          setMetrics(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const getCountryFlag = (country: string) => {
    const countryMappings: { [key: string]: string } = {
      'India': '/images/country/country-01.svg',
      'Nepal': '/images/country/country-02.svg',
      'Pakistan': '/images/country/country-03.svg',
      'Bangladesh': '/images/country/country-08.svg',
      'China': '/images/country/country-04.svg',
      'Saudi Arabia': '/images/country/country-05.svg',
      'USA': '/images/country/country-06.svg',
      'Australia': '/images/country/country-07.svg',
      'Sri Lanka': '/images/country/country-09.svg',
      'Egypt': '/images/country/country-10.svg'
    };
    return countryMappings[country] || '/images/country/country-01.svg';
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Student Demographics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of students by country of birth
          </p>
        </div>

        <div className="relative inline-block">
          <button
            type="button"
            onClick={toggleDropdown}
            className="dropdown-toggle"
            aria-label="More options"
            title="More options"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div>
                    <div className="w-20 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                    <div className="w-16 h-3 mt-1 bg-gray-200 rounded dark:bg-gray-700"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          metrics?.demographics.slice(0, 5).map((demographic) => (
            <div key={demographic.country} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="items-center w-full rounded-full max-w-8">
                  <Image
                    width={48}
                    height={48}
                    src={getCountryFlag(demographic.country)}
                    alt={demographic.country.toLowerCase()}
                    className="w-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {demographic.country}
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {demographic.students.toLocaleString()} Students
                  </span>
                </div>
              </div>

              <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                  <div 
                    className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                    style={{ width: `${demographic.percentage}%` }}
                  ></div>
                </div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {demographic.percentage}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
