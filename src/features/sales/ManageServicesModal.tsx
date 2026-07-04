import { AddOutlined, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
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

export function ManageServicesModal({ open, onClose }: Props) {
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Manage Services</DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Loading services...
            </Typography>
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

        <Box sx={{ p: 2 }}>
          {!adding && editingId === null && (
            <Button
              size="small"
              startIcon={<AddOutlined />}
              onClick={() => setAdding(true)}
            >
              Add Service
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
