// components/apartmentDetail/ReviewsTab.tsx
import { useState, useEffect } from "react";
import { Box, Typography, Rating } from "@mui/material";
import { Star as StarIcon }  from "@mui/icons-material";
import { useTranslation }    from "react-i18next";
import { colors }            from "../../theme/gradients";
import { reviewService }     from "../../services/reviewService";
import { paymentHistoryService } from "../../services/paymentHistoryService";
import { useAuth }           from "../../auth/AuthContext";
import type { ReviewApiDto } from "../../services/reviewService";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

const ReviewsTab = ({ reviews: initialReviews, apartmentId, ownerId }: {
    reviews:     ReviewApiDto[];
    apartmentId: number;
    ownerId:     number;
}) => {
    const { t }                            = useTranslation();
    const { currentUser, isAuthenticated } = useAuth();

    const [reviews,     setReviews]     = useState<ReviewApiDto[]>(initialReviews);
    const [canReview,   setCanReview]   = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        if (!currentUser) return;
        paymentHistoryService.hasPaid(apartmentId).then(setCanReview).catch(() => {});
        setHasReviewed(initialReviews.some(r => r.userId === currentUser.id));
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
            {/* Summary bar */}
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

            {/* Add-review form */}
            {isAuthenticated && canReview && !hasReviewed && (
                <ReviewForm apartmentId={apartmentId} onSubmitted={handleSubmitted} />
            )}

            {/* Review list or empty state */}
            {reviews.length === 0 ? (
                <Box sx={{ py: 7, textAlign: "center" }}>
                    <StarIcon sx={{ fontSize: 48, color: colors.primaryAlpha25, mb: 1.5 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
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
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ReviewsTab;
