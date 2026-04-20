// components/apartmentDetail/ReviewsTab.tsx
import { useState } from "react";
import {
    Box, Paper, Typography, Avatar, Rating,
    TextField, Button, Alert, Collapse, IconButton
} from "@mui/material";
import { Star as StarIcon, EmojiEmotions as EmojiIcon } from "@mui/icons-material";
import { formatDate, formatDateShort, formatDateLong } from '../../utils/formatDate';
import { useTranslation }    from "react-i18next";
import { gradients, colors } from "../../theme/gradients.ts";
import { resolveMediaUrl }   from "../../utils/mediaUrl.ts";
import { reviewService }     from "../../services/reviewService.ts";
import { paymentHistoryService } from "../../services/paymentHistoryService.ts";
import { useAuth }           from "../../auth/AuthContext.tsx";
import type { ReviewApiDto } from "../../services/reviewService.ts";
import { useEffect } from "react";
import { useThemeMode } from "../../theme/ThemeContext";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";


// ── ReviewCard ────────────────────────────────────────────────────────────────

const ReviewCard = ({ review, isOwner, onResponseSubmitted }: {
    review: ReviewApiDto;
    isOwner: boolean;
    onResponseSubmitted: () => void;
}) => {
    const { t, i18n } = useTranslation();
    const [showForm, setShowForm]     = useState(false);
    const [response, setResponse]     = useState("");
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [showEmoji, setShowEmoji]   = useState(false);
    const { isDark }                  = useThemeMode();
    const stayDuration = review.stayStartDate && review.stayEndDate
        ? (() => {
            const start = new Date(review.stayStartDate);
            const end   = new Date(review.stayEndDate);
            const days  = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const startStr = formatDateShort(start);
            const endStr   = formatDateLong(end);
            return `${startStr} - ${endStr} (${days} ${days === 1 ? "zi" : "zile"})`;
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
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, transition: "all 0.2s ease", "&:hover": { borderColor: colors.primary, boxShadow: `0 4px 16px ${colors.primaryAlpha10}` } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        src={resolveMediaUrl(review.userAvatarUrl)}
                        sx={{ background: gradients.primary, fontWeight: 700, width: 42, height: 42 }}
                    >
                        {!review.userAvatarUrl && initials}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                            {review.userName ? `${review.userName} ${review.userSurname ?? ""}` : `User #${review.userId}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{date}</Typography>
                        {stayDuration && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                {stayDuration}
                            </Typography>)}
                    </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: colors.primaryAlpha10, px: 1.5, py: 0.5, borderRadius: 2 }}>
                    <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">{review.rating}/5</Typography>
                </Box>
            </Box>

            <Rating value={review.rating} max={5} readOnly size="small" sx={{ mb: 1 }} />

            {review.comment && (
                <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ mb: 2 }}>
                    "{review.comment}"
                </Typography>
            )}

            {/* Owner response existenta */}
            {review.ownerResponse && (
                <Box sx={{ mt: 2, p: 2, bgcolor: colors.primaryAlpha06, borderRadius: 2, borderLeft: `3px solid ${colors.primary}` }}>
                    <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: "block", mb: 0.5 }}>
                        {t("components.reviews.ownerResponseLabel")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{review.ownerResponse}</Typography>
                </Box>
            )}

            {/* Buton raspunde -- doar pentru owner, doar daca nu a raspuns deja */}
            {isOwner && !review.ownerResponse && (
                <Box sx={{ mt: 2 }}>
                    {!showForm ? (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setShowForm(true)}
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                            {t("components.reviews.replyButton")}
                        </Button>
                    ) : (
                        <Box>
                            <Box sx={{ position: "relative" }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder={t("components.reviews.replyPlaceholder")}
                                    value={response}
                                    onChange={e => setResponse(e.target.value)}
                                    sx={{ mb: 1.5 }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={() => setShowEmoji(prev => !prev)}
                                                sx={{ alignSelf: "flex-end", mb: 0.5 }}
                                            >
                                                <EmojiIcon sx={{ color: showEmoji ? "primary.main" : "text.secondary" }} />
                                            </IconButton>
                                        )
                                    }}
                                />
                                {showEmoji && (
                                    <Box sx={{ position: "absolute", zIndex: 100, mt: 0, right: 0, bottom: 60 }}>
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                                setResponse(prev => prev + emojiData.emoji);
                                                setShowEmoji(false);
                                            }}
                                            theme={isDark ? Theme.DARK : Theme.LIGHT}
                                            height={350}
                                            width={300}
                                            lazyLoadEmojis
                                        />
                                    </Box>
                                )}
                            </Box>
                            {error && <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>{error}</Alert>}
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSubmitResponse}
                                    disabled={loading || !response.trim()}
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    {loading ? t("components.reviews.submitting") : t("components.reviews.replySubmit")}
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => { setShowForm(false); setResponse(""); }}
                                    disabled={loading}
                                    sx={{ borderRadius: 2 }}
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
};

// ── ReviewForm ────────────────────────────────────────────────────────────────

const ReviewForm = ({ apartmentId, onSubmitted }: { apartmentId: number; onSubmitted: () => void }) => {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const [rating, setRating]         = useState<number | null>(null);
    const [comment, setComment]       = useState("");
    const [showEmoji, setShowEmoji]   = useState(false);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [success, setSuccess]       = useState(false);
    const { isDark }                  = useThemeMode();


    const handleEmoji = (emojiData: EmojiClickData) => {
        setComment(prev => prev + emojiData.emoji);
        setShowEmoji(false);
    };

    const handleSubmit = async () => {
        if (!rating) {
            setError(t("components.reviews.errorRating"));
            return;
        }
        if (!currentUser) return;

        setLoading(true);
        setError(null);

        try {
            await reviewService.create(currentUser.id, {
                apartmentId,
                rating,
                comment: comment.trim() || undefined,
            });
            setSuccess(true);
            setTimeout(() => {
                onSubmitted();
            }, 1500);
        } catch {
            setError(t("components.reviews.errorSubmit"));
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <Alert severity="success" sx={{ borderRadius: 3 }}>
            {t("components.reviews.successMessage")}
        </Alert>
    );

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.primary}`, mb: 3 }}>
            <Typography variant="h6" fontWeight={800} mb={2}>
                {t("components.reviews.formTitle")}
            </Typography>

            {/* Rating */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {t("components.reviews.ratingLabel")}
                </Typography>
                <Rating
                    value={rating}
                    onChange={(_, val) => setRating(val)}
                    max={5}
                    size="large"
                />
            </Box>

            {/* Comment + Emoji */}
            <Box sx={{ position: "relative", mb: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={t("components.reviews.placeholder")}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={() => setShowEmoji(prev => !prev)}
                                sx={{ alignSelf: "flex-end", mb: 0.5 }}
                            >
                                <EmojiIcon sx={{ color: showEmoji ? "primary.main" : "text.secondary" }} />
                            </IconButton>
                        )
                    }}
                />
                <Collapse in={showEmoji}>
                    <Box sx={{ position: "absolute", zIndex: 100, mt: 1, right: 0 }}>
                        <EmojiPicker
                            onEmojiClick={handleEmoji}
                            theme={isDark ? Theme.DARK : Theme.LIGHT}
                            height={350}
                            width={300}
                        />
                    </Box>
                </Collapse>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2.5, fontWeight: 700, px: 4 }}
            >
                {loading ? t("components.reviews.submitting") : t("components.reviews.submit")}
            </Button>
        </Paper>
    );
};

// ── ReviewsTab ────────────────────────────────────────────────────────────────

const ReviewsTab = ({ reviews: initialReviews, apartmentId, ownerId }: {
    reviews: ReviewApiDto[];
    apartmentId: number;
    ownerId: number;
}) => {    const { t }           = useTranslation();
    const { currentUser, isAuthenticated } = useAuth();

    const [reviews, setReviews]       = useState<ReviewApiDto[]>(initialReviews);
    const [canReview, setCanReview]   = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        // verifica daca userul a platit pentru acest apartament
        paymentHistoryService.hasPaid(apartmentId)
            .then(paid => setCanReview(paid))
            .catch(() => {});

        // verifica daca userul a lasat deja review
        const alreadyReviewed = initialReviews.some(r => r.userId === currentUser.id);
        setHasReviewed(alreadyReviewed);
    }, [currentUser, apartmentId, initialReviews]);

    const handleSubmitted = () => {
        // reincarca review-urile dupa submit
        reviewService.getByApartment(apartmentId)
            .then(setReviews)
            .catch(() => {});
        setHasReviewed(true);
        setCanReview(false);
    };

    const avgRating   = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const reviewCount = reviews.length;
    const reviewLabel = reviewCount === 1 ? t("components.reviews.review") : t("components.reviews.reviews");

    return (
        <Box>
            {/* Summary */}
            {reviews.length > 0 && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Box sx={{ textAlign: "center", minWidth: 120 }}>
                            <Typography variant="h2" fontWeight={900} color="primary.main" lineHeight={1}>
                                {avgRating.toFixed(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                                {t("components.reviews.outOf")}
                            </Typography>
                            <Rating value={avgRating} max={5} readOnly precision={0.5} sx={{ mt: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                                {reviewCount} {reviewLabel}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Formular conditionat */}
            {isAuthenticated && canReview && !hasReviewed && (
                <ReviewForm apartmentId={apartmentId} onSubmitted={handleSubmitted} />
            )}

            {/* Review-urile existente */}
            {reviews.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                    <StarIcon sx={{ fontSize: 48, color: colors.primaryAlpha25, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        {t("components.reviews.noReviews")}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {reviews.map(r => (
                        <ReviewCard
                            key={r.id}
                            review={r}
                            isOwner={currentUser?.id === ownerId}
                            onResponseSubmitted={handleSubmitted}
                        />
                    ))}                </Box>
            )}
        </Box>
    );
};

export default ReviewsTab;