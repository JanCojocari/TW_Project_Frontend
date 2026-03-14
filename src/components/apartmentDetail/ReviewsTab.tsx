import { Box, Paper, Typography, LinearProgress, Avatar } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import { gradients, colors } from "../../theme/gradients.ts";
import type { Review } from "../../types/apartment.types";

const ratingCategories: { key: keyof Review["ratings"]; label: string }[] = [
    { key: "cleanliness",   label: "Curățenie" },
    { key: "location",      label: "Locație" },
    { key: "valueForMoney", label: "Raport calitate-preț" },
    { key: "comfort",       label: "Confort" },
    { key: "facilities",    label: "Facilități" },
    { key: "communication", label: "Comunicare" },
];

const RatingBar = ({ label, value }: { label: string; value: number }) => (
    <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
            <Typography variant="body2" fontWeight={700} color="primary.main">{value.toFixed(1)}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={value * 10} sx={{ height: 6, borderRadius: 3, bgcolor: colors.primaryAlpha10, "& .MuiLinearProgress-bar": { background: gradients.primary, borderRadius: 3 } }} />
    </Box>
);

const ReviewCard = ({ review }: { review: Review }) => {
    const initials = review.renterName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const date = new Date(review.createdAt).toLocaleDateString("ro-RO", { year: "numeric", month: "long" });
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: `1px solid ${colors.border}`, transition: "all 0.2s ease", "&:hover": { borderColor: colors.primary, boxShadow: `0 4px 16px ${colors.primaryAlpha10}` } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ background: gradients.primary, fontWeight: 700, width: 42, height: 42 }}>{initials}</Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{review.renterName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {date}{review.stayDuration ? ` · ${review.stayDuration} ${review.stayDuration === 1 ? "zi" : "zile"}` : ""}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: colors.primaryAlpha10, px: 1.5, py: 0.5, borderRadius: 2 }}>
                    <StarIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">{review.ratings.overall.toFixed(1)}</Typography>
                </Box>
            </Box>
            {review.comment && <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ mb: review.ownerResponse ? 2 : 0 }}>"{review.comment}"</Typography>}
            {review.ownerResponse && (
                <Box sx={{ mt: 2, p: 2, bgcolor: colors.primaryAlpha06, borderRadius: 2, borderLeft: `3px solid ${colors.primary}` }}>
                    <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: "block", mb: 0.5 }}>Răspuns proprietar</Typography>
                    <Typography variant="body2" color="text.secondary">{review.ownerResponse}</Typography>
                </Box>
            )}
        </Paper>
    );
};

const ReviewsTab = ({ reviews }: { reviews: Review[] }) => {
    if (reviews.length === 0) return (
        <Box sx={{ py: 6, textAlign: "center" }}>
            <StarIcon sx={{ fontSize: 48, color: colors.primaryAlpha25, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Nu există recenzii încă.</Typography>
        </Box>
    );
    const avgOverall = reviews.reduce((s, r) => s + r.ratings.overall, 0) / reviews.length;
    const avgByCategory = ratingCategories.map(cat => ({ ...cat, avg: reviews.reduce((s, r) => s + r.ratings[cat.key], 0) / reviews.length }));
    return (
        <Box>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, gap: 3 }}>
                    <Box sx={{ textAlign: "center", minWidth: 120 }}>
                        <Typography variant="h2" fontWeight={900} color="primary.main" lineHeight={1}>{avgOverall.toFixed(1)}</Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>din 10</Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.3, mt: 1 }}>
                            {[1,2,3,4,5].map(i => <StarIcon key={i} sx={{ fontSize: 16, color: i <= Math.round(avgOverall / 2) ? "#F59E0B" : colors.primaryAlpha25 }} />)}
                        </Box>
                        <Typography variant="caption" color="text.secondary">{reviews.length} {reviews.length === 1 ? "recenzie" : "recenzii"}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {avgByCategory.map(cat => <RatingBar key={cat.key} label={cat.label} value={cat.avg} />)}
                    </Box>
                </Box>
            </Paper>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {reviews.map(r => <ReviewCard key={r.Id_Review} review={r} />)}
            </Box>
        </Box>
    );
};

export default ReviewsTab;