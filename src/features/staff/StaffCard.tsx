import {
  EditOutlined,
  MoreVertOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ROLE_COLOR, STATUS_COLOR } from "./staff.constants";
import type { StaffMember, StaffPerformance } from "./staff.types";
import { formatJoinDate, formatKsh, getInitials } from "./staff.utils";

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

  const roleColor = ROLE_COLOR[staff.role];
  const statusColor = STATUS_COLOR[staff.status];

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <CardContent sx={{ flex: 1, pb: 1 }}>
        {/* Avatar + name + role */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: `${roleColor}22`,
              color: roleColor,
              fontSize: 22,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {getInitials(staff.fullName)}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700} textAlign="center">
            {staff.fullName}
          </Typography>
          <Chip
            label={staff.role}
            size="small"
            sx={{
              bgcolor: `${roleColor}18`,
              color: roleColor,
              fontWeight: 600,
              mt: 0.5,
            }}
          />
        </Box>

        {/* Status + employment row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={staff.status}
            size="small"
            sx={{
              bgcolor: `${statusColor}18`,
              color: statusColor,
              fontWeight: 600,
            }}
          />
          <Chip label={staff.employmentType} size="small" variant="outlined" />
        </Box>

        {/* Specializations */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            justifyContent: "center",
            mb: 1.5,
          }}
        >
          {staff.specializations.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.68rem" }}
            />
          ))}
        </Box>

        {/* Phone + joined */}
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {staff.phone}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
        >
          Joined {formatJoinDate(staff.dateJoined)}
        </Typography>

        {/* Performance mini stats */}
        {performance && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                  {performance.jobsThisMonth}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Jobs
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" fontWeight={700}>
                  {formatKsh(performance.revenueThisMonth)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Revenue
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" fontWeight={700}>
                  ⭐ {performance.avgRating.toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Rating
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 1.5 }}>
        <Button
          size="small"
          startIcon={<VisibilityOutlined />}
          onClick={onView}
        >
          Profile
        </Button>
        <Button size="small" startIcon={<EditOutlined />} onClick={onEdit}>
          Edit
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
