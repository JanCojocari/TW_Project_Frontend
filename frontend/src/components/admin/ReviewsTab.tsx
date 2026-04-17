// components/admin/ReviewsTab.tsx
import { useEffect, useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert, Rating,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { adminService, type AdminReview } from "../../services/adminService";

export default function ReviewsTab() {
    const [reviews, setReviews]     = useState<AdminReview[]>([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminReview | null>(null);
    const [busy, setBusy]           = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            setReviews(await adminService.getReviews());
            setError(null);
        } catch {
            setError("Failed to load reviews.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteReview(confirmDelete.id);
            setReviews(prev => prev.filter(r => r.id !== confirmDelete.id));
        } catch {
            setError("Failed to delete review.");
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
                            <TableCell>Apartment</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map(review => (
                            <TableRow key={review.id} hover>
                                <TableCell>{review.id}</TableCell>
                                <TableCell>#{review.apartmentId}</TableCell>
                                <TableCell>{review.userId}</TableCell>
                                <TableCell>
                                    <Rating value={review.rating} readOnly size="small" />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {review.comment ?? <em style={{ opacity: 0.5 }}>No comment</em>}
                                </TableCell>
                                <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete">
                                        <IconButton size="small" color="error" onClick={() => setConfirmDelete(review)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>Delete Review</DialogTitle>
                <DialogContent>
                    <Typography>
                        Delete review <strong>#{confirmDelete?.id}</strong> by user{" "}
                        <strong>{confirmDelete?.userId}</strong>? This cannot be undone.
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
