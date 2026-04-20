// components/admin/ReviewsTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert, Rating,
    TextField, InputAdornment,
} from "@mui/material";
import DeleteIcon         from "@mui/icons-material/Delete";
import SearchIcon         from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { adminService, type AdminReview } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate.ts"


export default function ReviewsTab() {
    const { t }                   = useTranslation();
    const [reviews, setReviews]   = useState<AdminReview[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminReview | null>(null);
    const [busy, setBusy]         = useState(false);
    const [query, setQuery]       = useState("");

    const load = async () => {
        setLoading(true);
        try {
            setReviews(await adminService.getReviews());
            setError(null);
        } catch {
            setError(t("admin.reviews.errorLoad"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // filtrare client-side: id, userId (renterId), apartmentId
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return reviews;
        return reviews.filter(r =>
            String(r.id).includes(q) ||
            String(r.userId).includes(q) ||
            String(r.apartmentId).includes(q)
        );
    }, [reviews, query]);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteReview(confirmDelete.id);
            setReviews(prev => prev.filter(r => r.id !== confirmDelete.id));
        } catch {
            setError(t("admin.reviews.errorDelete"));
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
                placeholder={t("admin.reviews.searchPlaceholder")}
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
                            <TableCell>{t("admin.reviews.colId")}</TableCell>
                            <TableCell>{t("admin.reviews.colApartment")}</TableCell>
                            <TableCell>{t("admin.reviews.colUserId")}</TableCell>
                            <TableCell>{t("admin.reviews.colRating")}</TableCell>
                            <TableCell>{t("admin.reviews.colComment")}</TableCell>
                            <TableCell>{t("admin.reviews.colCreated")}</TableCell>
                            <TableCell align="right">{t("admin.reviews.colActions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(review => (
                            <TableRow key={review.id} hover>
                                <TableCell>{review.id}</TableCell>
                                <TableCell>#{review.apartmentId}</TableCell>
                                <TableCell>{review.userId}</TableCell>
                                <TableCell>
                                    <Rating value={review.rating} readOnly size="small" />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {review.comment ?? <em style={{ opacity: 0.5 }}>{t("admin.reviews.noComment")}</em>}
                                </TableCell>
                                <TableCell>{formatDate(review.createdAt)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title={t("admin.common.delete")}>
                                        <IconButton size="small" color="error" onClick={() => setConfirmDelete(review)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    {t("admin.reviews.noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>{t("admin.reviews.deleteTitle")}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("admin.reviews.deleteDesc", { id: confirmDelete?.id, userId: confirmDelete?.userId })}
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