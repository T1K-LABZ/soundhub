import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { CUSTOMERS_PER_PAGE } from "./customers.constants";
import { CustomerListCard } from "./CustomerListCard";
import type { Customer } from "./customers.types";

type Props = {
  customers: Customer[];
  onView: (c: Customer) => void;
  onSendOffer: (c: Customer) => void;
  onEdit: (c: Customer) => void;
};

export function CustomerTable({ customers, onView, onSendOffer, onEdit }: Props) {
  const [visibleCount, setVisibleCount] = useState(CUSTOMERS_PER_PAGE);

  const visibleCustomers = customers.slice(0, visibleCount);
  const hasMore = visibleCount < customers.length;

  function handleLoadMore() {
    setVisibleCount((p) => p + CUSTOMERS_PER_PAGE);
  }

  return (
    <Box>
      {visibleCustomers.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No customers match your filters
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {visibleCustomers.map((customer) => (
            <CustomerListCard
              key={customer.id}
              customer={customer}
              onView={() => onView(customer)}
              onSendOffer={() => onSendOffer(customer)}
              onEdit={() => onEdit(customer)}
            />
          ))}
        </Box>
      )}

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More ({customers.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}
