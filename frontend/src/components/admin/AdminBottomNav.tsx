// components/admin/AdminBottomNav.tsx
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { colors }          from "../../theme/gradients";
import type { NavKey }     from "./PlatformTab";
import type { AdminNavItem } from "./AdminSidebar";

const BOTTOM_NAV_H = 64;

interface Props {
    nav:      AdminNavItem[];
    active:   NavKey;
    onChange: (key: NavKey) => void;
}

export default function AdminBottomNav({ nav, active, onChange }: Props) {
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
                showLabels
                sx={{
                    height: BOTTOM_NAV_H,
                    bgcolor: "background.paper",
                    "& .Mui-selected": { color: "primary.main !important" },
                    overflowX: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {nav.map(item => (
                    <BottomNavigationAction
                        key={item.key}
                        value={item.key}
                        label={item.label}
                        icon={item.icon}
                        sx={{
                            minWidth: 56,
                            color: "text.disabled",
                            "& .MuiBottomNavigationAction-label": { fontSize: 9, fontWeight: 600, mt: 0.3 },
                            "&.Mui-selected .MuiBottomNavigationAction-label": { fontSize: 9, fontWeight: 800 },
                        }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
