import { Box, Typography } from "@mui/material";
import { gradients }       from "../../theme/gradients";

interface Props { title: string; subtitle?: string }

export default function PageHeading({ title, subtitle }: Props) {
    return (
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
            <Typography sx={{
                fontSize: { xs: 18, md: 22 },
                fontWeight: 900,
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
                background: gradients.textPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography sx={{ fontSize: { xs: 12, md: 13 }, color: "text.secondary", mt: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
}
