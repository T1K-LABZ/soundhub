import { AddOutlined, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../auth/auth.store";
import {
  useCreateService,
  useDeleteService,
  useServicesQuery,
  useUpdateService,
} from "./sales.api";
import type { ServiceDefinition } from "./sales.types";

type Props = {
  open: boolean;
  onClose: () => void;
};

type EditableFields = Omit<ServiceDefinition, "id" | "code">;

const EMPTY_NEW: EditableFields = {
  name: "",
  description: "",
  basePrice: 0,
  estimatedDuration: "",
  skillLevel: "Junior",
  active: true,
};

function EditableRow({
  draft,
  code,
  onChange,
  onSave,
  onCancel,
  saveLabel = "Save",
  saving,
}: {
  draft: EditableFields;
  code: string;
  onChange: (k: keyof EditableFields, v: string | boolean | number) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  saving?: boolean;
}) {
  return (
    <TableRow sx={{ bgcolor: "action.hover" }}>
      <TableCell>
        <TextField
          size="small"
          placeholder="Service name"
          value={draft.name}
          onChange={(e) => onChange("name", e.target.value)}
          sx={{ minWidth: 150 }}
          autoFocus
        />
      </TableCell>
      <TableCell>
        <Typography variant="caption" color="text.secondary">
          {code}
        </Typography>
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          placeholder="Description"
          value={draft.description}
          onChange={(e) => onChange("description", e.target.value)}
          sx={{ minWidth: 160 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          type="number"
          placeholder="0"
          value={draft.basePrice || ""}
          onChange={(e) => onChange("basePrice", Number(e.target.value))}
          sx={{ width: 90 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          size="small"
          placeholder="1hr"
          value={draft.estimatedDuration}
          onChange={(e) => onChange("estimatedDuration", e.target.value)}
          sx={{ width: 80 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          select
          size="small"
          value={draft.skillLevel}
          onChange={(e) => onChange("skillLevel", e.target.value)}
          sx={{ width: 100 }}
        >
          <MenuItem value="Junior">Junior</MenuItem>
          <MenuItem value="Senior">Senior</MenuItem>
          <MenuItem value="">—</MenuItem>
        </TextField>
      </TableCell>
      <TableCell align="center">
        <Switch
          size="small"
          checked={draft.active}
          onChange={(e) => onChange("active", e.target.checked)}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            variant="contained"
            onClick={onSave}
            disabled={!draft.name.trim() || saving}
          >
            {saveLabel}
          </Button>
          <Button size="small" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}

function EditableCard({
  draft,
  code,
  onChange,
  onSave,
  onCancel,
  saveLabel = "Save",
  saving,
}: {
  draft: EditableFields;
  code: string;
  onChange: (k: keyof EditableFields, v: string | boolean | number) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  saving?: boolean;
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        border: 1,
        borderColor: "rgba(31, 41, 51, 0.08)",
        borderRadius: 1,
        bgcolor: "rgba(31, 41, 51, 0.03)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.25 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          {code}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Active</Typography>
          <Switch
            size="small"
            checked={draft.active}
            onChange={(e) => onChange("active", e.target.checked)}
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 1 }}>
        <TextField
          size="small"
          label="Service name"
          value={draft.name}
          onChange={(e) => onChange("name", e.target.value)}
          fullWidth
          autoFocus
        />
        <TextField
          size="small"
          label="Description"
          value={draft.description}
          onChange={(e) => onChange("description", e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <TextField
            size="small"
            type="number"
            label="Price"
            value={draft.basePrice || ""}
            onChange={(e) => onChange("basePrice", Number(e.target.value))}
            fullWidth
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            size="small"
            label="Est. time"
            value={draft.estimatedDuration}
            onChange={(e) => onChange("estimatedDuration", e.target.value)}
            fullWidth
          />
        </Box>
        <TextField
          select
          size="small"
          label="Skill level"
          value={draft.skillLevel}
          onChange={(e) => onChange("skillLevel", e.target.value)}
          fullWidth
        >
          <MenuItem value="Junior">Junior</MenuItem>
          <MenuItem value="Senior">Senior</MenuItem>
          <MenuItem value="">—</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 1.5 }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!draft.name.trim() || saving}
          sx={{ minHeight: 40, fontWeight: 800 }}
        >
          {saveLabel}
        </Button>
        <Button variant="outlined" onClick={onCancel} sx={{ minHeight: 40 }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

function ServiceCard({
  service,
  disabled,
  onEdit,
  onDelete,
  onToggle,
}: {
  service: ServiceDefinition;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        border: 1,
        borderColor: "rgba(31, 41, 51, 0.08)",
        borderRadius: 1,
        bgcolor: "#FFFFFF",
        boxShadow: "0 10px 28px rgba(31, 41, 51, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={800}>
            {service.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {service.code}
          </Typography>
        </Box>
        <Chip
          label={service.active ? "Active" : "Inactive"}
          color={service.active ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      </Box>

      {service.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {service.description}
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1,
          mt: 1.25,
          p: 1,
          borderRadius: 1,
          bgcolor: "rgba(31, 41, 51, 0.03)",
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">Price</Typography>
          <Typography variant="body2" fontWeight={800}>
            {service.basePrice > 0 ? service.basePrice.toLocaleString() : "—"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Time</Typography>
          <Typography variant="body2" fontWeight={700}>{service.estimatedDuration || "—"}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Skill</Typography>
          <Typography variant="body2" fontWeight={700}>{service.skillLevel || "—"}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Active</Typography>
          <Switch size="small" checked={service.active} onChange={onToggle} disabled={disabled} />
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit service">
            <IconButton size="small" onClick={onEdit} disabled={disabled}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete service">
            <IconButton size="small" color="error" onClick={onDelete} disabled={disabled}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export function ManageServicesModal({ open, onClose }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const storeId = useAuthStore((s) => s.user?.storeId) ?? "";
  const { data: services = [], isLoading } = useServicesQuery(storeId);
  const createService = useCreateService();
  const updateService = useUpdateService("");
  const deleteService = useDeleteService();

  const [adding, setAdding] = useState(false);
  const [newSvc, setNewSvc] = useState<EditableFields>({ ...EMPTY_NEW });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditableFields>({ ...EMPTY_NEW });

  function toggleActive(svc: ServiceDefinition) {
    updateService.mutate({ serviceId: svc.id, active: !svc.active });
  }

  function startEdit(svc: ServiceDefinition) {
    setAdding(false);
    setEditingId(svc.id);
    setEditDraft({
      name: svc.name,
      description: svc.description,
      basePrice: svc.basePrice,
      estimatedDuration: svc.estimatedDuration,
      skillLevel: svc.skillLevel,
      active: svc.active,
    });
  }

  function saveEdit() {
    if (!editingId) return;
    updateService.mutate(
      { serviceId: editingId, ...editDraft },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function handleAddRow() {
    if (!newSvc.name.trim()) return;
    const nextNum = services.length + 1;
    const code = `SRV-${String(nextNum).padStart(3, "0")}`;
    createService.mutate(
      { storeId, code, ...newSvc },
      {
        onSuccess: () => {
          setNewSvc({ ...EMPTY_NEW });
          setAdding(false);
        },
      },
    );
  }

  function handleDelete(svc: ServiceDefinition) {
    deleteService.mutate({ serviceId: svc.id, storeId });
  }

  const nextCode = `SRV-${String(services.length + 1).padStart(3, "0")}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 2 },
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(31, 41, 51, 0.02)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, alignItems: "center" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="div" fontWeight={800}>
              Manage Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edit install services, prices, duration, and availability.
            </Typography>
          </Box>
          {!adding && editingId === null && (
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => setAdding(true)}
              sx={{ display: { xs: "none", sm: "inline-flex" }, minHeight: 40 }}
            >
              Add Service
            </Button>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 1.5, sm: 0 }, bgcolor: { xs: "rgba(31, 41, 51, 0.03)", sm: "#FFFFFF" } }}>
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Loading services...
            </Typography>
          </Box>
        ) : isMobile ? (
          <Box sx={{ display: "grid", gap: 1.25 }}>
            {adding && (
              <EditableCard
                draft={newSvc}
                code={nextCode}
                onChange={(k, v) => setNewSvc((p) => ({ ...p, [k]: v }))}
                onSave={handleAddRow}
                onCancel={() => {
                  setAdding(false);
                  setNewSvc({ ...EMPTY_NEW });
                }}
                saveLabel="Add Service"
                saving={createService.isPending}
              />
            )}

            {services.map((svc) =>
              editingId === svc.id ? (
                <EditableCard
                  key={svc.id}
                  draft={editDraft}
                  code={svc.code}
                  onChange={(k, v) => setEditDraft((p) => ({ ...p, [k]: v }))}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  saveLabel="Update"
                  saving={updateService.isPending}
                />
              ) : (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  disabled={editingId !== null || adding}
                  onEdit={() => startEdit(svc)}
                  onDelete={() => handleDelete(svc)}
                  onToggle={() => toggleActive(svc)}
                />
              ),
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Price (KES)</TableCell>
                  <TableCell>Est. Time</TableCell>
                  <TableCell>Skill</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((svc) =>
                  editingId === svc.id ? (
                    <EditableRow
                      key={svc.id}
                      draft={editDraft}
                      code={svc.code}
                      onChange={(k, v) => setEditDraft((p) => ({ ...p, [k]: v }))}
                      onSave={saveEdit}
                      onCancel={cancelEdit}
                      saveLabel="Update"
                      saving={updateService.isPending}
                    />
                  ) : (
                    <TableRow key={svc.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {svc.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {svc.code}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {svc.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {svc.basePrice > 0
                            ? svc.basePrice.toLocaleString()
                            : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {svc.estimatedDuration || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {svc.skillLevel || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          size="small"
                          checked={svc.active}
                          onChange={() => toggleActive(svc)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title="Edit service">
                            <IconButton
                              size="small"
                              onClick={() => startEdit(svc)}
                              disabled={editingId !== null}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete service">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(svc)}
                              disabled={editingId !== null}
                            >
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ),
                )}

                {adding && (
                  <EditableRow
                    draft={newSvc}
                    code={nextCode}
                    onChange={(k, v) => setNewSvc((p) => ({ ...p, [k]: v }))}
                    onSave={handleAddRow}
                    onCancel={() => {
                      setAdding(false);
                      setNewSvc({ ...EMPTY_NEW });
                    }}
                    saveLabel="Add"
                    saving={createService.isPending}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ p: { xs: 0, sm: 2 }, pt: { xs: 1.5, sm: 2 } }}>
          {!adding && editingId === null && (
            <Button
              variant={isMobile ? "contained" : "text"}
              fullWidth={isMobile}
              startIcon={<AddOutlined />}
              onClick={() => setAdding(true)}
              sx={{ minHeight: 42, display: { xs: "inline-flex", sm: "none" } }}
            >
              Add Service
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "#FFFFFF",
        }}
      >
        <Button onClick={onClose} fullWidth={isMobile} variant={isMobile ? "outlined" : "text"} sx={{ minHeight: 40 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
