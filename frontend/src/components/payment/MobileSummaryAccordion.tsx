import { Box, Paper, Typography, Chip, Divider, Collapse } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import { gradients } from "../../theme/gradients.ts";
import { LABELS, CURRENCY_SYMBOLS } from "../../types/paymentPageConfig";
import SummaryCard from "./SummaryCard.tsx";
import type { OrderSummary } from "../../types/paymentPageConfig";

interface SummaryCardProps {
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

interface Props {
    open:            boolean;
    onToggle:        () => void;
    effectiveTotal:  string;
    currency:        string;
    summaryCardProps: SummaryCardProps;
}

const MobileSummaryAccordion = ({ open, onToggle, effectiveTotal, currency, summaryCardProps }: Props) => {
    const sym = CURRENCY_SYMBOLS[currency] ?? currency;

    return (
        <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
            <Paper elevation={1} sx={{ borderRadius: 3, border: `1px solid ${summaryCardProps.summary.currency}`, overflow: "hidden" }}>
                <Box onClick={onToggle} role="button" tabIndex={0} aria-expanded={open}
                     onKeyDown={(e) => e.key === "Enter" && onToggle()}
                     sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, cursor: "pointer", userSelect: "none" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{LABELS.orderSummary}</Typography>
                        <Chip label={`${sym} ${effectiveTotal}`} size="small"
                              sx={{ background: gradients.primary, color: "#fff", fontWeight: 700, fontSize: 12 }} />
                    </Box>
                    {open ? <ExpandLessIcon sx={{ color: "text.secondary" }} /> : <ExpandMoreIcon sx={{ color: "text.secondary" }} />}
                </Box>
                <Collapse in={open}>
                    <Divider />
                    <Box sx={{ p: 2 }}><SummaryCard {...summaryCardProps} /></Box>
                </Collapse>
            </Paper>
        </Box>
    );
};

export default MobileSummaryAccordion;