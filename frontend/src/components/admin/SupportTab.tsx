// components/admin/SupportTab.tsx
import { useEffect, useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Select, MenuItem, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Typography, CircularProgress, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { adminService, type AdminSupportRequest } from "../../services/adminService";

const STATUS_OPTIONS = [
    { value: "Open",       label: "Open",        color: "default"  as const },
    { value: "InProgress", label: "In Progress",  color: "info"     as const },
    { value: "Resolved",   label: "Resolved",     color: "success"  as const },
    { value: "Closed",     label: "Closed",       color: "warning"  as const },
];

const statusFromNum = (n: number) => STATUS_OPTIONS[n]?.value ?? "Open";
const statusChip    = (n: number) => STATUS_OPTIONS[n] ?? STATUS_OPTIONS[0];

export default function SupportTab() {
    const [requests, setRequests]   = useState<AdminSupportRequest[]>([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminSupportRequest | null>(null);
    const [busy, setBusy]           = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            setRequests(await adminService.getSupportRequests());
            setError(null);
        } catch {
            setError("Failed to load support requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleStatusChange = async (id: number, statusStr: string) => {
        try {
            await adminService.updateSupportStatus(id, statusStr);
            const newNum = STATUS_OPTIONS.findIndex(s => s.value === statusStr);
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newNum } : r));
        } catch {
            setError("Failed to update status.");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteSupport(confirmDelete.id);
            setRequests(prev => prev.filter(r => r.id !== confirmDelete.id));
        } catch {
            setError("Failed to delete support request.");
        } finally {
            setBusy(false);
            setConfirmDelete(null);
        }
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "background.default" } }}>
                            <TableCell>ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map(req => {
                            const chip = statusChip(req.status);
                            return (
                                <TableRow key={req.id} hover>
                                    <TableCell>{req.id}</TableCell>
                                    <TableCell>{req.userId ?? req.email}</TableCell>
                                    <TableCell sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {req.subject}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {req.message}
                                    </TableCell>
                                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Select
                                            size="small"
                                            value={statusFromNum(req.status)}
                                            onChange={e => handleStatusChange(req.id, e.target.value)}
                                            sx={{ fontSize: 13, minWidth: 120 }}
                                            renderValue={() => (
                                                <Chip label={chip.label} color={chip.color} size="small" sx={{ fontWeight: 700, cursor: "pointer" }} />
                                            )}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    <Chip label={opt.label} color={opt.color} size="small" sx={{ fontWeight: 700 }} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => setConfirmDelete(req)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>Delete Support Request</DialogTitle>
                <DialogContent>
                    <Typography>
                        Delete request <strong>#{confirmDelete?.id}</strong> — "{confirmDelete?.subject}"? This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)} disabled={busy}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
