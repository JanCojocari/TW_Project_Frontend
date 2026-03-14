// components/settings/SettingsSectionWrapper.tsx
import { Box, Paper, Typography } from "@mui/material";
import { colors } from "../../theme/gradients";

interface Props {
    title:       string;
    description: string;
    children:    React.ReactNode;
    danger?:     boolean;
}

export default function SettingsSectionWrapper({ title, description, children, danger }: Props) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${danger ? "#ffcdd2" : colors.border}`,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    px: 4, py: 2.5,
                    borderBottom: `1px solid ${danger ? "#ffcdd2" : colors.border}`,
                    bgcolor: danger ? "#fff5f5" : "background.default",
                }}
            >
                <Typography
                    fontWeight={800}
                    fontSize={15}
                    color={danger ? "error.main" : "text.primary"}
                >
                    {title}
                </Typography>
                <Typography fontSize={13} color="text.secondary" mt={0.5}>
                    {description}
                </Typography>
            </Box>
            <Box sx={{ px: 4, py: 3, bgcolor: "background.paper" }}>
                {children}
            </Box>
        </Paper>
    );
}