// components/admin/PaymentsTab.tsx
import { useEffect, useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, CircularProgress, Alert, Link,
} from "@mui/material";
import { adminService, type AdminPayment } from "../../services/adminService";

const currencyLabel = (v: number) => ["USD", "EUR", "MDL"][v] ?? "?";

export default function PaymentsTab() {
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);

    useEffect(() => {
        adminService.getPayments()
            .then(data => { setPayments(data); setError(null); })
            .catch(() => setError("Failed to load payments."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "background.default" } }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Apartment</TableCell>
                        <TableCell>Owner ID</TableCell>
                        <TableCell>Renter ID</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Invoice</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {payments.map(p => (
                        <TableRow key={p.id} hover>
                            <TableCell>{p.id}</TableCell>
                            <TableCell>#{p.apartmentId}</TableCell>
                            <TableCell>{p.ownerId}</TableCell>
                            <TableCell>{p.renterId}</TableCell>
                            <TableCell>
                                <Chip
                                    label={`${p.totalCost.toFixed(2)} ${currencyLabel(p.currency)}`}
                                    color="success"
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                />
                            </TableCell>
                            <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {p.invoiceUrl ? (
                                    <Link href={p.invoiceUrl} target="_blank" rel="noopener" fontSize={13}>
                                        View
                                    </Link>
                                ) : (
                                    <em style={{ opacity: 0.4, fontSize: 13 }}>N/A</em>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
