// components/admin/ListingsTab.tsx
import { useEffect, useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert,
} from "@mui/material";
import DeleteIcon      from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon      from "@mui/icons-material/Cancel";
import { adminService, type AdminApartment } from "../../services/adminService";

const statusConfig = (status: number) => {
    if (status === 0) return { label: "Pending",  color: "default"  as const };
    if (status === 1) return { label: "Approved", color: "success"  as const };
    return             { label: "Declined", color: "error"    as const };
};

const intervalLabel = (v: number) => ["Daily", "Weekly", "Monthly"][v] ?? v;
const rentModeLabel = (v: number) => ["Rent", "Shared"][v] ?? v;

export default function ListingsTab() {
    const [apartments, setApartments] = useState<AdminApartment[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminApartment | null>(null);
    const [busy, setBusy]             = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            setApartments(await adminService.getApartments());
            setError(null);
        } catch {
            setError("Failed to load apartments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async (id: number) => {
        try {
            await adminService.approveApartment(id);
            setApartments(prev => prev.map(a => a.id === id ? { ...a, status: 1 } : a));
        } catch {
            setError("Failed to approve apartment.");
        }
    };

    const handleDecline = async (id: number) => {
        try {
            await adminService.declineApartment(id);
            setApartments(prev => prev.map(a => a.id === id ? { ...a, status: 2 } : a));
        } catch {
            setError("Failed to decline apartment.");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteApartment(confirmDelete.id);
            setApartments(prev => prev.filter(a => a.id !== confirmDelete.id));
        } catch {
            setError("Failed to delete apartment.");
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
                            <TableCell>Address</TableCell>
                            <TableCell>Owner ID</TableCell>
                            <TableCell>Cost / Interval</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apartments.map(apt => {
                            const sc = statusConfig(apt.status);
                            return (
                                <TableRow key={apt.id} hover>
                                    <TableCell>{apt.id}</TableCell>
                                    <TableCell sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {apt.address}
                                    </TableCell>
                                    <TableCell>{apt.ownedId}</TableCell>
                                    <TableCell>${apt.costPerInterval} / {intervalLabel(apt.interval)}</TableCell>
                                    <TableCell>{rentModeLabel(apt.rentMode)}</TableCell>
                                    <TableCell>
                                        <Chip label={sc.label} color={sc.color} size="small" sx={{ fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                                            {apt.status !== 1 && (
                                                <Tooltip title="Approve">
                                                    <IconButton size="small" color="success" onClick={() => handleApprove(apt.id)}>
                                                        <CheckCircleIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {apt.status !== 2 && (
                                                <Tooltip title="Decline">
                                                    <IconButton size="small" color="warning" onClick={() => handleDecline(apt.id)}>
                                                        <CancelIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => setConfirmDelete(apt)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>Delete Listing</DialogTitle>
                <DialogContent>
                    <Typography>
                        Delete apartment <strong>#{confirmDelete?.id}</strong> at{" "}
                        <strong>{confirmDelete?.address}</strong>? This cannot be undone.
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
