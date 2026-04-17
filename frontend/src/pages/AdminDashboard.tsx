// pages/AdminDashboard.tsx
import { useState }          from "react";
import { Box, Container, Paper, Tab, Tabs, Typography, Chip } from "@mui/material";
import {
    People as PeopleIcon,
    Apartment as ApartmentIcon,
    Support as SupportIcon,
    Star as StarIcon,
    Payment as PaymentIcon,
    BarChart as StatsIcon,
} from "@mui/icons-material";
import { gradients, colors } from "../theme/gradients";

type AdminTab = 0 | 1 | 2 | 3 | 4 | 5;

const tabConfig = [
    { label: "Users",    icon: <PeopleIcon    sx={{ fontSize: 18 }} /> },
    { label: "Listings", icon: <ApartmentIcon sx={{ fontSize: 18 }} /> },
    { label: "Support",  icon: <SupportIcon   sx={{ fontSize: 18 }} /> },
    { label: "Reviews",  icon: <StarIcon       sx={{ fontSize: 18 }} /> },
    { label: "Payments", icon: <PaymentIcon   sx={{ fontSize: 18 }} /> },
    { label: "Platform", icon: <StatsIcon     sx={{ fontSize: 18 }} /> },
];

const PlaceholderTab = ({ label }: { label: string }) => (
    <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.disabled" sx={{ fontSize: 18, fontStyle: "italic" }}>
            {label} — coming soon
        </Typography>
    </Box>
);

export default function AdminDashboard() {
    const [tab, setTab] = useState<AdminTab>(0);

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, minHeight: "100vh", mt: 10 }}>
            <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: `1px solid ${colors.border}` }}>

                <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-1px" }}>
                                Admin{" "}
                                <Box component="span" sx={{ background: gradients.textPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Dashboard
                                </Box>
                            </Typography>
                            <Chip label="Admin" size="small" color="warning" sx={{ fontWeight: 700 }} />
                        </Box>
                        <Typography color="text.secondary">
                            Manage users, listings, support requests, reviews and payments.
                        </Typography>
                    </Box>
                </Box>

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 4, borderBottom: `1px solid ${colors.border}` }}
                >
                    {tabConfig.map((t, idx) => (
                        <Tab
                            key={t.label}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ color: tab === idx ? "primary.main" : "text.secondary", display: "flex", alignItems: "center" }}>
                                        {t.icon}
                                    </Box>
                                    <span>{t.label}</span>
                                </Box>
                            }
                        />
                    ))}
                </Tabs>

                <Box>
                    {tab === 0 && <PlaceholderTab label="Users management" />}
                    {tab === 1 && <PlaceholderTab label="Listings management" />}
                    {tab === 2 && <PlaceholderTab label="Support management" />}
                    {tab === 3 && <PlaceholderTab label="Reviews management" />}
                    {tab === 4 && <PlaceholderTab label="Payments management" />}
                    {tab === 5 && <PlaceholderTab label="Platform stats" />}
                </Box>

            </Paper>
        </Container>
    );
}
