// components/admin/PaymentsTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, CircularProgress, Alert, TextField, InputAdornment,
    Chip, Button, ButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { adminService, type AdminPayment } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate.ts";
import { useTranslation } from "react-i18next";
import { exportToXlsx, exportToCsv } from "../../utils/exportPayments";

export default function PaymentsTab() {
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [query, setQuery]       = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        adminService.getPayments()
            .then(setPayments)
            .catch(() => setError(t("admin.payments.errorLoad")))
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

    // Coloane ca labels pentru export
    const exportLabels = {
        id:        t("admin.payments.colId"),
        apartment: t("admin.payments.colApartment"),
        renter:    t("admin.payments.colRenter"),
        email:     "Email",
        owner:     t("admin.payments.colOwner"),
        amount:    t("admin.payments.colAmount"),
        period:    t("admin.payments.colPeriod"),
        date:      t("admin.payments.colDate"),
    };

    const fileName = t("admin.payments.exportFileName");

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                    size="small"
                    placeholder={t("admin.payments.searchPlaceholder")}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    sx={{ flex: 1, minWidth: 240 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <ButtonGroup variant="outlined" size="small" disabled={filtered.length === 0}>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => exportToXlsx(filtered, fileName, exportLabels)}
                    >
                        {t("admin.payments.exportXlsx")}
                    </Button>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => exportToCsv(filtered, fileName, exportLabels)}
                    >
                        {t("admin.payments.exportCsv")}
                    </Button>
                </ButtonGroup>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "background.default" } }}>
                            <TableCell>{t("admin.payments.colId")}</TableCell>
                            <TableCell>{t("admin.payments.colApartment")}</TableCell>
                            <TableCell>{t("admin.payments.colRenter")}</TableCell>
                            <TableCell>{t("admin.payments.colOwner")}</TableCell>
                            <TableCell>{t("admin.payments.colAmount")}</TableCell>
                            <TableCell>{t("admin.payments.colPeriod")}</TableCell>
                            <TableCell>{t("admin.payments.colDate")}</TableCell>
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
                                    <Typography variant="body2">{t("admin.payments.noResults")}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}