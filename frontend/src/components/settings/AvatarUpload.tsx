// components/settings/AvatarUpload.tsx
import { useRef, useState } from "react";
import { Avatar, Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";
import { uploadService } from "../../services/uploadService";
import { userService } from "../../services/userService";
import { useAuth } from "../../auth/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";

interface Props {
    userId:    number;
    avatarUrl: string | null | undefined;
}

export default function AvatarUpload({ userId, avatarUrl }: Props) {
    const { t }                             = useTranslation();
    const { updateCurrentUser }             = useAuth();
    const inputRef                          = useRef<HTMLInputElement>(null);
    const [preview, setPreview]             = useState<string | null>(null);
    const [uploading, setUploading]         = useState(false);
    const [error, setError]                 = useState<string | null>(null);

    const displaySrc = preview ?? resolveMediaUrl(avatarUrl);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local inainte de upload
        setPreview(URL.createObjectURL(file));
        setError(null);
        setUploading(true);

        try {
            const urls = await uploadService.images([file]);
            const newUrl = urls[0];

            await userService.updateAvatar(userId, newUrl);
            updateCurrentUser({ avatarUrl: newUrl });
        } catch {
            setError(t("settings.avatar.error"));
            setPreview(null);
        } finally {
            setUploading(false);
            // Reset input pentru a permite re-selectarea aceluiasi fisier
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Box sx={{ position: "relative" }}>
                <Avatar
                    src={displaySrc}
                    sx={{ width: 96, height: 96, fontSize: 36 }}
                />
                <Tooltip title={t("settings.avatar.change")}>
                    <IconButton
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        size="small"
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            bgcolor: "background.paper",
                            border: "2px solid",
                            borderColor: "divider",
                            "&:hover": { bgcolor: "action.hover" },
                        }}
                    >
                        {uploading
                            ? <CircularProgress size={16} />
                            : <PhotoCameraIcon fontSize="small" />
                        }
                    </IconButton>
                </Tooltip>
            </Box>

            {error && (
                <Typography variant="caption" color="error">{error}</Typography>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleFileChange}
            />
        </Box>
    );
}