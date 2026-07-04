import { Avatar, Box, Paper, Typography } from "@mui/material";

type StatCardProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
};

export function StatCard({
  label,
  value,
  icon,
  color = "#F70000",
}: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderTop: `3px solid ${color}`,
        p: 2.5,
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            color="text.secondary"
            variant="caption"
            sx={{ letterSpacing: 0.5, textTransform: "uppercase" }}
          >
            {label}
          </Typography>
          <Typography fontWeight={700} sx={{ mt: 0.5 }} variant="h6">
            {value}
          </Typography>
        </Box>
        {icon && (
          <Avatar
            sx={{
              bgcolor: `${color}10`,
              color,
              width: 44,
              height: 44,
            }}
          >
            {icon}
          </Avatar>
        )}
      </Box>
    </Paper>
  );
}
