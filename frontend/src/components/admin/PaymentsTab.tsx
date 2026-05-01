// components/admin/PaymentsTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, CircularProgress, Alert, TextField, InputAdornment, Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { adminService, type AdminPayment } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate.ts";

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
            `${p.renterName} ${p.renterSurname}`.toLowerCase().includes(q) ||
            p.renterEmail.toLowerCase().includes(q) ||
            p.ownerName.toLowerCase().includes(q) ||
            p.apartmentAddress.toLowerCase().includes(q) ||
            String(p.apartmentId).includes(q)
        );
    }, [payments, query]);

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TextField
                fullWidth size="small"
                placeholder="Cauta dupa ID, renter, owner sau adresa apartament..."
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
                            <TableCell>Chirias</TableCell>
                            <TableCell>Proprietar</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Perioada</TableCell>
                            <TableCell>Data platii</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(p => (
                            <TableRow key={p.id} hover>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                                        {p.apartmentAddress || `#${p.apartmentId}`}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                        {p.renterName} {p.renterSurname}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {p.renterEmail}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {p.ownerName || `#${p.ownerId}`}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${p.currency} ${p.totalCost.toFixed(2)}`}
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {p.startDate && p.endDate
                                        ? `${formatDate(p.startDate)} - ${formatDate(p.endDate)}`
                                        : "—"}
                                </TableCell>
                                <TableCell>{formatDate(p.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>
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