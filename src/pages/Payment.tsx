// src/pages/PaymentPage.tsx
import { useState, useCallback, useMemo, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    TextField,
    Tabs,
    Tab,
    Divider,
    Alert,
    Collapse,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Chip,
    IconButton,
    Snackbar,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CheckCircle as CheckCircleIcon,
    LocalOffer as LocalOfferIcon,
    Close as CloseIcon,
    Lock as LockIcon,
} from "@mui/icons-material";

import { gradients, colors } from "../theme/gradients";
import { apartments } from "../mockdata/apartments";
import { paymentService } from "../services/paymentService";
import { 
    PAYMENT_METHODS, 
    FIELDS_BY_METHOD, 
    BILLING_ADDRESS_FIELDS, 
    CURRENCY_SYMBOLS, 
    SERVICE_FEE_RATE, 
    LABELS } from "../types/paymentPageConfig";
import type { 
    PaymentMethodId, 
    OrderItem, 
    OrderSummary, 
    FieldConfig, 
    PaymentPayload, 
    PaymentResult } from "../types/paymentPageConfig";

// ─── Types locali ─────────────────────────────────────────────────────────────

interface PaymentPageProps {
    summary?: OrderSummary;
    defaultPaymentMethod?: PaymentMethodId;
    onPay?: (payload: PaymentPayload) => Promise<PaymentResult>;
    onBack?: () => void;
    onSuccess?: (result: PaymentResult) => void;
    onError?: (err: string) => void;
}

type FieldErrors = Record<string, string>;
type FormState = Record<string, string>;

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
    field: FieldConfig;
    value: string;
    error?: string;
    onChange: (name: string, value: string) => void;
    disabled?: boolean;
}

const FormField = ({ field, value, error, onChange, disabled }: FormFieldProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const formatted = field.format ? field.format(raw) : raw;
        onChange(field.name, formatted);
    };

    return (
        <TextField
            id={`field-${field.name}`}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            value={value}
            onChange={handleChange}
            error={!!error}
            helperText={error ?? field.hint ?? ""}
            fullWidth
            required={field.required}
            disabled={disabled}
            autoComplete={field.autoComplete}
            inputProps={{ maxLength: field.maxLength }}
        />
    );
};

// ─── PaymentMethodTabs ────────────────────────────────────────────────────────

interface PaymentMethodTabsProps {
    selected: PaymentMethodId;
    onChange: (id: PaymentMethodId) => void;
    disabled?: boolean;
}

const PaymentMethodTabs = ({ selected, onChange, disabled }: PaymentMethodTabsProps) => (
    <Tabs
        value={selected}
        onChange={(_e, v) => onChange(v as PaymentMethodId)}
        aria-label={LABELS.paymentMethod}
        sx={{
            mb: 3,
            "& .MuiTabs-flexContainer": { gap: 1, flexWrap: "wrap" },
            "& .MuiTabs-indicator": { display: "none" },
        }}
    >
        {PAYMENT_METHODS.map((m) => (
            <Tab
                key={m.id}
                value={m.id}
                disabled={disabled}
                label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span role="img" aria-label={m.label}>{m.icon}</span>
                        <Box sx={{ textAlign: "left" }}>
                            <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                                {m.label}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: { xs: "none", sm: "block" } }}
                            >
                                {m.description}
                            </Typography>
                        </Box>
                    </Box>
                }
                sx={{
                    border: `1px solid ${selected === m.id ? colors.primary : colors.border}`,
                    borderRadius: 2,
                    px: 2,
                    py: 1.2,
                    minWidth: { xs: "auto", sm: 160 },
                    background:
                        selected === m.id ? "rgba(76, 139, 245, 0.06)" : "transparent",
                    transition: "all 0.2s ease",
                    textTransform: "none",
                    color: selected === m.id ? "primary.main" : "text.secondary",
                    "&.Mui-selected": { color: "primary.main" },
                    "&:hover": {
                        borderColor: colors.primary,
                        bgcolor: "rgba(76, 139, 245, 0.04)",
                    },
                }}
            />
        ))}
    </Tabs>
);

// ─── SummaryCard ──────────────────────────────────────────────────────────────

interface SummaryCardProps {
    summary: OrderSummary;
    promoCode: string;
    promoMessage: string;
    promoDiscount: number;
    promoLoading: boolean;
    appliedPromo: string;
    onPromoChange: (v: string) => void;
    onPromoApply: () => void;
    onPromoRemove: () => void;
}

const SummaryCard = ({
                         summary,
                         promoCode,
                         promoMessage,
                         promoDiscount,
                         promoLoading,
                         appliedPromo,
                         onPromoChange,
                         onPromoApply,
                         onPromoRemove,
                     }: SummaryCardProps) => {
    const sym = CURRENCY_SYMBOLS[summary.currency] ?? summary.currency;
    const effectiveDiscount = summary.discount + promoDiscount;
    const effectiveTotal = (summary.total - promoDiscount).toFixed(2);

    const SummaryRow = ({
                            label,
                            value,
                            bold = false,
                            green = false,
                        }: {
        label: string;
        value: string;
        bold?: boolean;
        green?: boolean;
    }) => (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
            <Typography
                variant="body2"
                color={green ? "success.dark" : bold ? "text.primary" : "text.secondary"}
                fontWeight={bold ? 700 : 400}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                color={green ? "success.dark" : bold ? "text.primary" : "text.secondary"}
                fontWeight={bold ? 700 : 400}
            >
                {value}
            </Typography>
        </Box>
    );

    return (
        <Paper
            elevation={1}
            sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
            }}
        >
            <Typography variant="h6" fontWeight={800} mb={2.5} letterSpacing="-0.3px">
                {LABELS.orderSummary}
            </Typography>

            {/* Items */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2.5 }}>
                {summary.items.map((item: OrderItem) => (
                    <Box
                        key={item.id}
                        sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                    >
                        <Box>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                {item.title}
                            </Typography>
                            {item.subtitle && (
                                <Typography variant="caption" color="text.secondary">
                                    {item.subtitle}
                                </Typography>
                            )}
                        </Box>
                        <Typography variant="body2" fontWeight={600} ml={2} whiteSpace="nowrap">
                            {sym} {(item.unitPrice * item.quantity).toFixed(2)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <SummaryRow label={LABELS.subtotal} value={`${sym} ${summary.subtotal.toFixed(2)}`} />
            <SummaryRow label={LABELS.serviceFee} value={`${sym} ${summary.serviceFee.toFixed(2)}`} />
            {effectiveDiscount > 0 && (
                <SummaryRow
                    label={LABELS.discount}
                    value={`−${sym} ${effectiveDiscount.toFixed(2)}`}
                    green
                />
            )}

            <Divider sx={{ my: 1.5 }} />
            <SummaryRow label={LABELS.total} value={`${sym} ${effectiveTotal}`} bold />

            {/* Promo code */}
            <Box sx={{ mt: 2.5 }}>
                {appliedPromo && promoDiscount > 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "rgba(125, 170, 146, 0.1)",
                            border: "1px solid rgba(125, 170, 146, 0.3)",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocalOfferIcon sx={{ fontSize: 16, color: "success.main" }} />
                            <Typography variant="caption" fontWeight={700} color="success.dark">
                                {appliedPromo.toUpperCase()} aplicat
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={onPromoRemove}
                            aria-label="Elimină codul promo"
                        >
                            <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder={LABELS.promoPlaceholder}
                                value={promoCode}
                                onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === "Enter" && onPromoApply()}
                                inputProps={{ "aria-label": LABELS.promoPlaceholder, maxLength: 20 }}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={onPromoApply}
                                disabled={!promoCode.trim() || promoLoading}
                                sx={{ whiteSpace: "nowrap", minWidth: 80 }}
                            >
                                {promoLoading ? <CircularProgress size={14} /> : LABELS.applyPromo}
                            </Button>
                        </Box>
                        {promoMessage && (
                            <Typography variant="caption" color="error" mt={0.5} display="block">
                                {promoMessage}
                            </Typography>
                        )}
                    </>
                )}
            </Box>

            {/* Trust badge */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2.5,
                    pt: 2,
                    borderTop: `1px solid ${colors.border}`,
                    opacity: 0.65,
                }}
            >
                <LockIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                    Plată securizată SSL 256-bit
                </Typography>
            </Box>
        </Paper>
    );
};

// ─── PaymentPage ──────────────────────────────────────────────────────────────

const PaymentPage = ({
                         summary: summaryProp,
                         defaultPaymentMethod = "card",
                         onPay,
                         onBack,
                         onSuccess,
                         onError,
                     }: PaymentPageProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const apartmentId = searchParams.get("apartmentId");

    // Build summary from URL param if not provided via props
    const summary: OrderSummary = useMemo(() => {
        if (summaryProp) return summaryProp;

        const apt = apartments.find((a) => a.Id_Apartment === Number(apartmentId));
        if (!apt) {
            return { items: [], subtotal: 0, serviceFee: 0, discount: 0, total: 0, currency: "EUR" };
        }

        const subtotal = apt.Cost_per_interval;
        const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
        const intervalLabels: Record<string, string> = { hour: "oră", day: "zi", month: "lună" };

        return {
            currency: apt.Currency,
            items: [
                {
                    id: String(apt.Id_Apartment),
                    title: `Apartament – ${apt.Address}`,
                    subtitle: `Chirie / ${intervalLabels[apt.Interval] ?? apt.Interval}`,
                    quantity: 1,
                    unitPrice: apt.Cost_per_interval,
                },
            ],
            subtotal,
            serviceFee,
            discount: 0,
            total: subtotal + serviceFee,
        };
    }, [summaryProp, apartmentId]);

    // State
    const [method, setMethod] = useState<PaymentMethodId>(defaultPaymentMethod);
    const [formState, setFormState] = useState<FormState>({});
    const [errors, setErrors] = useState<FieldErrors>({});
    const [sameAddress, setSameAddress] = useState(true);

    const [promoInput, setPromoInput]     = useState("");
    const [appliedPromo, setAppliedPromo] = useState("");
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoMessage, setPromoMessage]   = useState("");
    const [promoLoading, setPromoLoading]   = useState(false);

    const [submitting, setSubmitting]   = useState(false);
    const [submitted, setSubmitted]     = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [snackOpen, setSnackOpen]     = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);

    const formRef = useRef<HTMLDivElement>(null);

    const handleFieldChange = useCallback((name: string, value: string) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    }, []);

    const validate = useCallback((): boolean => {
        const fields = FIELDS_BY_METHOD[method];
        const allFields =
            method === "card" && !sameAddress
                ? [...fields, ...BILLING_ADDRESS_FIELDS]
                : fields;

        const newErrors: FieldErrors = {};
        let valid = true;

        for (const field of allFields) {
            const value = formState[field.name] ?? "";
            if (field.required && !value.trim()) {
                newErrors[field.name] = "Câmp obligatoriu";
                valid = false;
                continue;
            }
            if (value.trim() && field.validate) {
                const err = field.validate(value);
                if (err) { newErrors[field.name] = err; valid = false; }
            }
        }

        setErrors(newErrors);
        if (!valid) {
            const firstKey = Object.keys(newErrors)[0];
            document.getElementById(`field-${firstKey}`)?.focus();
        }
        return valid;
    }, [method, formState, sameAddress]);

    const handlePromoApply = useCallback(async () => {
        if (!promoInput.trim()) return;
        setPromoLoading(true);
        const result = await paymentService.validatePromo(promoInput, summary.subtotal);
        setPromoLoading(false);
        if (result.valid) {
            setAppliedPromo(promoInput);
            setPromoDiscount(result.discount);
            setPromoMessage("");
        } else {
            setPromoMessage(result.message);
            setPromoDiscount(0);
        }
    }, [promoInput, summary.subtotal]);

    const handlePromoRemove = useCallback(() => {
        setAppliedPromo("");
        setPromoDiscount(0);
        setPromoMessage("");
        setPromoInput("");
    }, []);

    const handleMethodChange = useCallback((id: PaymentMethodId) => {
        setMethod(id);
        setFormState({});
        setErrors({});
    }, []);

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            setSubmitError("");
            if (!validate()) return;

            setSubmitting(true);
            const payload: PaymentPayload = {
                method,
                formValues: { ...formState, sameAddress },
                summary,
                promoCode: appliedPromo || undefined,
                apartmentId: apartmentId ? Number(apartmentId) : undefined,
            };

            try {
                const result = onPay
                    ? await onPay(payload)
                    : await paymentService.createPayment(payload);

                if (result.success) {
                    setSubmitted(true);
                    setSnackOpen(true);
                    onSuccess?.(result);
                    setTimeout(() => navigate("/dashboard"), 2500);
                } else {
                    const msg = result.error ?? "Plata a eșuat. Încearcă din nou.";
                    setSubmitError(msg);
                    onError?.(msg);
                }
            } catch {
                const msg = "A apărut o eroare neașteptată. Încearcă din nou.";
                setSubmitError(msg);
                onError?.(msg);
            } finally {
                setSubmitting(false);
            }
        },
        [validate, method, formState, sameAddress, summary, appliedPromo, apartmentId, onPay, onSuccess, onError, navigate]
    );

    const handleBack = useCallback(() => {
        if (onBack) onBack();
        else navigate(-1);
    }, [onBack, navigate]);

    const currentFields = FIELDS_BY_METHOD[method];
    const sym = CURRENCY_SYMBOLS[summary.currency] ?? summary.currency;
    const effectiveTotal = (summary.total - promoDiscount).toFixed(2);

    const summaryCardProps: SummaryCardProps = {
        summary,
        promoCode:    promoInput,
        promoMessage,
        promoDiscount,
        promoLoading,
        appliedPromo,
        onPromoChange: setPromoInput,
        onPromoApply:  handlePromoApply,
        onPromoRemove: handlePromoRemove,
    };

    // Success screen
    if (submitted) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pt: 8,
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        textAlign: "center",
                        maxWidth: 460,
                        mx: 2,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: gradients.success,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 3,
                            boxShadow: "0 8px 24px rgba(125, 170, 146, 0.3)",
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 40, color: "#fff" }} />
                    </Box>
                    <Typography variant="h5" fontWeight={900} mb={1} letterSpacing="-0.5px">
                        {LABELS.successTitle}
                    </Typography>
                    <Typography color="text.secondary" mb={3}>
                        {LABELS.successMessage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ești redirecționat către Dashboard...
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                pt: { xs: 9, md: 11 },
                pb: 8,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                        onClick={handleBack}
                        aria-label={LABELS.back}
                        sx={{ border: `1px solid ${colors.border}`, "&:hover": { borderColor: colors.primary } }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight={900} letterSpacing="-0.5px">
                            Finalizare plată
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Completează detaliile pentru a confirma rezervarea
                        </Typography>
                    </Box>
                </Box>

                {/* Mobile summary accordion */}
                <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
                    <Paper
                        elevation={1}
                        sx={{ borderRadius: 3, border: `1px solid ${colors.border}`, overflow: "hidden" }}
                    >
                        <Box
                            onClick={() => setSummaryOpen((v) => !v)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                            role="button"
                            aria-expanded={summaryOpen}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && setSummaryOpen((v) => !v)}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" fontWeight={700}>{LABELS.orderSummary}</Typography>
                                <Chip
                                    label={`${sym} ${effectiveTotal}`}
                                    size="small"
                                    sx={{ background: gradients.primary, color: "#fff", fontWeight: 700, fontSize: 12 }}
                                />
                            </Box>
                            {summaryOpen
                                ? <ExpandLessIcon sx={{ color: "text.secondary" }} />
                                : <ExpandMoreIcon sx={{ color: "text.secondary" }} />}
                        </Box>
                        <Collapse in={summaryOpen}>
                            <Divider />
                            <Box sx={{ p: 2 }}>
                                <SummaryCard {...summaryCardProps} />
                            </Box>
                        </Collapse>
                    </Paper>
                </Box>

                {/* 2-column layout */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
                        gap: 4,
                        alignItems: "start",
                    }}
                >
                    {/* LEFT: Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Formular de plată"
                        ref={formRef}
                    >
                        <Paper
                            elevation={1}
                            sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, mb: 3 }}
                        >
                            <Typography variant="subtitle1" fontWeight={700} mb={2}>
                                {LABELS.paymentMethod}
                            </Typography>

                            <PaymentMethodTabs
                                selected={method}
                                onChange={handleMethodChange}
                                disabled={submitting}
                            />

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        method === "card" ? { xs: "1fr", sm: "1fr 1fr" } : "1fr",
                                    gap: 2.5,
                                }}
                            >
                                {currentFields.map((field) => {
                                    const isFullWidth =
                                        method === "card" &&
                                        (field.name === "nameOnCard" || field.name === "cardNumber");
                                    return (
                                        <Box
                                            key={field.name}
                                            sx={{ gridColumn: isFullWidth ? "1 / -1" : "auto" }}
                                        >
                                            <FormField
                                                field={field}
                                                value={formState[field.name] ?? ""}
                                                error={errors[field.name]}
                                                onChange={handleFieldChange}
                                                disabled={submitting}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>

                            {/* Billing address (card only) */}
                            {method === "card" && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" fontWeight={700} mb={1}>
                                        {LABELS.billingAddress}
                                    </Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={sameAddress}
                                                onChange={(e) => setSameAddress(e.target.checked)}
                                                disabled={submitting}
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{LABELS.sameAsProfile}</Typography>
                                        }
                                    />
                                    <Collapse in={!sameAddress}>
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                                gap: 2.5,
                                                mt: 2,
                                            }}
                                        >
                                            {BILLING_ADDRESS_FIELDS.map((field, i) => (
                                                <Box
                                                    key={field.name}
                                                    sx={{ gridColumn: i === 0 ? "1 / -1" : "auto" }}
                                                >
                                                    <FormField
                                                        field={field}
                                                        value={formState[field.name] ?? ""}
                                                        error={errors[field.name]}
                                                        onChange={handleFieldChange}
                                                        disabled={submitting}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Collapse>
                                </Box>
                            )}

                            {method === "paypal" && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Vei fi redirecționat temporar la PayPal pentru a autoriza plata.
                                </Alert>
                            )}
                            {method === "bank_transfer" && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    Transferurile bancare pot dura 1–3 zile. Rezervarea se confirmă după primirea plății.
                                </Alert>
                            )}
                        </Paper>

                        {submitError && (
                            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError("")}>
                                {submitError}
                            </Alert>
                        )}

                        {/* CTAs */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={submitting}
                                startIcon={
                                    submitting
                                        ? <CircularProgress size={18} color="inherit" />
                                        : <LockIcon />
                                }
                                sx={{
                                    py: 1.8,
                                    fontSize: 16,
                                    fontWeight: 800,
                                    borderRadius: 2.5,
                                    maxWidth: { sm: 340 },
                                }}
                                aria-busy={submitting}
                            >
                                {submitting
                                    ? LABELS.processing
                                    : `${LABELS.pay} · ${sym} ${effectiveTotal}`}
                            </Button>

                            <Button
                                variant="text"
                                size="large"
                                onClick={handleBack}
                                disabled={submitting}
                                sx={{ color: "text.secondary", fontWeight: 600 }}
                            >
                                {LABELS.back}
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 1.5,
                                opacity: 0.6,
                            }}
                        >
                            <LockIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                Datele tale sunt criptate și securizate.
                            </Typography>
                        </Box>
                    </Box>

                    {/* RIGHT: Sticky summary (desktop) */}
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: 88 }}>
                        <SummaryCard {...summaryCardProps} />
                    </Box>
                </Box>
            </Container>

            <Snackbar
                open={snackOpen}
                autoHideDuration={4000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    onClose={() => setSnackOpen(false)}
                    icon={<CheckCircleIcon />}
                    sx={{ fontWeight: 700 }}
                >
                    {LABELS.successTitle}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PaymentPage;