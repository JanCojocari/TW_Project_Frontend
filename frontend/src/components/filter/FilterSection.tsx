// components/filters/FilterSection.tsx
import { Box, Divider, Typography } from "@mui/material";

interface Props {
    title:    string;
    children: React.ReactNode;
    noDivider?: boolean;
}

export default function FilterSection({ title, children, noDivider }: Props) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={800} sx={{
                mb: 1.5, color: "primary.dark",
                textTransform: "uppercase", letterSpacing: "0.8px", fontSize: "11px",
            }}>
                {title}
            </Typography>
            {children}
            {!noDivider && <Divider sx={{ mt: 3 }} />}
        </Box>
    );
}