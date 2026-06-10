// components/dashboard/DashboardBottomNav.tsx
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors }         from "../../theme/gradients";
import type { NavKey, NavItem } from "./SidebarItem";

const BOTTOM_NAV_H = 64;

interface Props {
    nav:      NavItem[];
    active:   NavKey;
    onChange: (key: NavKey) => void;
}

export default function DashboardBottomNav({ nav, active, onChange }: Props) {
    const { t } = useTranslation();

    return (
        <Paper
            elevation={8}
            sx={{
                position: "fixed",
                bottom: 0, left: 0, right: 0,
                zIndex: 900,
                borderTop: `1px solid ${colors.border}`,
                borderRadius: 0,
            }}
        >
            <BottomNavigation
                value={active}
                onChange={(_, v) => onChange(v as NavKey)}
                sx={{
                    height: BOTTOM_NAV_H,
                    bgcolor: "background.paper",
                    "& .Mui-selected": { color: "primary.main !important" },
                }}
            >
                {nav.map(item => (
                    <BottomNavigationAction
                        key={item.key}
                        value={item.key}
                        label={t(item.labelKey)}
                        icon={item.icon}
                        sx={{
                            minWidth: 0,
                            color: "text.disabled",
                            "& .MuiBottomNavigationAction-label": {
                                fontSize: 10, fontWeight: 600, mt: 0.3,
                                minHeight: 28, display: "flex",
                                alignItems: "flex-start", justifyContent: "center",
                            },
                            "&.Mui-selected .MuiBottomNavigationAction-label": { fontSize: 10, fontWeight: 800 },
                        }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
