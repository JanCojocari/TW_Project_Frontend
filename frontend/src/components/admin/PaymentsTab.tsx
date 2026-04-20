// components/admin/PaymentsTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, CircularProgress, Alert, Link,
    TextField, InputAdornment,
} from "@mui/material";
import SearchIcon         from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { adminService, type AdminPayment } from "../../services/adminService";

const currencyLabel = (v: number) => ["USD", "EUR", "MDL"][v] ?? "?";

export default function PaymentsTab() {
    const { t }                   = useTranslation();
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [query, setQuery]       = useState("");

    useEffect(() => {
        adminService.getPayments()
            .then(data => { setPayments(data); setError(null); })
            .catch(() => setError(t("admin.payments.errorLoad")))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return payments;
        return payments.filter(p =>
            String(p.id).includes(q) ||
            String(p.ownerId).includes(q) ||
            String(p.renterId).includes(q) ||
            String(p.apartmentId).includes(q)
        );
    }, [payments, query]);

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TextField
                fullWidth size="small"
                placeholder={t("admin.payments.searchPlaceholder")}
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
                            <TableCell>{t("admin.payments.colId")}</TableCell>
                            <TableCell>{t("admin.payments.colApartment")}</TableCell>
                            <TableCell>{t("admin.payments.colOwnerId")}</TableCell>
                            <TableCell>{t("admin.payments.colRenterId")}</TableCell>
                            <TableCell>{t("admin.payments.colAmount")}</TableCell>
                            <TableCell>{t("admin.payments.colDate")}</TableCell>
                            <TableCell>{t("admin.payments.colInvoice")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(p => (
                            <TableRow key={p.id} hover>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>#{p.apartmentId}</TableCell>
                                <TableCell>{p.ownerId}</TableCell>
                                <TableCell>{p.renterId}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${p.totalCost.toFixed(2)} ${currencyLabel(p.currency)}`}
                                        color="success" size="small" sx={{ fontWeight: 700 }}
                                    />
                                </TableCell>
                                <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {p.invoiceUrl ? (
                                        <Link href={p.invoiceUrl} target="_blank" rel="noopener" fontSize={13}>
                                            {t("admin.payments.invoiceView")}
                                        </Link>
                                    ) : (
                                        <em style={{ opacity: 0.4, fontSize: 13 }}>{t("admin.payments.invoiceNone")}</em>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    {t("admin.payments.noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}