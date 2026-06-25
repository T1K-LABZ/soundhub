import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { ROWS_PER_PAGE } from "./inventory.constants";
import { InventoryMovementCard } from "./InventoryMovementCard";
import type { StockMovement } from "./inventory.types";

type Props = {
  movements: StockMovement[];
  onArriveClick: (movement: StockMovement) => void;
};

export function InventoryTable({ movements, onArriveClick }: Props) {
  const [visibleCount, setVisibleCount] = useState(ROWS_PER_PAGE);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleMovements = movements.slice(0, visibleCount);
  const hasMore = visibleCount < movements.length;

  function handleLoadMore() {
    setVisibleCount((p) => p + ROWS_PER_PAGE);
  }

  return (
    <Box>
      {visibleMovements.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No movements match your filters
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {visibleMovements.map((movement) => (
            <InventoryMovementCard
              key={movement.id}
              movement={movement}
              expanded={expandedId === movement.id}
              onToggle={() =>
                setExpandedId(expandedId === movement.id ? null : movement.id)
              }
              onArriveClick={onArriveClick}
            />
          ))}
        </Box>
      )}

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More ({movements.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}
