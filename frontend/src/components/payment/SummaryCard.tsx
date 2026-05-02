import { Box, Paper, Typography, Divider, TextField, Button, IconButton, CircularProgress } from "@mui/material";
import { Lock as LockIcon, LocalOffer as LocalOfferIcon, Close as CloseIcon } from "@mui/icons-material";
import { CURRENCY_SYMBOLS } from "../../types/paymentPageConfig";
import { colors } from "../../theme/gradients.ts";
import type { OrderSummary, OrderItem } from "../../types/paymentPageConfig";
import { useTranslation } from "react-i18next";

interface Props {
    summary:       OrderSummary;
    promoCode:     string;
    promoMessage:  string;
    promoDiscount: number;
    promoLoading:  boolean;
    appliedPromo:  string;
    onPromoChange: (v: string) => void;
    onPromoApply:  () => void;
    onPromoRemove: () => void;
}

const SummaryRow = ({ label, value, bold = false, green = false }: { label: string; value: string; bold?: boolean; green?: boolean }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
        <Typography variant="body2" color={green ? "success.dark" : bold ? "text.primary" : "text.secondary"} fontWeight={bold ? 700 : 400}>{label}</Typography>
        <Typography variant="body2" color={green ? "success.dark" : bold ? "text.primary" : "text.secondary"} fontWeight={bold ? 700 : 400}>{value}</Typography>
    </Box>
);

const SummaryCard = ({ summary, promoCode, promoMessage, promoDiscount, promoLoading, appliedPromo, onPromoChange, onPromoApply, onPromoRemove }: Props) => {
    const { t } = useTranslation();
    const sym               = CURRENCY_SYMBOLS[summary.currency] ?? summary.currency;
    const effectiveDiscount = summary.discount + promoDiscount;
    const effectiveTotal    = (summary.total - promoDiscount).toFixed(2);

    return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
            <Typography variant="h6" fontWeight={800} mb={2.5} letterSpacing="-0.3px">{t("payment.orderSummary")}</Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2.5 }}>
                {summary.items.map((item: OrderItem) => (
                    <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>{item.title}</Typography>
                            {item.subtitle && <Typography variant="caption" color="text.secondary">{item.subtitle}</Typography>}
                        </Box>
                        <Typography variant="body2" fontWeight={600} ml={2} whiteSpace="nowrap">{sym} {(item.unitPrice * item.quantity).toFixed(2)}</Typography>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ mb: 1.5 }} />
            <SummaryRow label={t("payment.subtotal")}   value={`${sym} ${summary.subtotal.toFixed(2)}`} />
            <SummaryRow label={t("payment.serviceFee")} value={`${sym} ${summary.serviceFee.toFixed(2)}`} />
            {effectiveDiscount > 0 && <SummaryRow label={t("payment.discount")} value={`−${sym} ${effectiveDiscount.toFixed(2)}`} green />}
            <Divider sx={{ my: 1.5 }} />
            <SummaryRow label={t("payment.total")} value={`${sym} ${effectiveTotal}`} bold />

            <Box sx={{ mt: 2.5 }}>
                {appliedPromo && promoDiscount > 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, borderRadius: 2, bgcolor: "rgba(125,170,146,0.1)", border: "1px solid rgba(125,170,146,0.3)" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocalOfferIcon sx={{ fontSize: 16, color: "success.main" }} />
                            <Typography variant="caption" fontWeight={700} color="success.dark">{appliedPromo.toUpperCase()} {t("payment.promoApplied")}</Typography>
                        </Box>
                        <IconButton size="small" onClick={onPromoRemove} aria-label={t("payment.promoRemoveAriaLabel")}>
                            <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField size="small" placeholder={t("payment.promoPlaceholder")} value={promoCode}
                                       onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
                                       onKeyDown={(e) => e.key === "Enter" && onPromoApply()}
                                       inputProps={{ "aria-label": t("payment.promoPlaceholder"), maxLength: 20 }} sx={{ flex: 1 }} />
                            <Button variant="outlined" size="small" onClick={onPromoApply}
                                    disabled={!promoCode.trim() || promoLoading} sx={{ whiteSpace: "nowrap", minWidth: 80 }}>
                                {promoLoading ? <CircularProgress size={14} /> : t("payment.applyPromo")}
                            </Button>
                        </Box>
                        {promoMessage && <Typography variant="caption" color="error" mt={0.5} display="block">{promoMessage}</Typography>}
                    </>
                )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2.5, pt: 2, borderTop: `1px solid ${colors.border}`, opacity: 0.65 }}>
                <LockIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">{t("payment.secureSSL")}</Typography>
            </Box>
        </Paper>
    );
};

export default SummaryCard;