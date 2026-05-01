// components/apartmentDetail/ApartmentInfoPanel.tsx
import { useState } from "react";
import {
    Box, Typography, Button, Paper, Divider,
    Chip, Tooltip, Popover, Avatar, IconButton,
} from "@mui/material";
import {
    LocationOn as LocationOnIcon,
    Phone as PhoneIcon,
    InfoOutlined as InfoIcon,
    PersonOutline as PersonIcon,
    EmailOutlined as EmailIcon,
} from "@mui/icons-material";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";
import type { Apartment } from "../../types/apartment.types";
import { resolveMediaUrl }   from "../../utils/mediaUrl.ts";

// Identica cu CAROUSEL_HEIGHT din ImageCarousel — cele doua coloane sunt la fel
const PANEL_HEIGHT = 460;

interface User {
    Id_User: number;
    Name: string;
    Surname: string;
    Email?: string | null;
    Phone: string;
    AvatarUrl?: string | null;
}

interface Props {
    apartment: Apartment;
    owner: User | null | undefined;
    renter: User | null | undefined;
    isAvailable: boolean;
    isOwner: boolean;
}

// ── Compact horizontal owner row ──────────────────────────────────────────────
const OwnerRow = ({ user, label }: { user: User; label: string }) => {
    const initials = `${user.Name?.[0] ?? ""}${user.Surname?.[0] ?? ""}`.toUpperCase();
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
                src={resolveMediaUrl(user.AvatarUrl)}
                sx={{
                    width: 44, height: 44,
                    background: gradients.primary,
                    fontSize: 15, fontWeight: 700, flexShrink: 0,
                }}
            >
                {initials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}
                            sx={{ display: "block", mb: 0.2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={700} noWrap>
                    {user.Name} {user.Surname}
                </Typography>
            </Box>
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                <PhoneIcon sx={{ fontSize: 15 }} />
                <Typography variant="caption" fontWeight={600}>{user.Phone}</Typography>
            </Box>
        </Box>
    );
};

// ── Renter Popover — nu adauga inaltime la panel ───────────────────────────────
const RenterPopover = ({ renter, label }: { renter: User; label: string }) => {
    const { t } = useTranslation();
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchor);
    const initials = `${renter.Name?.[0] ?? ""}${renter.Surname?.[0] ?? ""}`.toUpperCase();

    return (
        <>
            {/* Iconita I la stanga, chip la dreapta */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title={t("apartment.viewRenterDetails")} placement="top" arrow>
                    <IconButton
                        size="small"
                        onClick={(e) => setAnchor(e.currentTarget)}
                        sx={{
                            width: 28, height: 28,
                            bgcolor: open ? "primary.main" : "action.hover",
                            color: open ? "#fff" : "text.secondary",
                            transition: "all 0.18s ease",
                            "&:hover": { bgcolor: "primary.main", color: "#fff" },
                        }}
                    >
                        <InfoIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                </Tooltip>
                <Chip
                    label={t("listings.occupied")}
                    size="small"
                    sx={{
                        fontWeight: 700, fontSize: 11, textTransform: "uppercase",
                        letterSpacing: "0.5px", borderRadius: 1.5,
                        bgcolor: colors.error, color: "#fff",
                    }}
                />
            </Box>

            <Popover
                open={open}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1, p: 2.5, borderRadius: 3, minWidth: 240,
                        border: `1px solid ${colors.border}`,
                    },
                }}
            >
                <Typography variant="caption" color="text.secondary" fontWeight={700}
                            sx={{ textTransform: "uppercase", letterSpacing: "0.6px", display: "block", mb: 1.5 }}>
                    {label}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Avatar
                        src={resolveMediaUrl(renter.AvatarUrl)}
                        sx={{
                            width: 40, height: 40,
                            bgcolor: colors.errorAlpha15, color: colors.error,
                            fontSize: 14, fontWeight: 700,
                        }}
                    >
                        {initials}
                    </Avatar>
                    <Typography variant="body2" fontWeight={700}>
                        {renter.Name} {renter.Surname}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {renter.Email && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">{renter.Email}</Typography>
                        </Box>
                    )}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">{renter.Phone}</Typography>
                    </Box>
                </Box>

                <Box sx={{
                    mt: 2, pt: 1.5, borderTop: `1px solid ${colors.border}`,
                    display: "flex", alignItems: "center", gap: 0.5,
                }}>
                    <PersonIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                    <Typography variant="caption" color="text.disabled" fontWeight={600}>
                        {t("components.infoPanel.contact")}
                    </Typography>
                </Box>
            </Popover>
        </>
    );
};

// ── ApartmentInfoPanel ─────────────────────────────────────────────────────────
const ApartmentInfoPanel = ({ apartment, owner, renter, isAvailable, isOwner }: Props) => {
    const navigate = useNavigate();
    const { t }    = useTranslation();

    const intervalMap: Record<string, string> = {
        hour:  t("apartment.perHour"),
        day:   t("apartment.perDay"),
        month: t("apartment.perMonth"),
    };
    const intervalLabel = intervalMap[apartment.Interval] ?? apartment.Interval;
    const isOccupied    = apartment.Id_Renter !== null;

    return (
        <Paper
            elevation={1}
            sx={{
                p: { xs: 3, md: 3.5 },
                borderRadius: 3,
                border: `1px solid ${colors.border}`,
                bgcolor: "background.paper",
                // Umple celula gridului — inaltimea e dictata de gridAutoRows din parinte
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* ── Address ─────────────────────────────────────────────── */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 3 }}>
                <Box sx={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: 2,
                    background: gradients.primary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 12px ${colors.primaryAlpha25}`,
                }}>
                    <LocationOnIcon sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}
                                sx={{ textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: 0.3 }}>
                        {t("components.infoPanel.address")}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} lineHeight={1.25}>
                        {apartment.Address}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ── Pret + badge status ───────────────────────────────────
                Toate elementele pe aceeasi linie cu alignItems center.
                Typography-urile nested cauzeaza probleme de baseline —
                folosim doua componente separate cu aceeasi aliniere. */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}
                            sx={{ textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: 0.75 }}>
                    {t("components.infoPanel.price")}
                </Typography>

                {/* Un singur rand: pret + interval la stanga, badge la dreapta */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {/* Stanga: pret + moneda + interval */}
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                        <Typography variant="h4" fontWeight={900} color="primary.main" lineHeight={1}>
                            {apartment.Cost_per_interval}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>
                            {apartment.Currency}
                        </Typography>
                        <Typography variant="body1" color="text.disabled" fontWeight={400}>
                            /
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            {intervalLabel}
                        </Typography>
                    </Box>

                    {/* Dreapta: badge — ml auto il impinge la capat */}
                    <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                        {isOccupied && renter ? (
                            <RenterPopover renter={renter} label={t("apartment.renter")} />
                        ) : isOccupied ? (
                            <Chip label={t("listings.occupied")} size="small"
                                  sx={{
                                      fontWeight: 700, fontSize: 11, textTransform: "uppercase",
                                      letterSpacing: "0.5px", borderRadius: 1.5,
                                      bgcolor: colors.error, color: "#fff",
                                  }}
                            />
                        ) : (
                            <Chip label={t("listings.available")} size="small"
                                  sx={{
                                      fontWeight: 700, fontSize: 11, textTransform: "uppercase",
                                      letterSpacing: "0.5px", borderRadius: 1.5,
                                      bgcolor: colors.success, color: "#fff",
                                  }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* ── Owner compact row ────────────────────────────────────── */}
            {owner && (
                <Box sx={{ mb: 3 }}>
                    <OwnerRow user={owner} label={t("apartment.owner")} />
                </Box>
            )}

            {/* ── Rent Now button — impins in josul panelului ──────────── */}
            <Box sx={{ mt: "auto" }}>
                <Tooltip
                    title={isOwner ? t("apartment.ownApartment") : ""}
                    placement="top" arrow
                    disableHoverListener={!isOwner}
                    disableFocusListener={!isOwner}
                    disableTouchListener={!isOwner}
                >
                    <span style={{ display: "block", width: "100%" }}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={() => navigate(`/payments?apartmentId=${apartment.Id_Apartment}&interval=${apartment.Interval}`)}
                            disabled={!isAvailable}
                            sx={{
                                py: 1.6, borderRadius: 2,
                                fontWeight: 700, fontSize: 15,
                                textTransform: "none",
                                boxShadow: isAvailable ? `0 4px 14px ${colors.primaryAlpha25}` : "none",
                            }}
                        >
                            {isAvailable ? t("apartment.rentNow") : t("apartment.unavailable")}
                        </Button>
                    </span>
                </Tooltip>
                {isAvailable && (
                    <Typography variant="caption" color="text.secondary"
                                sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
                        {t("apartment.redirect")}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default ApartmentInfoPanel;