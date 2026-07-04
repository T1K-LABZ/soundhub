import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useJobsQuery } from "./sales.api";
import { JOB_STATUS_COLOR, PAYMENT_STATUS_COLOR } from "./sales.constants";
import type { Job } from "./sales.types";
import { formatJobDate, formatKsh } from "./sales.utils";
import { ViewJobModal } from "./ViewJobModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PlateSearchModal({ open, onClose }: Props) {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: allJobs = [] } = useJobsQuery(storeId);
  const [query, setQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const cleanQuery = query.trim().toUpperCase();

  // All jobs matching the plate
  const matchedJobs = cleanQuery
    ? allJobs.filter((j) => j.carPlate.toUpperCase().includes(cleanQuery))
    : [];

  // Aggregate car summary from matched jobs
  const carInfo =
    matchedJobs.length > 0
      ? {
          make: matchedJobs[0].carMake,
          model: matchedJobs[0].carModel,
          variant: matchedJobs[0].carVariant,
          year: matchedJobs[0].carYear,
          totalSpent: matchedJobs.reduce((s, j) => s + (Number(j.grandTotal) || 0), 0),
          visits: matchedJobs.length,
        }
      : null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Search by Plate</DialogTitle>

        <DialogContent>
          {/* Search input */}
          <TextField
            autoFocus
            fullWidth
            placeholder="Enter car plate, e.g. KDA 123A"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            size="small"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Car summary banner */}
          {carInfo && (
            <Box
              sx={{
                bgcolor: "background.default",
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">
                {carInfo.make} {carInfo.model} {carInfo.variant} ({carInfo.year}
                )
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {carInfo.visits} visit{carInfo.visits !== 1 ? "s" : ""} · Total
                spent: {formatKsh(carInfo.totalSpent)}
              </Typography>
            </Box>
          )}

          {/* No results */}
          {cleanQuery && matchedJobs.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={3}
            >
              No jobs found for "{cleanQuery}"
            </Typography>
          )}

          {/* Timeline cards */}
          {matchedJobs.map((job) => (
            <Card key={job.id} variant="outlined" sx={{ mb: 1 }}>
              <CardActionArea onClick={() => setSelectedJob(job)}>
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight={700}>
                      {job.jobRef}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatJobDate(job.createdAt)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={job.serviceType}
                      size="small"
                      sx={{ fontSize: "0.68rem" }}
                    />
                    <Chip
                      label={job.jobStatus}
                      size="small"
                      sx={{
                        bgcolor: `${JOB_STATUS_COLOR[job.jobStatus]}18`,
                        color: JOB_STATUS_COLOR[job.jobStatus],
                        fontWeight: 600,
                        fontSize: "0.68rem",
                      }}
                    />
                    <Chip
                      label={job.paymentStatus}
                      size="small"
                      sx={{
                        bgcolor: `${PAYMENT_STATUS_COLOR[job.paymentStatus]}18`,
                        color: PAYMENT_STATUS_COLOR[job.paymentStatus],
                        fontWeight: 600,
                        fontSize: "0.68rem",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={0.5}
                  >
                    {job.technicianName} · {job.products.length} product
                    {job.products.length !== 1 ? "s" : ""} ·{" "}
                    {formatKsh(job.grandTotal)}
                  </Typography>
                  {job.installationNotes && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {job.installationNotes}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </DialogContent>
      </Dialog>

      {/* Clicking a card opens ViewJobModal */}
      <ViewJobModal
        open={selectedJob !== null}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </>
  );
}
