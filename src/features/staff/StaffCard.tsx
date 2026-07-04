import { MoreVertOutlined, VisibilityOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ROLE_COLOR } from "./staff.constants";
import type { StaffMember, StaffPerformance } from "./staff.types";
import { formatJoinDate, getInitials } from "./staff.utils";

type Props = {
  staff: StaffMember;
  performance: StaffPerformance | undefined;
  onView: () => void;
  onEdit: () => void;
  onMarkLeave: () => void;
  onDeactivate: () => void;
};

export function StaffCard({
  staff,
  performance,
  onView,
  onEdit,
  onMarkLeave,
  onDeactivate,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const color = ROLE_COLOR[staff.role];

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Colored accent header */}
      <Box sx={{ height: 4, bgcolor: color }} />

      <CardContent sx={{ flex: 1, pt: 2.5, pb: 1, px: 2.5 }}>
        {/* Avatar + name + role */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: color,
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            {getInitials(staff.fullName)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {staff.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {staff.role}
            </Typography>
          </Box>
        </Box>

        {/* Info rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2 }}>
          <InfoRow label="Phone" value={staff.phone} />
          <InfoRow label="Joined" value={formatJoinDate(staff.dateJoined)} />
          {performance && (
            <InfoRow label="Jobs this month" value={String(performance.jobsThisMonth)} />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
        <Button
          size="small"
          startIcon={<VisibilityOutlined />}
          onClick={onView}
          sx={{ textTransform: "none" }}
        >
          Profile
        </Button>
        <Tooltip title="More options">
          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVertOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              onEdit();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              onMarkLeave();
            }}
          >
            Mark as On Leave
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              onDeactivate();
            }}
            sx={{ color: "error.main" }}
          >
            Deactivate
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );
}
