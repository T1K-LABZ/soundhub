import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Collapse,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import { useJobsQuery } from "./sales.api";
import { DIFFICULTY_COLOR } from "./sales.constants";
import type { Job } from "./sales.types";
import { formatJobDate } from "./sales.utils";

type SortMode = "recent" | "complex" | "issues";

const SORT_LABELS: Record<SortMode, string> = {
  recent: "Most Recent",
  complex: "Most Complex",
  issues: "Most Issues",
};

const COMPLEXITY_RANK: Record<string, number> = {
  Easy: 0,
  Medium: 1,
  Complex: 2,
};

export function KnowledgeBasePanel() {
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: allJobs = [] } = useJobsQuery(storeId);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");

  const q = search.toLowerCase();

  const filtered: Job[] = allJobs.filter((j) => {
    if (!q) return true;
    const target = [j.carMake, j.carModel, j.carVariant, j.serviceType]
      .join(" ")
      .toLowerCase();
    return target.includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "complex") {
      return (
        COMPLEXITY_RANK[b.difficultyRating] -
        COMPLEXITY_RANK[a.difficultyRating]
      );
    }
    // "issues" — jobs with encountered issues first
    const aHas = a.issuesEncountered ? 1 : 0;
    const bHas = b.issuesEncountered ? 1 : 0;
    return bHas - aHas;
  });

  return (
    <Box sx={{ mt: 3 }}>
      {/* Toggle header */}
      <Button
        variant="text"
        endIcon={open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        onClick={() => setOpen((v) => !v)}
        sx={{ mb: 1, fontWeight: 600, textTransform: "none" }}
      >
        Knowledge Base — Installation Reference
      </Button>

      <Collapse in={open} unmountOnExit>
        {/* Search + sort row */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <TextField
            placeholder="Search car make, model or variant…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <ButtonGroup size="small">
            {(["recent", "complex", "issues"] as SortMode[]).map((mode) => (
              <Button
                key={mode}
                variant={sort === mode ? "contained" : "outlined"}
                onClick={() => setSort(mode)}
              >
                {SORT_LABELS[mode]}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* Results */}
        {sorted.length === 0 ? (
          <Typography variant="body2" color="text.secondary" py={2}>
            No records match your search.
          </Typography>
        ) : (
          sorted.map((job) => (
            <Card key={job.id} variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>
                    {job.carMake} {job.carModel} {job.carVariant} ({job.carYear}
                    )
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: "auto" }}
                  >
                    {formatJobDate(job.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={job.serviceType}
                    size="small"
                    sx={{ fontSize: "0.68rem" }}
                  />
                  <Chip
                    label={job.difficultyRating}
                    size="small"
                    sx={{
                      bgcolor: `${DIFFICULTY_COLOR[job.difficultyRating]}18`,
                      color: DIFFICULTY_COLOR[job.difficultyRating],
                      fontWeight: 600,
                      fontSize: "0.68rem",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {job.technicianName}
                  </Typography>
                </Box>

                {job.products.length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={0.5}
                  >
                    Products:{" "}
                    {job.products.map((p) => p.productName).join(", ")}
                  </Typography>
                )}

                {job.installationNotes && (
                  <Typography variant="caption" display="block" mb={0.5}>
                    {job.installationNotes}
                  </Typography>
                )}

                {job.issuesEncountered && (
                  <Typography
                    variant="caption"
                    color="warning.main"
                    display="block"
                  >
                    ⚠ {job.issuesEncountered}
                    {job.issuesResolution && (
                      <>
                        {" "}
                        →{" "}
                        <span style={{ color: "#16A34A" }}>
                          {job.issuesResolution}
                        </span>
                      </>
                    )}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Collapse>
    </Box>
  );
}
