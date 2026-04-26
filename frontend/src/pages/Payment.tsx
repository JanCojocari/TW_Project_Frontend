import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography, Paper, Button, Alert, CircularProgress, IconButton, Snackbar } from "@mui/material";
import { ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon, Lock as LockIcon } from "@mui/icons-material";
import { FIELDS_BY_METHOD, LABELS, CURRENCY_SYMBOLS } from "../types/paymentPageConfig";
import type { PaymentMethodId, OrderSummary, PaymentPayload, PaymentResult } from "../types/paymentPageConfig";
import { colors } from "../theme/gradients.ts";
import { useOrderSummary }         from "../types/UseOrderSummary.ts";
import { usePaymentForm }           from "../types/UsePaymentForm.ts";
import FormField                    from "../components/payment/FormField.tsx";
import PaymentMethodTabs            from "../components/payment/PaymentMethodTabs.tsx";
import SummaryCard                  from "../components/payment/SummaryCard.tsx";
import BillingAddressSection        from "../components/payment/BillingAddressSection.tsx";
import PaymentSuccessScreen         from "../components/payment/PaymentSuccessScreen.tsx";
import MobileSummaryAccordion       from "../components/payment/MobileSummaryAccordion.tsx";
import PayPalButton from "../components/payment/PayPalButton.tsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import StayPeriodSelector from "../components/payment/StayPeriodSelector";
import type { Dayjs } from "dayjs";
import { useAuth } from "../auth/AuthContext";
import { paymentHistoryService, type BookedPeriodDto } from "../services/paymentHistoryService";
import { useNotifications } from "../context/NotificationContext";
import { renterNotifications } from "../services/notificationService";
import { apartmentService } from "../services/apartmentService";

interface Props {
    summary?:              OrderSummary;
    defaultPaymentMethod?: PaymentMethodId;
    onPay?:                (payload: PaymentPayload) => Promise<PaymentResult>;
    onBack?:               () => void;
    onSuccess?:            (result: PaymentResult) => void;
    onError?:              (err: string) => void;
}

const PaymentPage = ({ summary: summaryProp, defaultPaymentMethod = "card", onPay, onBack, onSuccess, onError }: Props) => {
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate]     = useState<Dayjs | null>(null);
    const [hours, setHours]         = useState<number>(1);
    const [dateError, setDateError] = useState<string | null>(null);
    const [searchParams]  = useSearchParams();
    const interval    = searchParams.get("interval") ?? "day";
    const [months, setMonths] = useState<number>(1);
    const [monthsInput, setMonthsInput] = useState<string>("1");
    const [hoursInput, setHoursInput] = useState<string>("1");
    const [bookedPeriods, setBookedPeriods] = useState<BookedPeriodDto[]>([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { addNotification } = useNotifications();
    const renterId = currentUser?.id ?? 0;
    const apartmentId = searchParams.get("apartmentId");
    const notifSentRef = useRef(false);

    useEffect(() => {
        if (!apartmentId) return;
        paymentHistoryService.getBookedPeriods(Number(apartmentId))
            .then(setBookedPeriods)
            .catch(() => {});
    }, [apartmentId]);

    const summary = useOrderSummary(
        summaryProp,
        apartmentId,
        interval === "hour" ? null : startDate?.toDate() ?? null,
        interval === "hour" ? null : endDate?.toDate()   ?? null,
        interval === "hour" ? hours : undefined);

    const validateDates = (): boolean => {
        if (interval === "hour") {
            if (hours < 1) { setDateError("Minim 1 ora."); return false; }
        } else {
            if (!startDate || !endDate) { setDateError("Selecteaza perioada sejurului."); return false; }
            if (endDate.isBefore(startDate)) { setDateError("Data de sfarsit trebuie sa fie dupa data de inceput."); return false; }
            if (interval === "month") {
                const diffDays = endDate.diff(startDate, "day");
                if (diffDays < 30) { setDateError("Pentru inchiriere lunara, perioada minima este 30 de zile."); return false; }
            }
        }
        setDateError(null);
        return true;
    };

    const {
        method, formState, errors, sameAddress, setSameAddress,
        promoInput, setPromoInput, appliedPromo, promoDiscount, promoMessage, promoLoading,
        submitting, submitted, setSubmitted, submitError, setSubmitError, snackOpen, setSnackOpen, summaryOpen, setSummaryOpen,
        formRef, handleFieldChange, handleMethodChange, handlePromoApply, handlePromoRemove, handleSubmit, handleBack,
    } = usePaymentForm({
        summary, apartmentId, onPay, onBack, onSuccess, onError,
        startDate: startDate?.toDate() ?? null, endDate: endDate?.toDate() ?? null,
        defaultMethod: defaultPaymentMethod, renterId,
    });

    // Emite notificari renter + owner o singura data dupa payment reusit
    useEffect(() => {
        if (!submitted || notifSentRef.current) return;
        notifSentRef.current = true;

        const rawTitle = summary.items?.[0]?.title ?? "";
        const address  = rawTitle.replace(/^Apartament\s*[–-]\s*/i, "").trim()
            || `Apartament #${apartmentId}`;
        const startJs  = startDate?.toDate() ?? null;
        const endJs    = endDate?.toDate()   ?? null;

        // Notificare pentru renter (userul curent)
        renterNotifications.paymentSuccess(addNotification, address, startJs, endJs);

        // Notificare pentru owner — scriem direct in localStorage-ul sau
        if (apartmentId) {
            apartmentService.getById(Number(apartmentId)).then(apt => {
                if (!apt) return;
                const period = startJs && endJs
                    ? `${startJs.toLocaleDateString("ro-RO")} - ${endJs.toLocaleDateString("ro-RO")}`
                    : "—";
                const ownerKey = `rentora_notifications_${apt.Id_Owner}`;
                const notif = {
                    id:        `${Date.now()}_owner_rented`,
                    type:      "owner_rented" as const,
                    message:   `${apt.Address} a fost inchiriat pe perioada ${period}.`,
                    createdAt: new Date().toISOString(),
                    read:      false,
                };
                try {
                    const prev = JSON.parse(localStorage.getItem(ownerKey) ?? "[]");
                    localStorage.setItem(ownerKey, JSON.stringify([notif, ...prev].slice(0, 50)));
                } catch { /* ignore */ }
            }).catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);

    const wrappedSubmit = (e: React.FormEvent) => { if (!validateDates()) { e.preventDefault(); return; } handleSubmit(e); };

    const currentFields  = FIELDS_BY_METHOD[method];
    const sym            = CURRENCY_SYMBOLS[summary.currency] ?? summary.currency;
    const effectiveTotal = (summary.total - promoDiscount).toFixed(2);

    const summaryCardProps = { summary, promoCode: promoInput, promoMessage, promoDiscount, promoLoading, appliedPromo, onPromoChange: setPromoInput, onPromoApply: handlePromoApply, onPromoRemove: handlePromoRemove };

    if (submitted) return <PaymentSuccessScreen />;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pt: { xs: 9, md: 11 }, pb: 8 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton onClick={handleBack} aria-label={LABELS.back} sx={{ border: `1px solid ${colors.border}`, "&:hover": { borderColor: colors.primary } }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight={900} letterSpacing="-0.5px">Finalizare plată</Typography>
                        <Typography variant="body2" color="text.secondary">Completează detaliile pentru a confirma rezervarea</Typography>
                    </Box>
                </Box>

                <StayPeriodSelector
                    interval={interval}
                    startDate={startDate}
                    endDate={endDate}
                    hours={hours}
                    hoursInput={hoursInput}
                    months={months}
                    monthsInput={monthsInput}
                    dateError={dateError}
                    bookedPeriods={bookedPeriods}
                    onStartChange={(val) => {
                        setStartDate(val);
                        setEndDate(interval === "month" && val ? val.add(months, "month") : null);
                        setDateError(null);
                    }}
                    onEndChange={(val) => { setEndDate(val); setDateError(null); }}
                    onHoursChange={(input, value) => { setHoursInput(input); setHours(value); }}
                    onMonthsChange={(input, value) => {
                        setMonthsInput(input);
                        setMonths(value);
                        if (startDate) setEndDate(startDate.add(value, "month"));
                    }}
                    onHoursBlur={() => { if (!hoursInput || parseInt(hoursInput) < 1) { setHoursInput("1"); setHours(1); } }}
                    onMonthsBlur={() => { if (!monthsInput || parseInt(monthsInput) < 1) { setMonthsInput("1"); setMonths(1); if (startDate) setEndDate(startDate.add(1, "month")); } }}
                />

                <MobileSummaryAccordion open={summaryOpen} onToggle={() => setSummaryOpen((v) => !v)} effectiveTotal={effectiveTotal} currency={summary.currency} summaryCardProps={summaryCardProps} />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 380px" }, gap: 4, alignItems: "start" }}>

                    {/* LEFT: Form */}
                    <Box component="form" onSubmit={wrappedSubmit} noValidate aria-label="Formular de plată" ref={formRef}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700} mb={2}>{LABELS.paymentMethod}</Typography>

                            <PaymentMethodTabs selected={method} onChange={handleMethodChange} disabled={submitting} />

                            <Box sx={{ display: "grid", gridTemplateColumns: method === "card" ? { xs: "1fr", sm: "1fr 1fr" } : "1fr", gap: 2.5 }}>
                                {currentFields.map((field) => {
                                    const isFullWidth = method === "card" && (field.name === "nameOnCard" || field.name === "cardNumber");
                                    return (
                                        <Box key={field.name} sx={{ gridColumn: isFullWidth ? "1 / -1" : "auto" }}>
                                            <FormField field={field} value={formState[field.name] ?? ""} error={errors[field.name]} onChange={handleFieldChange} disabled={submitting} />
                                        </Box>
                                    );
                                })}
                            </Box>

                            {method === "card" && <BillingAddressSection formState={formState} errors={errors} sameAddress={sameAddress} onSameChange={setSameAddress} onChange={handleFieldChange} disabled={submitting} />}
                            {method === "paypal" && (
                                <>
                                    <Alert severity="info" sx={{ mt: 2 }}>Apasă butonul PayPal de mai jos pentru a autoriza plata.</Alert>
                                    <PayPalButton
                                        amount={summary.total - promoDiscount}
                                        currency={summary.currency}
                                        apartmentId={apartmentId ? Number(apartmentId) : 0}
                                        onSuccess={(transactionId) => {
                                            setSubmitted(true);
                                            setSnackOpen(true);
                                            onSuccess?.({ success: true, transactionId });
                                            setTimeout(() => navigate("/dashboard"), 3500);
                                        }}
                                        onError={(msg) => setSubmitError(msg)}
                                    />
                                </>
                            )}
                            {method === "bank_transfer" && <Alert severity="warning" sx={{ mt: 2 }}>Transferurile bancare pot dura 1–3 zile. Rezervarea se confirmă după primirea plății.</Alert>}
                        </Paper>

                        {submitError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError("")}>{submitError}</Alert>}

                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
                            {method !== "paypal" && (
                                <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}
                                        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                                        sx={{ py: 1.8, fontSize: 16, fontWeight: 800, borderRadius: 2.5, maxWidth: { sm: 340 } }} aria-busy={submitting}>
                                    {submitting ? LABELS.processing : `${LABELS.pay} · ${sym} ${effectiveTotal}`}
                                </Button>
                            )}
                            <Button variant="text" size="large" onClick={handleBack} disabled={submitting} sx={{ color: "text.secondary", fontWeight: 600 }}>
                                {LABELS.back}
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5, opacity: 0.6 }}>
                            <LockIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">Datele tale sunt criptate și securizate.</Typography>
                        </Box>
                    </Box>

                    {/* RIGHT: Sticky summary */}
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: 88 }}>
                        <SummaryCard {...summaryCardProps} />
                    </Box>
                </Box>
            </Container>

            <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity="success" onClose={() => setSnackOpen(false)} icon={<CheckCircleIcon />} sx={{ fontWeight: 700 }}>
                    {LABELS.successTitle}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentPage;