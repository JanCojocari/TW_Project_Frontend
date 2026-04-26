// components/admin/SupportTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert,
    TextField, InputAdornment, Chip, Select, MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { adminService, type AdminSupportRequest } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate.ts";

const STATUS_LABELS: Record<number, string> = {
    0: "Open",
    1: "In Progress",
    2: "Resolved",
    3: "Closed",
};

const STATUS_COLORS: Record<number, "warning" | "info" | "success" | "default"> = {
    0: "warning",
    1: "info",
    2: "success",
    3: "default",
};

const STATUS_API_VALUES: Record<number, string> = {
    0: "Open",
    1: "InProgress",
    2: "Resolved",
    3: "Closed",
};

export default function SupportTab() {
    const [requests, setRequests]       = useState<AdminSupportRequest[]>([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminSupportRequest | null>(null);
    const [busy, setBusy]               = useState(false);
    const [query, setQuery]             = useState("");

    useEffect(() => {
        adminService.getSupportRequests()
            .then(setRequests)
            .catch(() => setError("Nu s-au putut incarca cererile de suport."))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return requests;
        return requests.filter(r =>
            String(r.id).includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.subject.toLowerCase().includes(q)
        );
    }, [requests, query]);

    const handleStatusChange = async (id: number, newStatus: number) => {
        try {
            await adminService.updateSupportStatus(id, STATUS_API_VALUES[newStatus]);
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch {
            setError("Eroare la actualizarea statusului.");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteSupport(confirmDelete.id);
            setRequests(prev => prev.filter(r => r.id !== confirmDelete.id));
        } catch {
            setError("Eroare la stergerea cererii.");
        } finally {
            setBusy(false);
            setConfirmDelete(null);
        }
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TextField
                fullWidth size="small"
                placeholder="Cauta dupa ID, email sau subiect..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "background.default" } }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Subiect</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell align="right">Actiuni</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(req => (
                            <TableRow key={req.id} hover>
                                <TableCell>{req.id}</TableCell>
                                <TableCell>{req.email}</TableCell>
                                <TableCell sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {req.subject}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        size="small"
                                        value={req.status}
                                        onChange={e => handleStatusChange(req.id, Number(e.target.value))}
                                        renderValue={(val) => (
                                            <Chip
                                                label={STATUS_LABELS[val as number]}
                                                size="small"
                                                color={STATUS_COLORS[val as number]}
                                            />
                                        )}
                                        sx={{ minWidth: 130, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                                    >
                                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                            <MenuItem key={val} value={Number(val)}>{label}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>{formatDate(req.createdAt)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Sterge">
                                        <IconButton size="small" color="error" onClick={() => setConfirmDelete(req)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    <Typography variant="body2">Nicio cerere de suport gasita.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>Sterge cererea de suport</DialogTitle>
                <DialogContent>
                    <Typography>
                        Sigur vrei sa stergi cererea #{confirmDelete?.id} de la {confirmDelete?.email}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)} disabled={busy}>Anuleaza</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : "Sterge"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}