// components/apartmentDetail/StatusBanner.tsx
import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/gradients";

type BannerType = "pending" | "declined" | "success";

interface Props {
    type:    BannerType;
    icon:    React.ReactNode;
    message: string;
}

const bgMap: Record<BannerType, string> = {
    pending:  "rgba(245,158,11,0.08)",
    declined: "rgba(239,68,68,0.08)",
    success:  colors.primaryAlpha06,
};
const borderMap: Record<BannerType, string> = {
    pending:  "rgba(245,158,11,0.3)",
    declined: "rgba(239,68,68,0.3)",
    success:  colors.border,
};
const colorMap: Record<BannerType, string> = {
    pending:  "#d97706",
    declined: "#b91c1c",
    success:  colors.primary,
};

export default function StatusBanner({ type, icon, message }: Props) {
    return (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 2.5, py: 1.5, borderRadius: 3, mb: 3,
            bgcolor: bgMap[type],
            border: `1px solid ${borderMap[type]}`,
        }}>
            <Box sx={{ color: colorMap[type], display: "flex", flexShrink: 0 }}>{icon}</Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: colorMap[type] }}>
                {message}
            </Typography>
        </Box>
    );
}
