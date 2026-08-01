import { CloseOutlined, MenuOutlined, SearchOutlined } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import { apiClient } from "../../lib/axios";
import { ROUTES } from "../../router/routes";

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.products]: "Products",
  [ROUTES.inventory]: "Inventory",
  [ROUTES.sales]: "Sales",
  [ROUTES.orders]: "Orders",
  [ROUTES.customers]: "Customers",
  [ROUTES.invoices]: "Invoices",
  [ROUTES.reports]: "Reports",
  [ROUTES.staff]: "Staff",
};

type SearchResult = {
  id: string;
  name: string;
  type: "product" | "customer" | "batch";
  photoUrl?: string;
  subtitle?: string;
};

type Props = {
  drawerWidth: number;
  onMenuClick: () => void;
};

export function Topbar({ drawerWidth, onMenuClick }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] ?? "SoundHub";
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim() || !storeId) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await apiClient.get<{ data: SearchResult[] }>(
          "/public/search",
          { params: { storeId, q } },
        );
        setResults(res.data.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length >= 2) {
      doSearch(value);
    } else {
      setResults([]);
    }
  }

  function handleSelect(item: SearchResult) {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    if (item.type === "product") {
      navigate(`${ROUTES.inventory}?highlight=${item.id}`);
    } else if (item.type === "customer") {
      navigate(`${ROUTES.customers}?highlight=${item.id}`);
    } else {
      navigate(ROUTES.inventory);
    }
  }

  return (
    <>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1, display: { md: "none" } }}
            aria-label="Open navigation menu"
          >
            <MenuOutlined />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              px: 2,
              gap: 1,
              textTransform: "none",
              color: "text.secondary",
              display: { xs: "none", sm: "flex" },
            }}
          >
            <SearchOutlined fontSize="small" />
            <Typography variant="body2">Search...</Typography>
          </IconButton>

          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <SearchOutlined />
          </IconButton>

          <Box
            component="img"
            src="/images/soundhublogo.png"
            alt="SoundHub"
            sx={{
              height: 28,
              display: { xs: "block", md: "none" },
              ml: 1,
            }}
          />
        </Toolbar>
      </AppBar>

      <Dialog
        open={searchOpen}
        onClose={() => { setSearchOpen(false); setQuery(""); setResults([]); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <Box sx={{ p: 2, pb: 0 }}>
          <TextField
            autoFocus
            placeholder="Search products, customers..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {loading ? <CircularProgress size={18} /> : <SearchOutlined fontSize="small" />}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setSearchOpen(false); setQuery(""); setResults([]); }}>
                      <CloseOutlined fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 1 }}
          />
        </Box>
        {results.length > 0 && (
          <List sx={{ maxHeight: 400, overflow: "auto", px: 1, pb: 1 }}>
            {results.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleSelect(item)}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <Avatar
                  src={item.photoUrl}
                  alt={item.name}
                  variant="rounded"
                  sx={{ width: 36, height: 36, mr: 1.5, bgcolor: "grey.100" }}
                >
                  {item.name.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.subtitle || item.type}
                  primaryTypographyProps={{ fontWeight: 600, variant: "body2" }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No results found
            </Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
}
