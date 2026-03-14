// components/settings/BalanceSection.tsx
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useState } from "react";
import SettingsSectionWrapper from "./SettingsSectionWraper.tsx";
import { colors } from "../../theme/gradients";

interface Props {
    balance:  number;
    currency: string;
}

export default function BalanceSection({ balance, currency }: Props) {
    const [amount, setAmount] = useState("");

    // TODO: înlocuiește cu POST /api/payments/topup
    function handleTopUp() {
        setAmount("");
    }

    return (
        <SettingsSectionWrapper
            title="Cont & sold"
            description="Soldul disponibil pentru plata chiriei."
        >
            <Box sx={{
                display: "flex", alignItems: "center", gap: 2,
                p: 2.5, borderRadius: 2, mb: 3,
                border: `1px solid ${colors.border}`,
                bgcolor: "background.default",
            }}>
                <AccountBalanceWalletIcon sx={{ color: "primary.main", fontSize: 32 }} />
                <Box>
                    <Typography fontSize={12} color="text.secondary" fontWeight={600}>
                        Sold disponibil
                    </Typography>
                    <Typography fontSize={22} fontWeight={900} color="primary.main">
                        {balance.toFixed(2)} {currency}
                    </Typography>
                </Box>
                <Chip label="Activ" color="success" size="small" sx={{ ml: "auto" }} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField
                    size="small" label="Sumă de adăugat" type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ width: 180 }}
                />
                <Button variant="outlined" onClick={handleTopUp}
                        disabled={!amount || Number(amount) <= 0}
                        sx={{ borderRadius: 2, px: 3, mt: 0.2 }}
                >
                    Adaugă fonduri
                </Button>
            </Box>
        </SettingsSectionWrapper>
    );
}