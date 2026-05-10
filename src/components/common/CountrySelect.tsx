"use client";

import * as React from "react";
import { UiSelect } from "../ui/select/UiSelectInput";
import utilsApiService from "@/services/misc-utils";


type Option = {
  label: string;
  value: string | number;
};

type CountrySelectProps = {
  value: string | number;
  onChange: (value: string | number) => void;

  label?: string;
  disabled?: boolean;
  error?: boolean;
  searchable?: boolean;
};

export function CountrySelect({
  value,
  onChange,
  label = "Country",
  disabled,
  error,
  searchable = true,
}: CountrySelectProps) {
  const [countries, setCountries] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);

        const response = await utilsApiService.getCountries();

        const formattedCountries = response.map((country) => ({
  label: country.name,
  // UiSelect uses strict equality for selected value.
  // Our form stores country_id as a string, so we normalize here.
  value: String(country.id),
}));

        setCountries(formattedCountries);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <UiSelect
      label={label}
      value={value}
      onChange={onChange}
      options={countries}
      disabled={disabled || loading}
      error={error}
      searchable={searchable}
    />
  );
}