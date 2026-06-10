// components/apartmentDetail/RenterPopover.tsx
import { useState } from "react";
import { Box, Typography, Avatar, Chip, Divider, IconButton, Popover, Tooltip } from "@mui/material";
import { Phone as PhoneIcon, InfoOutlined as InfoIcon, PersonOutline as PersonIcon, EmailOutlined as EmailIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/gradients";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import type { UserContact } from "./OwnerRow";

interface Props {
    renter: UserContact;
    label:  string;
}

export default function RenterPopover({ renter, label }: Props) {
    const { t } = useTranslation();
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
    const open     = Boolean(anchor);
    const initials = `${renter.Name?.[0] ?? ""}${renter.Surname?.[0] ?? ""}`.toUpperCase();

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title={t("apartment.viewRenterDetails")} placement="top" arrow>
                    <IconButton
                        size="small"
                        onClick={e => setAnchor(e.currentTarget)}
                        sx={{
                            width: 28, height: 28,
                            bgcolor: open ? "primary.main" : "action.hover",
                            color:  open ? "#fff" : "text.secondary",
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
                    sx={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", borderRadius: 1.5, bgcolor: colors.error, color: "#fff" }}
                />
            </Box>

            <Popover
                open={open}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top",    horizontal: "left" }}
                PaperProps={{ elevation: 3, sx: { mt: 1, p: 2.5, borderRadius: 3, minWidth: 240, border: `1px solid ${colors.border}` } }}
            >
                <Typography variant="caption" color="text.secondary" fontWeight={700}
                            sx={{ textTransform: "uppercase", letterSpacing: "0.6px", display: "block", mb: 1.5 }}>
                    {label}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Avatar
                        src={resolveMediaUrl(renter.AvatarUrl)}
                        sx={{ width: 40, height: 40, bgcolor: colors.errorAlpha15, color: colors.error, fontSize: 14, fontWeight: 700 }}
                    >
                        {initials}
                    </Avatar>
                    <Typography variant="body2" fontWeight={700}>{renter.Name} {renter.Surname}</Typography>
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

                <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                    <Typography variant="caption" color="text.disabled" fontWeight={600}>
                        {t("components.infoPanel.contact")}
                    </Typography>
                </Box>
            </Popover>
        </>
    );
}
