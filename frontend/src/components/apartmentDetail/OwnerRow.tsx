// components/apartmentDetail/OwnerRow.tsx
import { Box, Typography, Avatar } from "@mui/material";
import { Phone as PhoneIcon } from "@mui/icons-material";
import { gradients } from "../../theme/gradients";
import { resolveMediaUrl } from "../../utils/mediaUrl";

export interface UserContact {
    Id_User:    number;
    Name:       string;
    Surname:    string;
    Email?:     string | null;
    Phone:      string;
    AvatarUrl?: string | null;
}

interface Props {
    user:  UserContact;
    label: string;
}

export default function OwnerRow({ user, label }: Props) {
    const initials = `${user.Name?.[0] ?? ""}${user.Surname?.[0] ?? ""}`.toUpperCase();

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
                src={resolveMediaUrl(user.AvatarUrl)}
                sx={{ width: 44, height: 44, background: gradients.primary, fontSize: 15, fontWeight: 700, flexShrink: 0 }}
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
}
