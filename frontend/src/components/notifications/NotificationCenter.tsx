// components/notifications/NotificationCenter.tsx
import {
    Badge, Box, Divider, IconButton, List, ListItem,
    ListItemText, Paper, Popover, Tooltip, Typography,
    Button,
} from "@mui/material";
import NotificationsIcon     from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CheckIcon             from "@mui/icons-material/Check";
import DeleteOutlineIcon     from "@mui/icons-material/DeleteOutline";
import DoneAllIcon           from "@mui/icons-material/DoneAll";
import { useState }          from "react";
import { useTranslation }    from "react-i18next";
import {
    useNotifications,
    type AppNotification,
} from "../../context/NotificationContext";
import { gradients, colors } from "../../theme/gradients";
import { formatDateLong }    from "../../utils/formatDate";
import { notifIcon, notifColor } from "./notifMeta";

// ── Componenta card pentru o singura notificare ──────────────────────────────

function NotifItem({
                       notif, onRead, onRemove,
                   }: {
    notif:    AppNotification;
    onRead:   (id: string) => void;
    onRemove: (id: string) => void;
}) {
    const accent = notifColor(notif.type);
    const Icon   = notifIcon(notif.type);

    return (
        <ListItem
            disableGutters
            sx={{
                px: 2,
                py: 1.2,
                gap: 1.5,
                alignItems: "flex-start",
                bgcolor: notif.read ? "transparent" : "action.hover",
                transition: "background 0.2s",
                borderLeft: notif.read ? "3px solid transparent" : `3px solid ${accent}`,
            }}
        >
            {/* Icoana tip */}
            <Box
                sx={{
                    width: 36, height: 36, borderRadius: "50%",
                    bgcolor: `${accent}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, mt: 0.3,
                }}
            >
                <Icon sx={{ fontSize: 18, color: accent }} />
            </Box>

            {/* Mesaj + data */}
            <ListItemText
                primary={
                    <Typography
                        variant="body2"
                        fontWeight={notif.read ? 400 : 600}
                        sx={{ lineHeight: 1.4 }}
                    >
                        {notif.message}
                    </Typography>
                }
                secondary={
                    <Typography variant="caption" color="text.disabled">
                        {formatDateLong(notif.createdAt)}
                    </Typography>
                }
            />

            {/* Actiuni */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flexShrink: 0 }}>
                {!notif.read && (
                    <Tooltip title="Marcheaza ca citit">
                        <IconButton size="small" onClick={() => onRead(notif.id)}>
                            <CheckIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Sterge">
                    <IconButton size="small" onClick={() => onRemove(notif.id)}>
                        <DeleteOutlineIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </ListItem>
    );
}

// ── Componenta principala ────────────────────────────────────────────────────

const NotificationCenter = () => {
    const { t } = useTranslation();
    const {
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        removeNotification,
        clearAll,
    } = useNotifications();

    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const open = Boolean(anchor);

    const handleOpen  = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);

    return (
        <>
            {/* Buton bell din header */}
            <Tooltip title={t("notifications.title")}>
                <IconButton
                    onClick={handleOpen}
                    sx={{
                        border: `1px solid ${colors.border}`,
                        color: open ? "primary.main" : "text.secondary",
                        transition: "all 0.2s ease",
                        "&:hover": { bgcolor: "action.hover" },
                    }}
                >
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        max={99}
                    >
                        {unreadCount > 0
                            ? <NotificationsIcon fontSize="small" />
                            : <NotificationsNoneIcon fontSize="small" />
                        }
                    </Badge>
                </IconButton>
            </Tooltip>

            {/* Popover - floating island */}
            <Popover
                open={open}
                anchorEl={anchor}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        elevation: 8,
                        sx: {
                            mt: 1.5,
                            width: 380,
                            maxWidth: "calc(100vw - 32px)",
                            borderRadius: 3,
                            overflow: "hidden",
                            // sageata decorativa identica cu UserMenu
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0, right: 14,
                                width: 10, height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                                borderTop: "1px solid",
                                borderLeft: "1px solid",
                                borderColor: "divider",
                            },
                        },
                    },
                }}
            >
                {/* Header popover */}
                <Box
                    sx={{
                        px: 2.5, py: 2,
                        background: gradients.primary,
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography fontWeight={800} color="#fff" fontSize="1rem">
                            {t("notifications.title")}
                        </Typography>
                        {unreadCount > 0 && (
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {unreadCount} {t("notifications.unread")}
                            </Typography>
                        )}
                    </Box>
                    {notifications.length > 0 && (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            {unreadCount > 0 && (
                                <Tooltip title={t("notifications.markAllRead")}>
                                    <IconButton size="small" onClick={markAllRead} sx={{ color: "#fff" }}>
                                        <DoneAllIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title={t("notifications.clearAll")}>
                                <IconButton size="small" onClick={clearAll} sx={{ color: "#fff" }}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>

                <Divider />

                {/* Lista notificari */}
                {notifications.length === 0 ? (
                    <Box
                        sx={{
                            py: 6, px: 3,
                            textAlign: "center",
                            color: "text.disabled",
                        }}
                    >
                        <NotificationsNoneIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.4 }} />
                        <Typography variant="body2">{t("notifications.empty")}</Typography>
                    </Box>
                ) : (
                    <List
                        disablePadding
                        sx={{
                            maxHeight: 420,
                            overflowY: "auto",
                            "&::-webkit-scrollbar": { width: 4 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 4 },
                        }}
                    >
                        {notifications.map((n, idx) => (
                            <Box key={n.id}>
                                <NotifItem
                                    notif={n}
                                    onRead={markRead}
                                    onRemove={removeNotification}
                                />
                                {idx < notifications.length - 1 && (
                                    <Divider sx={{ mx: 2 }} />
                                )}
                            </Box>
                        ))}
                    </List>
                )}
            </Popover>
        </>
    );
};

export default NotificationCenter;