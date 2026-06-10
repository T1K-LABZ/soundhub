import { Alert } from '@mui/material'

type StockAlertBannerProps = {
  message: string
}

export function StockAlertBanner({ message }: StockAlertBannerProps) {
  return <Alert severity="warning">{message}</Alert>
}
