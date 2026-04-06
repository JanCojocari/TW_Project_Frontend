// components/apartmentDetail/ReviewsTab.tsx
import { Box, Paper, Typography, Avatar } from "@mui/material";
import { Star as StarIcon }   from "@mui/icons-material";
import { useTranslation }     from "react-i18next";
import { gradients, colors }  from "../../theme/gradients.ts";
import type { ReviewApiDto }  from "../../services/reviewService.ts";

const ReviewCard = ({ review }: { review: ReviewApiDto }) => {
    const { i18n } = useTranslation();
    const initials = `U${review.userId}`;
    const date     = new Date(review.createdAt).toLocaleDateString(
        i18n.language === "en" ? "en-GB" : "ro-RO",
        { year: "numeric", month: "long" }
    );

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, transition: "all 0.2s ease", "&:hover": { borderColor: colors.primary, boxShadow: `0 4px 16px ${colors.primaryAlpha10}` } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ background: gradients.primary, fontWeight: 700, width: 42, height: 42 }}>{initials}</Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>User #{review.userId}</Typography>
                        <Typography variant="caption" color="text.secondary">{date}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: colors.primaryAlpha10, px: 1.5, py: 0.5, borderRadius: 2 }}>
                    <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">{review.rating}/10</Typography>
                </Box>
            </Box>
            {review.comment && (
                <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ mb: review.ownerResponse ? 2 : 0 }}>
                    "{review.comment}"
                </Typography>
            )}
            {review.ownerResponse && (
                <Box sx={{ mt: 2, p: 2, bgcolor: colors.primaryAlpha06, borderRadius: 2, borderLeft: `3px solid ${colors.primary}` }}>
                    <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: "block", mb: 0.5 }}>
                        Owner response
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{review.ownerResponse}</Typography>
                </Box>
            )}
        </Paper>
    );
};

const ReviewsTab = ({ reviews }: { reviews: ReviewApiDto[] }) => {
    const { t } = useTranslation();

    if (reviews.length === 0) return (
        <Box sx={{ py: 6, textAlign: "center" }}>
            <StarIcon sx={{ fontSize: 48, color: colors.primaryAlpha25, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">{t("components.reviews.noReviews")}</Typography>
        </Box>
    );

    const avgRating   = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const reviewCount = reviews.length;
    const reviewLabel = reviewCount === 1 ? t("components.reviews.review") : t("components.reviews.reviews");

    return (
        <Box>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Box sx={{ textAlign: "center", minWidth: 120 }}>
                        <Typography variant="h2" fontWeight={900} color="primary.main" lineHeight={1}>{avgRating.toFixed(1)}</Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>{t("components.reviews.outOf")}</Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.3, mt: 1 }}>
                            {[1,2,3,4,5].map(i => <StarIcon key={i} sx={{ fontSize: 16, color: i <= Math.round(avgRating / 2) ? "#F59E0B" : colors.primaryAlpha25 }} />)}
                        </Box>
                        <Typography variant="caption" color="text.secondary">{reviewCount} {reviewLabel}</Typography>
                    </Box>
                </Box>
            </Paper>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </Box>
        </Box>
    );
};

export default ReviewsTab;
