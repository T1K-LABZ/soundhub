import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SALES_ROWS_PER_PAGE } from "./sales.constants";
import { SalesJobCard } from "./SalesJobCard";
import type { Job } from "./sales.types";

type Props = {
  jobs: Job[];
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onPayment?: (job: Job) => void;
};

export function SalesTable({ jobs, onView, onEdit, onPayment }: Props) {
  const [visibleCount, setVisibleCount] = useState(SALES_ROWS_PER_PAGE);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleJobs = jobs.slice(0, visibleCount);
  const hasMore = visibleCount < jobs.length;

  function handleLoadMore() {
    setVisibleCount((p) => p + SALES_ROWS_PER_PAGE);
  }

  return (
    <Box>
      {visibleJobs.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No jobs match your filters
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {visibleJobs.map((job) => (
            <SalesJobCard
              key={job.id}
              job={job}
              expanded={expandedId === job.id}
              onToggle={() =>
                setExpandedId(expandedId === job.id ? null : job.id)
              }
              onView={() => onView(job)}
              onEdit={() => onEdit(job)}
              onPayment={onPayment ? () => onPayment(job) : undefined}
            />
          ))}
        </Box>
      )}

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Load More ({jobs.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}
