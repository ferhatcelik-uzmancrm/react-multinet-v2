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
  required?: boolean; // Zorunluluk kontrolü
  error?: boolean; // Hata durumu
  helperText?: string; // Yardımcı metin (örneğin, hata mesajı)
}

const GenericAutocomplete: React.FC<GenericAutocompleteProps> = ({
  apiEndpoint,
  label,
  getCRMData,
  selectedValue,
  onValueChange,
  required = false,
  error = false, // Varsayılan olarak hata yok
  helperText = '', // Varsayılan olarak hata mesajı yok
}) => {
  const [options, setOptions] = useState<LookupOptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null); // Hata için local state

  const handleBlur = () => {
    if (required && !selectedValue) {
      setLocalError(`${label} alanı zorunludur.`); // Zorunlu ve boşsa hata mesajı
    } else {
      setLocalError(null); // Alan doluysa hatayı sıfırla
    }
  };
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
      setLoading(false);
    }
  }, 500);

useEffect(() => {
  debouncedFetch(inputValue);
  return () => {
    debouncedFetch.cancel();
  };
}, [inputValue, debouncedFetch]);

  return (
    <Autocomplete
        options={options}
        getOptionLabel={(option) => option.Name} // Şirket adını göster
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Input değişikliklerini takip et
        isOptionEqualToValue={(option, value) => option.Id === value.Id} // Seçili değer ile karşılaştır
        value={selectedValue} // Seçili değeri kontrol et
        onBlur={handleBlur} // Boş bırakıldığında kontrol et
        onChange={(event, value) => {
          if (onValueChange) {
            onValueChange(value); // Seçim değişikliğini güncelle
            setLocalError(null); // Seçim yapıldığında hatayı sıfırla
          }
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            error={Boolean(error || localError)} // Hata varsa kırmızı çerçeve
            helperText={localError || helperText} // Hata mesajını göster
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
