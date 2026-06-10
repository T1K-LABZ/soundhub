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
  color = "#D42F23",
}: StatCardProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography sx={{ mt: 0.5 }} variant="h5">
            {value}
          </Typography>
        </Box>
        {icon && (
          <Avatar sx={{ bgcolor: `${color}18`, color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        )}
      </Box>
    </Paper>
  );
}
