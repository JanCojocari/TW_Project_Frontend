// components/apartmentDetail/ReviewsTab.tsx
import { useState, useEffect } from "react";
import {
    Box, Paper, Typography, Avatar, Rating,
    TextField, Button, Alert, Collapse, IconButton, Divider,
} from "@mui/material";
import { Star as StarIcon, EmojiEmotions as EmojiIcon, ReplyOutlined as ReplyIcon } from "@mui/icons-material";
import { formatDate, formatDateShort, formatDateLong } from "../../utils/formatDate";
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";
import { resolveMediaUrl }   from "../../utils/mediaUrl.ts";
import { reviewService }     from "../../services/reviewService.ts";
import { pushAdminQueueNotif } from "../../utils/adminNotifHelper.ts";
import { paymentHistoryService } from "../../services/paymentHistoryService.ts";
import { useAuth }           from "../../auth/AuthContext.tsx";
import type { ReviewApiDto } from "../../services/reviewService.ts";
import { useThemeMode }      from "../../theme/ThemeContext";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";

// ── ReviewCard ─────────────────────────────────────────────────────────────────
const ReviewCard = ({ review, isOwner, onResponseSubmitted }: {
    review: ReviewApiDto;
    isOwner: boolean;
    onResponseSubmitted: () => void;
}) => {
    const { t, i18n } = useTranslation();
    const [showForm, setShowForm]   = useState(false);
    const [response, setResponse]   = useState("");
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState<string | null>(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const { isDark }                = useThemeMode();

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
    const date = formatDate(review.createdAt);

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
            {/* ── Header: avatar + name + date + rating ─── */}
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
                        <Typography variant="caption" color="text.secondary">{date}</Typography>
                        {stayDuration && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.1 }}>
                                {stayDuration}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Rating pill */}
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

            {/* ── Owner response — indented reply style ─── */}
            {review.ownerResponse && (
                <Box sx={{
                    mt: 2.5, ml: 3,
                    p: 2, borderRadius: "10px",
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

            {/* ── Reply form — owner only ─────────────────── */}
            {isOwner && !review.ownerResponse && (
                <Box sx={{ mt: 2 }}>
                    {!showForm ? (
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<ReplyIcon />}
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
                                            <IconButton size="small" onClick={() => setShowEmoji((p) => !p)} sx={{ alignSelf: "flex-end", mb: 0.5 }}>
                                                <EmojiIcon sx={{ fontSize: 18, color: showEmoji ? "primary.main" : "text.secondary" }} />
                                            </IconButton>
                                        ),
                                    }}
                                />
                                {showEmoji && (
                                    <Box sx={{ position: "absolute", zIndex: 100, right: 0, bottom: 52 }}>
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => { setResponse((p) => p + emojiData.emoji); setShowEmoji(false); }}
                                            theme={isDark ? Theme.DARK : Theme.LIGHT}
                                            height={340} width={290} lazyLoadEmojis
                                        />
                                    </Box>
                                )}
                            </Box>
                            {error && <Alert severity="error" sx={{ mb: 1, borderRadius: "10px" }}>{error}</Alert>}
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button variant="contained" size="small" onClick={handleSubmitResponse}
                                        disabled={loading || !response.trim()}
                                        sx={{ borderRadius: "8px", fontWeight: 700, textTransform: "none" }}>
                                    {loading ? t("components.reviews.submitting") : t("components.reviews.replySubmit")}
                                </Button>
                                <Button variant="text" size="small"
                                        onClick={() => { setShowForm(false); setResponse(""); }}
                                        disabled={loading}
                                        sx={{ borderRadius: "8px", textTransform: "none" }}>
                                    {t("components.reviews.replyCancel")}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
};

// ── ReviewForm ─────────────────────────────────────────────────────────────────
const ReviewForm = ({ apartmentId, onSubmitted }: { apartmentId: number; onSubmitted: () => void }) => {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const { isDark }      = useThemeMode();

    const [rating, setRating]       = useState<number | null>(null);
    const [comment, setComment]     = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState<string | null>(null);
    const [success, setSuccess]     = useState(false);

    const handleEmoji = (emojiData: EmojiClickData) => {
        setComment((p) => p + emojiData.emoji);
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
            pushAdminQueueNotif("admin_new_review", `Recenzie noua adaugata pe platforma.`);
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
            sx={{
                p: 3, borderRadius: "14px", mb: 3,
                border: `1px solid ${colors.primary}`,
                bgcolor: "background.paper",
            }}
        >
            <Typography variant="subtitle1" fontWeight={800} mb={2.5}>
                {t("components.reviews.formTitle")}
            </Typography>

            {/* Rating stars */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}
                            sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {t("components.reviews.ratingLabel")}
                </Typography>
                <Rating value={rating} onChange={(_, val) => setRating(val)} max={5} size="large" />
            </Box>

            {/* Comment + emoji */}
            <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                    fullWidth multiline rows={3}
                    placeholder={t("components.reviews.placeholder")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    InputProps={{
                        endAdornment: (
                            <IconButton size="small" onClick={() => setShowEmoji((p) => !p)} sx={{ alignSelf: "flex-end", mb: 0.5 }}>
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
};

// ── ReviewsTab ─────────────────────────────────────────────────────────────────
const ReviewsTab = ({ reviews: initialReviews, apartmentId, ownerId }: {
    reviews: ReviewApiDto[];
    apartmentId: number;
    ownerId: number;
}) => {
    const { t }                            = useTranslation();
    const { currentUser, isAuthenticated } = useAuth();

    const [reviews, setReviews]           = useState<ReviewApiDto[]>(initialReviews);
    const [canReview, setCanReview]       = useState(false);
    const [hasReviewed, setHasReviewed]   = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        paymentHistoryService.hasPaid(apartmentId).then(setCanReview).catch(() => {});
        setHasReviewed(initialReviews.some((r) => r.userId === currentUser.id));
    }, [currentUser, apartmentId, initialReviews]);

    const handleSubmitted = () => {
        reviewService.getByApartment(apartmentId).then(setReviews).catch(() => {});
        setHasReviewed(true);
        setCanReview(false);
    };

    const avgRating   = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const reviewCount = reviews.length;
    const reviewLabel = reviewCount === 1 ? t("components.reviews.review") : t("components.reviews.reviews");

    return (
        <Box>
            {/* ── Summary bar ─────────────────────────────── */}
            {reviews.length > 0 && (
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 3,
                    p: 2.5, borderRadius: "14px", mb: 3,
                    border: `1px solid ${colors.border}`,
                    bgcolor: "background.paper",
                }}>
                    <Box sx={{ textAlign: "center", minWidth: 80 }}>
                        <Typography variant="h3" fontWeight={900} color="primary.main" lineHeight={1}>
                            {avgRating.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {t("components.reviews.outOf")}
                        </Typography>
                    </Box>
                    <Box>
                        <Rating value={avgRating} max={5} readOnly precision={0.5} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            {reviewCount} {reviewLabel}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* ── Add-review form ─────────────────────────── */}
            {isAuthenticated && canReview && !hasReviewed && (
                <ReviewForm apartmentId={apartmentId} onSubmitted={handleSubmitted} />
            )}

            {/* ── Review list or empty state ──────────────── */}
            {reviews.length === 0 ? (
                <Box sx={{ py: 7, textAlign: "center" }}>
                    <StarIcon sx={{ fontSize: 48, color: colors.primaryAlpha25, mb: 1.5 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        {t("components.reviews.noReviews")}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {reviews.map((r) => (
                        <ReviewCard
                            key={r.id}
                            review={r}
                            isOwner={currentUser?.id === ownerId}
                            onResponseSubmitted={handleSubmitted}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ReviewsTab;