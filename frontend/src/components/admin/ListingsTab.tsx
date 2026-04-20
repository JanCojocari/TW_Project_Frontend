// components/admin/ListingsTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert,
    TextField, InputAdornment,
} from "@mui/material";
import DeleteIcon        from "@mui/icons-material/Delete";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import CancelIcon        from "@mui/icons-material/Cancel";
import SearchIcon        from "@mui/icons-material/Search";
import OpenInNewIcon     from "@mui/icons-material/OpenInNew";
import { useTranslation }  from "react-i18next";
import { useNavigate }     from "react-router-dom";
import { adminService, type AdminApartment } from "../../services/adminService";
import { paths } from "../../app/paths";

const statusConfig = (status: number, t: (k: string) => string) => {
    if (status === 0) return { label: t("admin.listings.statusPending"),  color: "default" as const };
    if (status === 1) return { label: t("admin.listings.statusApproved"), color: "success" as const };
    return             { label: t("admin.listings.statusDeclined"), color: "error"   as const };
};

export default function ListingsTab() {
    const { t }    = useTranslation();
    const navigate = useNavigate();

    const [apartments, setApartments]       = useState<AdminApartment[]>([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminApartment | null>(null);
    const [busy, setBusy]                   = useState(false);
    const [query, setQuery]                 = useState("");

    const load = async () => {
        setLoading(true);
        try {
            setApartments(await adminService.getApartments());
            setError(null);
        } catch {
            setError(t("admin.listings.errorLoad"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return apartments;
        return apartments.filter(a =>
            String(a.id).includes(q) ||
            a.address?.toLowerCase().includes(q) ||
            a.ownerName?.toLowerCase().includes(q) ||
            a.ownerSurname?.toLowerCase().includes(q) ||
            a.ownerEmail?.toLowerCase().includes(q)
        );
    }, [apartments, query]);

    const handleApprove = async (id: number) => {
        try {
            await adminService.approveApartment(id);
            setApartments(prev => prev.map(a => a.id === id ? { ...a, status: 1 } : a));
        } catch {
            setError(t("admin.listings.errorApprove"));
        }
    };

    const handleDecline = async (id: number) => {
        try {
            await adminService.declineApartment(id);
            setApartments(prev => prev.map(a => a.id === id ? { ...a, status: 2 } : a));
        } catch {
            setError(t("admin.listings.errorDecline"));
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteApartment(confirmDelete.id);
            setApartments(prev => prev.filter(a => a.id !== confirmDelete.id));
        } catch {
            setError(t("admin.listings.errorDelete"));
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
                placeholder={t("admin.listings.searchPlaceholder")}
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
                            <TableCell>{t("admin.listings.colId")}</TableCell>
                            <TableCell>{t("admin.listings.colAddress")}</TableCell>
                            <TableCell>{t("admin.listings.colOwner")}</TableCell>
                            <TableCell>{t("admin.listings.colOwnerEmail")}</TableCell>
                            <TableCell>{t("admin.listings.colStatus")}</TableCell>
                            <TableCell>{t("admin.listings.colView")}</TableCell>
                            <TableCell align="right">{t("admin.listings.colActions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(apt => {
                            const sc = statusConfig(apt.status, t);
                            return (
                                <TableRow key={apt.id} hover>
                                    <TableCell>{apt.id}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {apt.address}
                                    </TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                        {apt.ownerName} {apt.ownerSurname}
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {apt.ownerEmail}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={sc.label} color={sc.color} size="small" sx={{ fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={t("admin.listings.viewDetail")}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => navigate(paths.apartmentDetail(apt.id))}
                                            >
                                                <OpenInNewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                                            {apt.status !== 1 && (
                                                <Tooltip title={t("admin.listings.approve")}>
                                                    <IconButton size="small" color="success" onClick={() => handleApprove(apt.id)}>
                                                        <CheckCircleIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {apt.status !== 2 && (
                                                <Tooltip title={t("admin.listings.decline")}>
                                                    <IconButton size="small" color="warning" onClick={() => handleDecline(apt.id)}>
                                                        <CancelIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title={t("admin.listings.delete")}>
                                                <IconButton size="small" color="error" onClick={() => setConfirmDelete(apt)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    {t("admin.listings.noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>{t("admin.listings.deleteTitle")}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("admin.listings.deleteDesc", { id: confirmDelete?.id, address: confirmDelete?.address })}
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
