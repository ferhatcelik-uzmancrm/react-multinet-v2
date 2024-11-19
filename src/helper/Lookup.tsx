/*import { Autocomplete, CircularProgress, TextField } from "@mui/material";
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
*/
// import { Autocomplete, CircularProgress, TextField } from "@mui/material";
// import { AxiosResponse } from "axios";
// import { debounce } from "lodash";
// import React, { useEffect, useMemo, useState } from "react";
// import { LookupOptionType } from "../models/Lookup";

// interface GenericAutocompleteProps {
//   apiEndpoint: string;
//   label: string;
//   getCRMData: (url: string, params: any) => Promise<AxiosResponse>;
//   selectedValue?: LookupOptionType | LookupOptionType[] | null;
//   onValueChange?: (value: LookupOptionType | LookupOptionType[] | null) => void;
//   required?: boolean;
//   error?: boolean;
//   helperText?: string;
//   isMulti?: boolean; // Çoklu seçim özelliği opsiyonel
// }

// const GenericAutocomplete: React.FC<GenericAutocompleteProps> = ({
//   apiEndpoint,
//   label,
//   getCRMData,
//   selectedValue = null,
//   onValueChange,
//   required = false,
//   error = false,
//   helperText = '',
//   isMulti = false, // Varsayılan olarak tekli seçim
// }) => {
//   const [options, setOptions] = useState<LookupOptionType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [localError, setLocalError] = useState<string | null>(null);

//   const handleBlur = () => {
//     if (required && (!selectedValue || (isMulti && (selectedValue as LookupOptionType[]).length === 0))) {
//       setLocalError(`${label} alanı zorunludur.`);
//     } else {
//       setLocalError(null);
//     }
//   };

//   const requestParams = useMemo(() => ({
//     UserId: localStorage.getItem("userid")?.toString() || "",
//     CrmUserId: localStorage.getItem("crmuserid")?.toString() || "",
//     UserCityId: localStorage.getItem("crmusercityid")?.toString() || "",
//     Name: ""
//   }), []);

//   const fetchData = async (query: string) => {
//     try {
//       setLoading(true);
//       const response = await getCRMData(apiEndpoint, { ...requestParams, Name: query });
//       setOptions(response.data);
      
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetch = debounce((value: string) => {
//     if (value.length >= 3) {
//       fetchData(value);   
//     } else {
//       setOptions([]);
//     }
    
//   }, 500);

//   useEffect(() => {
//     debouncedFetch(inputValue);
//     return () => {
//       debouncedFetch.cancel();
//     };
//   }, [inputValue, debouncedFetch]);

//   return (
//     <Autocomplete
//       multiple={isMulti} // isMulti true ise çoklu seçim aktif olur
//       options={options}
//       getOptionLabel={(option) => option.Name}
//       onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
//       isOptionEqualToValue={(option, value) => option.Id === value.Id}
//       value={selectedValue}
//       onBlur={handleBlur}
//       onChange={(event, value) => {
//         if (onValueChange) {
//           onValueChange(value);
//           setLocalError(null);
//         }
//       }}
//       loading={loading}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           variant="outlined"
//           error={Boolean(error || localError)}
//           helperText={localError || helperText}
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <>
//                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// };

// export default GenericAutocomplete;


import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { AxiosResponse } from "axios";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { LookupOptionType } from "../models/Lookup";

interface GenericAutocompleteProps {
  apiEndpoint: string;
  label: string;
  getCRMData: (url: string, params: any) => Promise<AxiosResponse>;
  selectedValue?: LookupOptionType | LookupOptionType[] | null;
  onValueChange?: (value: LookupOptionType | LookupOptionType[] | null) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  isMulti?: boolean; // Çoklu seçim opsiyonel
  filterParams?: Record<string, any>; // Filtre parametreleri
}

const GenericAutocomplete: React.FC<GenericAutocompleteProps> = ({
  apiEndpoint,
  label,
  getCRMData,
  selectedValue = null,
  onValueChange,
  required = false,
  disabled = false, 
  error = false,
  helperText = '',
  isMulti = false,
  filterParams = null,
}) => {
  const [options, setOptions] = useState<LookupOptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [hasFocus, setHasFocus] = useState(false); // Kullanıcının alana odaklanıp odaklanmadığını takip edin.
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // Kullanıcı tıkladığında bir kez istek atmayı kontrol eder

  const handleBlur = () => {
    if (required && (!selectedValue || (isMulti && (selectedValue as LookupOptionType[]).length === 0))) {
      setLocalError(`${label} alanı zorunludur.`);
    } else {
      setLocalError(null);
    }
    setHasFocus(false); // Odak kaybolduğunda focus durumunu sıfırla
  };

  const requestParams = useMemo(() => ({
    UserId: localStorage.getItem("userid")?.toString() || "",
    CrmUserId: localStorage.getItem("crmuserid")?.toString() || "",
    UserCityId: localStorage.getItem("crmusercityid")?.toString() || "",
    Name: "",
    Filter: filterParams ? filterParams : {} // Filter null gelmesini engeller, boş nesne gönderir.
}), [filterParams]);

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      console.log("Error fetching data:", filterParams);
      const response = await getCRMData(apiEndpoint, { ...requestParams, Filter: filterParams, Name: query });
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((value: string) => {
    if (value.length >= 3) {
      fetchData(value);
    } else {
      setOptions([]);
    }
  }, 500);

  const handleFocus = () => {
    setHasFocus(true); // Odaklandığında true
  };

  useEffect(() => {
    if (hasFocus && inputValue.length >= 3) {
      debouncedFetch(inputValue);
    }
    // Filter params değiştiğinde listeyi güncelle
    if (filterParams && inputValue.length >= 3) {
      fetchData(inputValue);
    }
  }, [filterParams, hasFocus, inputValue, debouncedFetch]);

  useEffect(() => {
    // Alana yazma veya odaklanma durumlarını yönet
    if (hasFocus && inputValue.length >= 3) {
      debouncedFetch(inputValue);
    }
    // Kullanıcı değeri sildiğinde listeyi sıfırla
    if (inputValue === "") {
      setOptions([]);
      setLoading(false); // Gereksiz loading göstergesini durdur
    }
    return () => {
      debouncedFetch.cancel();
    };
  }, [inputValue, hasFocus, debouncedFetch]);

  return (
    <Autocomplete
      multiple={isMulti}
      options={options}
      getOptionLabel={(option) => option.Name}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue); // Yazılan değeri güncelle
      }}
      onFocus={handleFocus} // Kullanıcı alana odaklandığında
      onBlur={handleBlur}   // Kullanıcı odak kaybettiğinde
      isOptionEqualToValue={(option, value) => option.Id === value.Id}
      value={selectedValue}
      onChange={(event, value) => {
        if (onValueChange) {
          onValueChange(value);
          setLocalError(null);
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          error={Boolean(error || localError)}
          helperText={localError || helperText}
          disabled={disabled}
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
