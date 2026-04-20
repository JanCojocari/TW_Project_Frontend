// components/admin/SupportTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Select, MenuItem, Tooltip, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Typography, CircularProgress, Alert,
    TextField, InputAdornment,
} from "@mui/material";
import DeleteIcon         from "@mui/icons-material/Delete";
import SearchIcon         from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { adminService, type AdminSupportRequest } from "../../services/adminService";

export default function SupportTab() {
    const { t }                   = useTranslation();
    const [requests, setRequests] = useState<AdminSupportRequest[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminSupportRequest | null>(null);
    const [busy, setBusy]         = useState(false);
    const [query, setQuery]       = useState("");

    // definite in render ca depind de t()
    const STATUS_OPTIONS = [
        { value: "Open",       label: t("admin.support.statusOpen"),       color: "default" as const },
        { value: "InProgress", label: t("admin.support.statusInProgress"), color: "info"    as const },
        { value: "Resolved",   label: t("admin.support.statusResolved"),   color: "success" as const },
        { value: "Closed",     label: t("admin.support.statusClosed"),     color: "warning" as const },
    ];

    const statusFromNum = (n: number) => STATUS_OPTIONS[n]?.value ?? "Open";
    const statusChip    = (n: number) => STATUS_OPTIONS[n] ?? STATUS_OPTIONS[0];

    const load = async () => {
        setLoading(true);
        try {
            setRequests(await adminService.getSupportRequests());
            setError(null);
        } catch {
            setError(t("admin.support.errorLoad"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return requests;
        return requests.filter(r =>
            String(r.id).includes(q) ||
            String(r.userId ?? "").includes(q) ||
            r.email?.toLowerCase().includes(q)
        );
    }, [requests, query]);

    const handleStatusChange = async (id: number, statusStr: string) => {
        try {
            await adminService.updateSupportStatus(id, statusStr);
            const newNum = STATUS_OPTIONS.findIndex(s => s.value === statusStr);
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newNum } : r));
        } catch {
            setError(t("admin.support.errorStatus"));
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteSupport(confirmDelete.id);
            setRequests(prev => prev.filter(r => r.id !== confirmDelete.id));
        } catch {
            setError(t("admin.support.errorDelete"));
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
                placeholder={t("admin.support.searchPlaceholder")}
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
                            <TableCell>{t("admin.support.colId")}</TableCell>
                            <TableCell>{t("admin.support.colUser")}</TableCell>
                            <TableCell>{t("admin.support.colSubject")}</TableCell>
                            <TableCell>{t("admin.support.colMessage")}</TableCell>
                            <TableCell>{t("admin.support.colCreated")}</TableCell>
                            <TableCell>{t("admin.support.colStatus")}</TableCell>
                            <TableCell align="right">{t("admin.support.colActions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(req => {
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
                                        <Tooltip title={t("admin.support.colActions")}>
                                            <IconButton size="small" color="error" onClick={() => setConfirmDelete(req)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    {t("admin.support.noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>{t("admin.support.deleteTitle")}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("admin.support.deleteDesc", { id: confirmDelete?.id, subject: confirmDelete?.subject })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)} disabled={busy}>{t("admin.common.cancel")}</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : t("admin.common.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}