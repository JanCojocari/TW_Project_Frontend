// components/settings/BalanceSection.tsx
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useState }             from "react";
import { useTranslation }       from "react-i18next";
import SettingsSectionWrapper   from "./SettingsSectionWraper.tsx";
import { colors }               from "../../theme/gradients";

interface Props { balance: number; currency: string; }

export default function BalanceSection({ balance, currency }: Props) {
    const { t }         = useTranslation();
    const [amount, setAmount] = useState("");

    return (
        <SettingsSectionWrapper
            title={t("settings.balance.title")}
            description={t("settings.balance.description")}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2.5, borderRadius: 2, mb: 3, border: `1px solid ${colors.border}`, bgcolor: "background.default" }}>
                <AccountBalanceWalletIcon sx={{ color: "primary.main", fontSize: 32 }} />
                <Box>
                    <Typography fontSize={12} color="text.secondary" fontWeight={600}>
                        {t("settings.balance.available")}
                    </Typography>
                    <Typography fontSize={22} fontWeight={900} color="primary.main">
                        {balance.toFixed(2)} {currency}
                    </Typography>
                </Box>
                <Chip label={t("settings.balance.active")} color="success" size="small" sx={{ ml: "auto" }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField size="small" label={t("settings.balance.addAmount")} type="number"
                           value={amount} onChange={(e) => setAmount(e.target.value)}
                           inputProps={{ min: 1, onWheel: (e: any) => e.currentTarget.blur() }}
                           sx={{ width: 180 }} />
                <Button variant="outlined" onClick={() => setAmount("")}
                        disabled={!amount || Number(amount) <= 0}
                        sx={{ borderRadius: 2, px: 3, mt: 0.2 }}>
                    {t("settings.balance.addFunds")}
                </Button>
            </Box>
        </SettingsSectionWrapper>
    );
}