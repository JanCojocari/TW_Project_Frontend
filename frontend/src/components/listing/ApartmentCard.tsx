// components/listing/ApartmentCard.tsx
import { Box, Card, Typography, Button, IconButton } from "@mui/material";
import {
    LocationOn     as LocationOnIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Favorite       as FavoriteIcon,
    Edit           as EditIcon,
    Delete         as DeleteIcon,
    Star           as StarIcon,
    StarHalf       as StarHalfIcon,
    StarBorder     as StarBorderIcon,
    TrendingUp     as TrendingUpIcon,
} from "@mui/icons-material";
import { memo }           from "react";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Apartment } from "../../types/apartment.types.ts";
import { paths }          from "../../app/paths.ts";
import { colors }         from "../../theme/gradients.ts";

interface Props {
    apartment:      Apartment;
    favorites:      number[];
    toggleFavorite: (id: number) => void;
    getUserName:    (id: number) => string;
    getStatus:      (apartment: Apartment) => string;
    isOwner?:       boolean;
    onEdit?:        (apartment: Apartment) => void;
    onDelete?:      (apartment: Apartment) => void;
    viewsLast24h?:  number;
}

function getChipStyle(apartment: Apartment): { bg: string; dot: string } {
    if (apartment.status === "pending")  return { bg: "rgba(180,83,9,0.92)",  dot: "#fcd34d" };
    if (apartment.status === "declined") return { bg: "rgba(220,38,38,0.92)", dot: "#fca5a5" };
    if (apartment.Id_Renter !== null)    return { bg: "rgba(220,38,38,0.92)", dot: "#fca5a5" };
    return                                      { bg: "rgba(22,163,74,0.92)",  dot: "#86efac" };
}

function computeAverageRating(apartment: Apartment): { avg: number; count: number } | null {
    // avgRating si reviewCount vin direct din ApartmentDto (backend)
    if (apartment.reviewCount > 0 && apartment.avgRating > 0)
        return { avg: Math.round(apartment.avgRating * 10) / 10, count: apartment.reviewCount };
    // fallback: calculeaza din reviews daca sunt incarcate
    if (!apartment.reviews?.length) return null;
    const valid = apartment.reviews.filter(r => typeof r.rating === "number");
    if (valid.length === 0) return null;
    const sum = valid.reduce((acc, r) => acc + r.rating, 0);
    return { avg: Math.round((sum / valid.length) * 10) / 10, count: valid.length };
}

function StarRating({ avg }: { avg: number }) {
    return <>
        {[1,2,3,4,5].map(i =>
            avg >= i
                ? <StarIcon      key={i} sx={{ fontSize: 13, color: "#f59e0b" }} />
                : avg >= i - 0.5
                    ? <StarHalfIcon  key={i} sx={{ fontSize: 13, color: "#f59e0b" }} />
                    : <StarBorderIcon key={i} sx={{ fontSize: 13, color: "#f59e0b" }} />
        )}
    </>;
}

const ApartmentCard = ({
                           apartment, favorites, toggleFavorite, getUserName,
                           getStatus, isOwner = false, onEdit, onDelete, viewsLast24h,
                       }: Props) => {
    const navigate    = useNavigate();
    const { t, i18n } = useTranslation();
    const isFav       = favorites.includes(apartment.Id_Apartment);
    const isOccupied  = apartment.Id_Renter !== null;
    const canViewDetails = apartment.status === "approved" || isOwner;

    const intervalLabelMap: Record<string, string> = i18n.language === "en"
        ? { hour: "/ hr", day: "/ day", month: "/ mo" }
        : { hour: "/ ora", day: "/ zi", month: "/ luna" };
    const intervalSuffix = intervalLabelMap[apartment.Interval] ?? "/ mo";

    const cardImage  = apartment.image_urls?.[0] ?? apartment.image_url;
    const chip       = getChipStyle(apartment);
    const ratingData = computeAverageRating(apartment);

    return (
        <Card sx={{
            borderRadius: "32px",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${colors.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
            cursor: "pointer",
            // bgcolor vine din tema
            "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(78,122,166,0.18)",
                "& .card-img": { transform: "scale(1.06)" },
                "& .card-overlay": { opacity: 1 },
            },
        }}>

            {/* ── Imagine — padding-top 58% = ~170px pe coloana de 290px ── */}
            <Box sx={{ position: "relative", paddingTop: "58%", overflow: "hidden", bgcolor: "background.default", flexShrink: 0, borderRadius: "32px 32px 0 0" }}>
                <Box
                    className="card-img"
                    component="img"
                    src={cardImage}
                    alt={apartment.Address}
                    sx={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.165,0.84,0.44,1)",
                    }}
                />

                {/* Gradient jos */}
                <Box className="card-overlay" sx={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(10,20,40,0.55) 0%, rgba(10,20,40,0.08) 45%, transparent 100%)",
                    opacity: 0.65, transition: "opacity 0.3s ease", pointerEvents: "none",
                }} />

                {/* Status badge — stanga sus */}
                <Box sx={{
                    position: "absolute", top: 12, left: 12,
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    px: 1.2, py: 0.5, borderRadius: "20px",
                    bgcolor: chip.bg, backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: chip.dot, flexShrink: 0 }} />
                    <Typography sx={{ color: "#fff", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.7px", lineHeight: 1 }}>
                        {getStatus(apartment)}
                    </Typography>
                </Box>

                {/* Favorite — dreapta sus */}
                <IconButton
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(apartment.Id_Apartment); }}
                    size="small"
                    sx={{
                        position: "absolute", top: 10, right: 10,
                        width: 36, height: 36,
                        bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                        color: isFav ? "#ef4444" : "#9ca3af",
                        border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        "&:hover": { transform: "scale(1.15)", color: "#ef4444", bgcolor: "rgba(255,255,255,0.98)" },
                    }}
                >
                    {isFav ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                </IconButton>

                {/* Edit + Delete — dreapta jos, doar owner */}
                {isOwner && (
                    <Box sx={{ position: "absolute", bottom: 10, right: 10, display: "flex", gap: "6px" }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit?.(apartment); }}
                                    sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", color: colors.primary, border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#fff", color: colors.primaryDark, transform: "scale(1.12)" } }}>
                            <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete?.(apartment); }}
                                    sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", color: "#ef4444", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#fff", color: "#dc2626", transform: "scale(1.12)" } }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Box>
                )}

                {/* Rating pill — stanga jos pe imagine */}
                {ratingData && (
                    <Box sx={{
                        position: "absolute", bottom: 12, left: 12,
                        display: "flex", alignItems: "center", gap: "4px",
                        px: 1, py: 0.5, borderRadius: "20px",
                        bgcolor: "background.paper", backdropFilter: "blur(8px)",
                        border: `1px solid ${colors.border}`, boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}>
                        <StarIcon sx={{ fontSize: 12, color: "#f59e0b" }} />
                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "text.primary", lineHeight: 1 }}>
                            {ratingData.avg}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "text.secondary", lineHeight: 1 }}>
                            ({ratingData.count})
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ── Body — padding ca in referinta ── */}
            <Box sx={{ p: "14px 16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "9px" }}>

                {/* Adresa */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                    <LocationOnIcon sx={{ fontSize: 15, color: "primary.main", mt: "2px", flexShrink: 0 }} />
                    <Typography sx={{
                        fontSize: "14px", fontWeight: 700, color: "text.primary",
                        lineHeight: 1.35, letterSpacing: "-0.01em",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {apartment.Address}
                    </Typography>
                </Box>

                {/* Descriere */}
                {apartment.additionalInfo?.description && (
                    <Typography sx={{
                        fontSize: "12px", color: "text.secondary", lineHeight: 1.55,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {apartment.additionalInfo.description}
                    </Typography>
                )}

                {/* Meta: rating text + vizualizari */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    {ratingData ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            <StarRating avg={ratingData.avg} />
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary", ml: "2px" }}>
                                {ratingData.avg}
                            </Typography>
                            <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
                                &middot; {ratingData.count} {i18n.language === "en" ? "reviews" : "recenzii"}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography sx={{ fontSize: "11px", color: "text.disabled", fontStyle: "italic" }}>
                            {i18n.language === "en" ? "No reviews yet" : "Fara recenzii"}
                        </Typography>
                    )}

                    {!!viewsLast24h && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                            <TrendingUpIcon sx={{ fontSize: 13, color: colors.secondary }} />
                            <Typography sx={{ fontSize: "11px", fontWeight: 600, color: colors.secondary, whiteSpace: "nowrap" }}>
                                {viewsLast24h} {i18n.language === "en" ? "today" : "azi"}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Divider */}
                <Box sx={{ height: "1px", bgcolor: colors.border }} />

                {/* Pret + buton */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mt: "auto" }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: "3px", lineHeight: 1 }}>
                            <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "text.primary", letterSpacing: "-0.03em", lineHeight: 1 }}>
                                {apartment.Cost_per_interval.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "primary.main", lineHeight: 1 }}>
                                {apartment.Currency}
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 500, mt: "2px" }}>
                            {intervalSuffix}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        disabled={!canViewDetails}
                        onClick={(e) => { e.stopPropagation(); navigate(paths.apartmentDetail(apartment.Id_Apartment)); }}
                        disableElevation
                        sx={{
                            px: 2.2, py: 0.9, borderRadius: "10px",
                            fontWeight: 700, fontSize: "13px", textTransform: "none",
                            minWidth: 0, whiteSpace: "nowrap",
                            "&:hover": canViewDetails ? { boxShadow: "0 6px 18px rgba(78,122,166,0.38)", transform: "translateY(-1px)" } : {},
                            "&:active": { transform: "translateY(0)" },
                        }}
                    >
                        {isOccupied ? t("listings.occupied") : t("listings.details")}
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default memo(ApartmentCard);