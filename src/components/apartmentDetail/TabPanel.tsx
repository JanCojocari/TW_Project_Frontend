import { Box } from "@mui/material";

interface Props { children: React.ReactNode; value: number; index: number; }

const TabPanel = ({ children, value, index }: Props) => (
    <Box role="tabpanel" hidden={value !== index} sx={{
        animation: value === index ? "fadeIn 0.3s ease" : "none",
        "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
    }}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
);

export default TabPanel;