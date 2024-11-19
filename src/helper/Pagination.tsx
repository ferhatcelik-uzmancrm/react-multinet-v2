import React, { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/joy";

interface PaginationComponentProps {
    fetchData: (request: any) => Promise<any[]>; // fetchData'nın dönüş tipi dinamik ayarlanabilir
    requestPayload: any; // İstek için gereken parametrelerin tipi
  }
  
  const PaginationComponent: React.FC<PaginationComponentProps> = ({
    fetchData,
    requestPayload,
  }) => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);
    const itemsPerPage = 15;
  
    useEffect(() => {
      const fetchDataFromServer = async () => {
        try {
          const result = await fetchData(requestPayload);
          setData(result);
        } catch (error) {
          alert("Veri getirilirken bir hata oluştu.");
        }
      };
      fetchDataFromServer();
    }, [fetchData, requestPayload]);
  
    useEffect(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentData = data.slice(startIndex, startIndex + itemsPerPage);
      setPaginatedData(currentData);
    }, [currentPage, data]);
  
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    return (
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 4,
          gap: 1,
          [`& .MuiIconButton-root`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<i data-feather="arrow-left" />}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Önceki
        </Button>
  
        <Box sx={{ flex: 1 }} />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={page === currentPage ? "outlined" : "plain"}
            color="neutral"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
  
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<i data-feather="arrow-right" />}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Sonraki
        </Button>
  
        <Box>
          {paginatedData.map((item, index) => (
            <div key={index}>{JSON.stringify(item)}</div>
          ))}
        </Box>
      </Box>
    );
  };
  
  export default PaginationComponent;
