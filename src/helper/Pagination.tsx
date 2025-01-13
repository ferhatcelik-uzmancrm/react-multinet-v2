import React from "react";
import { IconButton, Button, Box, Typography } from "@mui/joy";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const calculatePageNumbers = (totalPages: number, currentPage: number): (number | string)[] => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, '...');
      const start = Math.max(currentPage - 2, 3);
      const end = Math.min(currentPage + 2, totalPages - 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      pages.push('...', totalPages - 1, totalPages);
    }
    return pages;
  };
  
  return (
    <>
      {/* Desktop Pagination */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 1,
          alignItems: "center",
          pt: 4,
        }}
      >
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          startDecorator={<i data-feather="arrow-left" />}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Önceki
        </Button>
        <Box sx={{ flex: 1 }} />
        {calculatePageNumbers(totalPages, currentPage).map((page, index) => (
          <IconButton
            key={index}
            size="sm"
            variant={page === currentPage ? "outlined" : "plain"}
            color="neutral"
            onClick={() => {
              if (page !== "...") {
                onPageChange(Number(page));
              }
            }}
          >
            {page === "..." ? "..." : page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="plain"
          color="neutral"
          endDecorator={<i data-feather="arrow-right" />}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Sonraki
        </Button>
      </Box>

      {/* Mobile Pagination */}
      <Box
        className="Pagination-mobile"
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "space-between",
          pt: 2,
        }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <i data-feather="arrow-left" />
        </IconButton>
        <Typography level="body-sm" mx="auto">
          Sayfa {currentPage} / {totalPages}
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <i data-feather="arrow-right" />
        </IconButton>
      </Box>
    </>
  );
};

export default Pagination;
