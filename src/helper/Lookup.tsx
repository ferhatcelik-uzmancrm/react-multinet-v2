import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { LookupOptionType } from "../models/Lookup";

interface GenericAutocompleteProps {
  apiEndpoint: string;
  label: string;
  getCRMData: (url: string, params: any) => Promise<AxiosResponse>;
  selectedValue?: LookupOptionType | null; // Optional prop for selected value
  onValueChange?: (value: LookupOptionType | null) => void; // Optional prop for handling value changes
}

const GenericAutocomplete: React.FC<GenericAutocompleteProps> = ({
  apiEndpoint,
  label,
  getCRMData,
  selectedValue,
  onValueChange,
}) => {
  const [options, setOptions] = useState<LookupOptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // useMemo to define requestParams with static fields and dynamic 'Name'
  const requestParams = useMemo(() => ({
    UserId: localStorage.getItem("userid")?.toString() || "",
    CrmUserId: localStorage.getItem("crmuserid")?.toString() || "",
    UserCityId: localStorage.getItem("crmusercityid")?.toString() || "",
    Name: ""
  }), []);

  const fetchData = async (query: string) => {
    setLoading(true);
    try {
      const response = await getCRMData(apiEndpoint, { ...requestParams, Name: query });
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce API call to prevent too many requests
  const debouncedFetch = debounce((value: string) => {
    if (value.length >= 3) {
      fetchData(value);
    } else {
      setOptions([]); // Clear options if input is less than 3 characters
    }
  }, 500);

  useEffect(() => {
    debouncedFetch(inputValue);
    return () => {
      debouncedFetch.cancel();
    };
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.Name} // Display the name of the company
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Track input value changes
      isOptionEqualToValue={(option, value) => option.Id === value.Id} // Compare by CompanyId
      value={selectedValue} // Controlled value for the selected option
      onChange={(event, value) => {
        if (onValueChange) {
          onValueChange(value); // Update the selected value in the parent component
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default GenericAutocomplete;
