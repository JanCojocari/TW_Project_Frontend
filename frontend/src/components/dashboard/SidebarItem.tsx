import { Box, Typography } from "@mui/material";
import { useTranslation }  from "react-i18next";
import PersonIcon    from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaymentIcon   from "@mui/icons-material/Payment";
import FavoriteIcon  from "@mui/icons-material/Favorite";
import EventIcon     from "@mui/icons-material/Event";
import HistoryIcon   from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { gradients, colors } from "../../theme/gradients";

export type NavKey = "profile" | "listings" | "recent" | "favorites" | "upcoming" | "previous" | "payments";

export interface NavItem { key: NavKey; labelKey: string; icon: React.ReactNode }

export const ALL_NAV: NavItem[] = [
    { key: "profile",   labelKey: "dashboard.tabs.profile",       icon: <PersonIcon     sx={{ fontSize: 22 }} /> },
    { key: "listings",  labelKey: "dashboard.tabs.apartments",     icon: <ApartmentIcon  sx={{ fontSize: 22 }} /> },
    { key: "recent",    labelKey: "dashboard.tabs.recentViewed",   icon: <VisibilityIcon sx={{ fontSize: 22 }} /> },
    { key: "favorites", labelKey: "dashboard.tabs.favorites",      icon: <FavoriteIcon   sx={{ fontSize: 22 }} /> },
    { key: "upcoming",  labelKey: "dashboard.tabs.upcomingStays",  icon: <EventIcon      sx={{ fontSize: 22 }} /> },
    { key: "previous",  labelKey: "dashboard.tabs.previousStays",  icon: <HistoryIcon    sx={{ fontSize: 22 }} /> },
    { key: "payments",  labelKey: "dashboard.tabs.payments",       icon: <PaymentIcon    sx={{ fontSize: 22 }} /> },
];

interface Props { item: NavItem; isActive: boolean; onClick: () => void }

export default function SidebarItem({ item, isActive, onClick }: Props) {
    const { t } = useTranslation();
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                all: "unset",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.6,
                width: "100%",
                py: 1.5,
                cursor: "pointer",
                position: "relative",
                color: isActive ? "primary.main" : "text.disabled",
                transition: "color .15s",
                bgcolor: isActive ? colors.primaryAlpha06 : "transparent",
                "&:hover": { color: "primary.main", bgcolor: colors.primaryAlpha06 },
                "&::before": isActive ? {
                    content: '""',
                    position: "absolute",
                    left: 0, top: "20%", bottom: "20%",
                    width: 3,
                    borderRadius: "0 4px 4px 0",
                    background: gradients.primary,
                } : {},
            }}
        >
            {item.icon}
            <Typography sx={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.2,
                textAlign: "center",
                color: "inherit",
            }}>
                {t(item.labelKey)}
            </Typography>
        </Box>
    );
}
