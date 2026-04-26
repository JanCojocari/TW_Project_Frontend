// components/admin/PaymentsTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, CircularProgress, Alert, TextField, InputAdornment, Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { adminService, type AdminPayment } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate.ts";

const CURRENCY_MAP: Record<number, string> = { 0: "USD", 1: "EUR", 2: "MDL" };

export default function PaymentsTab() {
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [query, setQuery]       = useState("");

    useEffect(() => {
        adminService.getPayments()
            .then(setPayments)
            .catch(() => setError("Nu s-au putut incarca platile."))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return payments;
        return payments.filter(p =>
            String(p.id).includes(q) ||
            String(p.renterId).includes(q) ||
            String(p.ownerId).includes(q) ||
            String(p.apartmentId).includes(q)
        );
    }, [payments, query]);

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TextField
                fullWidth size="small"
                placeholder="Cauta dupa ID plata, renter, owner sau apartament..."
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
                            <TableCell>Apartament</TableCell>
                            <TableCell>Renter ID</TableCell>
                            <TableCell>Owner ID</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Data platii</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(p => (
                            <TableRow key={p.id} hover>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>#{p.apartmentId}</TableCell>
                                <TableCell>{p.renterId}</TableCell>
                                <TableCell>{p.ownerId}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${CURRENCY_MAP[p.currency] ?? "?"} ${p.totalCost.toFixed(2)}`}
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{formatDate(p.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    <Typography variant="body2">Nicio plata gasita.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}