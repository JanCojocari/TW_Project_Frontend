// components/apartmentDetail/ReviewForm.tsx
import { useState } from "react";
import {
    Box, Paper, Typography, Rating,
    TextField, Button, Alert, Collapse, IconButton,
} from "@mui/material";
import { EmojiEmotions as EmojiIcon } from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import { colors }            from "../../theme/gradients";
import { reviewService }     from "../../services/reviewService";
import { pushAdminQueueNotif } from "../../utils/adminNotifHelper";
import { useAuth }           from "../../auth/AuthContext";
import { useThemeMode }      from "../../theme/ThemeContext";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";

interface Props {
    apartmentId: number;
    onSubmitted: () => void;
}

export default function ReviewForm({ apartmentId, onSubmitted }: Props) {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const { isDark }      = useThemeMode();

    const [rating,    setRating]    = useState<number | null>(null);
    const [comment,   setComment]   = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState<string | null>(null);
    const [success,   setSuccess]   = useState(false);

    const handleEmoji = (emojiData: EmojiClickData) => {
        setComment(p => p + emojiData.emoji);
        setShowEmoji(false);
    };

    const handleSubmit = async () => {
        if (!rating) { setError(t("components.reviews.errorRating")); return; }
        if (!currentUser) return;
        setLoading(true);
        setError(null);
        try {
            await reviewService.create(currentUser.id, { apartmentId, rating, comment: comment.trim() || undefined });
            setSuccess(true);
            pushAdminQueueNotif("admin_new_review", "Recenzie noua adaugata pe platforma.");
            setTimeout(() => { onSubmitted(); }, 1500);
        } catch {
            setError(t("components.reviews.errorSubmit"));
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <Alert severity="success" sx={{ borderRadius: "12px", mb: 3 }}>
            {t("components.reviews.successMessage")}
        </Alert>
    );

    return (
        <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: "14px", mb: 3, border: `1px solid ${colors.primary}`, bgcolor: "background.paper" }}
        >
            <Typography variant="subtitle1" fontWeight={800} mb={2.5}>
                {t("components.reviews.formTitle")}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}
                            sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {t("components.reviews.ratingLabel")}
                </Typography>
                <Rating value={rating} onChange={(_, val) => setRating(val)} max={5} size="large" />
            </Box>

            <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                    fullWidth multiline rows={3}
                    placeholder={t("components.reviews.placeholder")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    InputProps={{
                        endAdornment: (
                            <IconButton size="small" onClick={() => setShowEmoji(p => !p)} sx={{ alignSelf: "flex-end", mb: 0.5 }}>
                                <EmojiIcon sx={{ fontSize: 18, color: showEmoji ? "primary.main" : "text.secondary" }} />
                            </IconButton>
                        ),
                    }}
                />
                <Collapse in={showEmoji}>
                    <Box sx={{ position: "absolute", zIndex: 100, mt: 1, right: 0 }}>
                        <EmojiPicker onEmojiClick={handleEmoji} theme={isDark ? Theme.DARK : Theme.LIGHT} height={340} width={290} />
                    </Box>
                </Collapse>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: "10px", fontWeight: 700, px: 4, textTransform: "none" }}
            >
                {loading ? t("components.reviews.submitting") : t("components.reviews.submit")}
            </Button>
        </Paper>
    );
}
