import { Box, Tabs, Tab, Typography } from "@mui/material";
import { PAYMENT_METHODS } from "../../types/paymentPageConfig";
import { colors } from "../../theme/gradients.ts";
import type { PaymentMethodId } from "../../types/paymentPageConfig";
import { useTranslation } from "react-i18next";

interface Props {
    selected:  PaymentMethodId;
    onChange:  (id: PaymentMethodId) => void;
    disabled?: boolean;
}

const PaymentMethodTabs = ({ selected, onChange, disabled }: Props) => {
    const { t } = useTranslation();

    return (
        <Tabs
            value={selected}
            onChange={(_e, v) => onChange(v as PaymentMethodId)}
            aria-label={t("payment.methodLabel")}
            sx={{
                mb: 3,
                "& .MuiTabs-flexContainer": { gap: 1, flexWrap: "wrap" },
                "& .MuiTabs-indicator": { display: "none" },
            }}
        >
            {PAYMENT_METHODS.map((m) => {
                const label       = t(`payment.methods.${m.id}.label`);
                const description = t(`payment.methods.${m.id}.description`);
                return (
                    <Tab
                        key={m.id}
                        value={m.id}
                        disabled={disabled}
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <span role="img" aria-label={label}>{m.icon}</span>
                                <Box sx={{ textAlign: "left" }}>
                                    <Typography variant="body2" fontWeight={700} lineHeight={1.2}>{label}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                                        {description}
                                    </Typography>
                                </Box>
                            </Box>
                        }
                        sx={{
                            border: `1px solid ${selected === m.id ? colors.primary : colors.border}`,
                            borderRadius: 2, px: 2, py: 1.2,
                            minWidth: { xs: "auto", sm: 160 },
                            background: selected === m.id ? "rgba(76, 139, 245, 0.06)" : "transparent",
                            transition: "all 0.2s ease", textTransform: "none",
                            color: selected === m.id ? "primary.main" : "text.secondary",
                            "&.Mui-selected": { color: "primary.main" },
                            "&:hover": { borderColor: colors.primary, bgcolor: "rgba(76, 139, 245, 0.04)" },
                        }}
                    />
                );
            })}
        </Tabs>
    );
};

export default PaymentMethodTabs;