// components/apartmentDetail/ReviewCard.tsx
import { useState } from "react";
import {
    Box, Paper, Typography, Avatar, Rating,
    TextField, Button, Alert, IconButton,
} from "@mui/material";
import { Star as StarIcon, EmojiEmotions as EmojiIcon, ReplyOutlined as ReplyIcon } from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../../theme/gradients";
import { resolveMediaUrl }   from "../../utils/mediaUrl";
import { formatDate, formatDateShort, formatDateLong } from "../../utils/formatDate";
import { reviewService }     from "../../services/reviewService";
import { useThemeMode }      from "../../theme/ThemeContext";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import type { ReviewApiDto } from "../../services/reviewService";

interface Props {
    review:              ReviewApiDto;
    isOwner:             boolean;
    onResponseSubmitted: () => void;
}

export default function ReviewCard({ review, isOwner, onResponseSubmitted }: Props) {
    const { t }      = useTranslation();
    const { isDark } = useThemeMode();

    const [showForm,  setShowForm]  = useState(false);
    const [response,  setResponse]  = useState("");
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState<string | null>(null);
    const [showEmoji, setShowEmoji] = useState(false);

    const stayDuration = review.stayStartDate && review.stayEndDate
        ? (() => {
            const start = new Date(review.stayStartDate);
            const end   = new Date(review.stayEndDate);
            const days  = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return `${formatDateShort(start)} – ${formatDateLong(end)} · ${days} ${days === 1 ? "zi" : "zile"}`;
        })()
        : null;

    const initials = review.userName
        ? `${review.userName[0]}${review.userSurname?.[0] ?? ""}`
        : `U${review.userId}`;

    const handleSubmitResponse = async () => {
        if (!response.trim()) return;
        setLoading(true);
        setError(null);
        try {
            await reviewService.addOwnerResponse(review.id, response.trim());
            onResponseSubmitted();
            setShowForm(false);
        } catch {
            setError(t("components.reviews.errorSubmit"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3, borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                transition: "border-color 0.18s ease, box-shadow 0.18s ease",
                "&:hover": {
                    borderColor: colors.primary,
                    boxShadow: `0 4px 16px ${colors.primaryAlpha10}`,
                },
            }}
        >
            {/* Header: avatar + name + date + rating */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        src={resolveMediaUrl(review.userAvatarUrl)}
                        sx={{ background: gradients.primary, fontWeight: 700, width: 42, height: 42, fontSize: 15 }}
                    >
                        {!review.userAvatarUrl && initials}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                            {review.userName ? `${review.userName} ${review.userSurname ?? ""}` : `User #${review.userId}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(review.createdAt)}</Typography>
                        {stayDuration && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.1 }}>
                                {stayDuration}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box sx={{
                    display: "flex", alignItems: "center", gap: 0.4,
                    bgcolor: colors.primaryAlpha10, px: 1.4, py: 0.5, borderRadius: "8px",
                }}>
                    <StarIcon sx={{ fontSize: 15, color: "#F59E0B" }} />
                    <Typography variant="caption" fontWeight={800} color="primary.main">
                        {review.rating}/5
                    </Typography>
                </Box>
            </Box>

            <Rating value={review.rating} max={5} readOnly size="small" sx={{ mb: 1.5 }} />

            {review.comment && (
                <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                    {review.comment}
                </Typography>
            )}

            {/* Owner response */}
            {review.ownerResponse && (
                <Box sx={{
                    mt: 2.5, ml: 3, p: 2, borderRadius: "10px",
                    bgcolor: colors.primaryAlpha06,
                    borderLeft: `3px solid ${colors.primary}`,
                    display: "flex", gap: 1.5, alignItems: "flex-start",
                }}>
                    <ReplyIcon sx={{ fontSize: 16, color: "primary.main", mt: 0.2, flexShrink: 0 }} />
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: "block", mb: 0.4 }}>
                            {t("components.reviews.ownerResponseLabel")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
                            {review.ownerResponse}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Reply form — owner only */}
            {isOwner && !review.ownerResponse && (
                <Box sx={{ mt: 2 }}>
                    {!showForm ? (
                        <Button
                            size="small" variant="text" startIcon={<ReplyIcon />}
                            onClick={() => setShowForm(true)}
                            sx={{ borderRadius: "8px", fontWeight: 600, color: "text.secondary", textTransform: "none" }}
                        >
                            {t("components.reviews.replyButton")}
                        </Button>
                    ) : (
                        <Box sx={{ mt: 1 }}>
                            <Box sx={{ position: "relative" }}>
                                <TextField
                                    fullWidth multiline rows={2}
                                    placeholder={t("components.reviews.replyPlaceholder")}
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    size="small"
                                    sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton size="small" onClick={() => setShowEmoji(p => !p)} sx={{ alignSelf: "flex-end", mb: 0.5 }}>
                                                <EmojiIcon sx={{ fontSize: 18, color: showEmoji ? "primary.main" : "text.secondary" }} />
                                            </IconButton>
                                        ),
                                    }}
                                />
                                {showEmoji && (
                                    <Box sx={{ position: "absolute", zIndex: 100, right: 0, bottom: 52 }}>
                                        <EmojiPicker
                                            onEmojiClick={(d: EmojiClickData) => { setResponse(p => p + d.emoji); setShowEmoji(false); }}
                                            theme={isDark ? Theme.DARK : Theme.LIGHT}
                                            height={340} width={290} lazyLoadEmojis
                                        />
                                    </Box>
                                )}
                            </Box>
                            {error && <Alert severity="error" sx={{ mb: 1, borderRadius: "10px" }}>{error}</Alert>}
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained" size="small"
                                    onClick={handleSubmitResponse}
                                    disabled={loading || !response.trim()}
                                    sx={{ borderRadius: "8px", fontWeight: 700, textTransform: "none" }}
                                >
                                    {loading ? t("components.reviews.submitting") : t("components.reviews.replySubmit")}
                                </Button>
                                <Button
                                    variant="text" size="small"
                                    onClick={() => { setShowForm(false); setResponse(""); }}
                                    disabled={loading}
                                    sx={{ borderRadius: "8px", textTransform: "none" }}
                                >
                                    {t("components.reviews.replyCancel")}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
}
