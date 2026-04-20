// components/dashboard/PreviousStaysTab.tsx
import { useEffect, useState }  from "react";
import { Box, Typography, Button, CircularProgress, Alert, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon    from "@mui/icons-material/LocationOn";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useTranslation }    from "react-i18next";
import { useNavigate }       from "react-router-dom";
import { useAuth }           from "../../auth/AuthContext";
import { apartmentService }  from "../../services/apartmentService";
import type { Apartment }    from "../../types/apartment.types";
import { formatDate }        from "../../utils/formatDate";
import { colors, gradients } from "../../theme/gradients";
import axiosInstance         from "../../api/axiosInstance";
import { paths }             from "../../app/paths";

/* ─── types ───────────────────────────────────────────────────────────── */
interface RenterPayment {
    id: number; apartmentId: number; renterId: number; ownerId: number;
    totalCost: number; currency: number; createdAt: string;
    startDate: string | null; endDate: string | null; invoiceUrl: string | null;
}
interface StayEntry { apartment: Apartment; startDate: Date; endDate: Date }

async function fetchRenterPayments(renterId: number): Promise<RenterPayment[]> {
    return axiosInstance.get<RenterPayment[]>(`/payments/renter/${renterId}`).then(r => r.data);
}

function nightsCount(start: Date, end: Date): number {
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

/* ─── DateOverlay — inlocuieste progress bar pentru sejururi terminate ── */
function DateOverlay({ startDate, endDate }: { startDate: Date; endDate: Date }) {
    const { t }    = useTranslation();
    const nights   = nightsCount(startDate, endDate);

    return (
        <Box sx={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
            px: 2, pt: 3, pb: 1.5,
        }}>
            {/* Date pills + badge Finalizat */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 0.6,
                    bgcolor: "rgba(255,255,255,0.13)", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    px: 1.2, py: 0.5, borderRadius: 99,
                }}>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                        {formatDate(startDate)}
                    </Typography>
                </Box>

                {/* Badge "Finalizat" — gri neutru */}
                <Box sx={{
                    px: 1.2, py: 0.5, borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.22)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: 0.4 }}>
                        {t("dashboard.previousStays.badgeDone")}
                    </Typography>
                </Box>

                <Box sx={{
                    display: "flex", alignItems: "center", gap: 0.6,
                    bgcolor: "rgba(255,255,255,0.13)", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    px: 1.2, py: 0.5, borderRadius: 99,
                }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                        {formatDate(endDate)}
                    </Typography>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }} />
                </Box>
            </Box>

            {/* Track complet (100%) — gri */}
            <Box sx={{ height: 3, bgcolor: "rgba(255,255,255,0.18)", borderRadius: 99, overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: "100%", bgcolor: "rgba(255,255,255,0.35)", borderRadius: 99 }} />
            </Box>

            <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.45)", mt: 0.5, textAlign: "center" }}>
                {nights} {nights === 1
                ? (t("dashboard.previousStays.night") ?? "night")
                : (t("dashboard.previousStays.nights") ?? "nights")}
            </Typography>
        </Box>
    );
}

/* ─── HeroStayCard ────────────────────────────────────────────────────── */
function HeroStayCard({ stay }: { stay: StayEntry }) {
    const { t }    = useTranslation();
    const navigate = useNavigate();
    const { apartment, startDate, endDate } = stay;
    const cardImage = apartment.image_urls?.[0] ?? apartment.image_url;

    return (
        <Box sx={{
            borderRadius: 4, overflow: "hidden",
            border: `1px solid ${colors.border}`,
            bgcolor: "background.paper",
            display: "flex", flexDirection: "column",
            height: "100%",
            boxShadow: `0 4px 24px ${colors.primaryAlpha10}`,
            transition: "box-shadow 0.25s, transform 0.25s",
            // imagine mai estompata pentru sejururi terminate
            filter: "none",
            "&:hover": {
                boxShadow: `0 10px 40px ${colors.primaryAlpha25}`,
                transform: "translateY(-3px)",
            },
        }}>
            {/* Imagine cu overlay de desaturare usoara */}
            <Box sx={{ position: "relative", flex: "0 0 300px", overflow: "hidden", bgcolor: "background.default" }}>
                {cardImage
                    ? <img src={cardImage} alt={apartment.Address}
                           style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7)" }} />
                    : <Box sx={{
                        width: "100%", height: "100%",
                        background: gradients.primary, opacity: 0.6,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <LocationOnIcon sx={{ fontSize: 48, color: "#fff", opacity: 0.4 }} />
                    </Box>
                }
                <DateOverlay startDate={startDate} endDate={endDate} />
            </Box>

            {/* Info */}
            <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{
                        background: colors.primaryAlpha10, p: 1, borderRadius: 1.5,
                        border: `1px solid ${colors.primaryAlpha25}`, flexShrink: 0,
                    }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: "primary.main", display: "block" }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: "text.primary", lineHeight: 1.35, letterSpacing: "-0.3px" }}>
                        {apartment.Address}
                    </Typography>
                </Box>

                <Box sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    p: 2, borderRadius: 2,
                    bgcolor: "background.default",
                    border: `1px solid ${colors.border}`,
                }}>
                    <Box>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: 1, mb: 0.3 }}>
                            {t("apartment.owner")}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "text.primary" }}>
                            {`User #${apartment.Id_Owner}`}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: 1, mb: 0.3 }}>
                            {t("apartment.price")}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4, justifyContent: "flex-end" }}>
                            <Typography sx={{ fontWeight: 900, fontSize: 20, color: "primary.main", lineHeight: 1 }}>
                                {apartment.Cost_per_interval}
                            </Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}>
                                {apartment.Currency}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowRightAltIcon />}
                    onClick={() => navigate(paths.apartmentDetail(apartment.Id_Apartment))}
                    sx={{
                        mt: "auto", fontWeight: 700, textTransform: "none",
                        borderRadius: 2.5, py: 1.3,
                        borderColor: colors.primaryAlpha25,
                        color: "primary.main",
                        "&:hover": { borderColor: "primary.main", bgcolor: colors.primaryAlpha06 },
                    }}
                >
                    {t("listings.details")}
                </Button>
            </Box>
        </Box>
    );
}

/* ─── CompactStayCard ─────────────────────────────────────────────────── */
function CompactStayCard({ stay }: { stay: StayEntry }) {
    const { t }    = useTranslation();
    const navigate = useNavigate();
    const { apartment, startDate, endDate } = stay;
    const cardImage = apartment.image_urls?.[0] ?? apartment.image_url;

    return (
        <Box sx={{
            borderRadius: 3, overflow: "hidden",
            border: `1px solid ${colors.border}`,
            bgcolor: "background.paper",
            display: "flex",
            boxShadow: `0 2px 12px ${colors.primaryAlpha10}`,
            transition: "box-shadow 0.2s, transform 0.2s",
            "&:hover": {
                boxShadow: `0 6px 24px ${colors.primaryAlpha25}`,
                transform: "translateY(-2px)",
            },
        }}>
            {/* Thumbnail desaturat */}
            <Box sx={{ position: "relative", width: 110, flexShrink: 0, overflow: "hidden", bgcolor: "background.default" }}>
                {cardImage
                    ? <img src={cardImage} alt={apartment.Address}
                           style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.6)" }} />
                    : <Box sx={{ width: "100%", height: "100%", background: gradients.primary, opacity: 0.5 }} />
                }
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, p: 1.75, display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
                <Typography sx={{
                    fontWeight: 700, fontSize: 13, color: "text.primary",
                    lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                    {apartment.Address}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "text.disabled" }} />
                    <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
                        {formatDate(startDate)}
                    </Typography>
                    <ArrowRightAltIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                    <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
                        {formatDate(endDate)}
                    </Typography>
                </Box>

                {/* Track complet gri */}
                <Box sx={{ height: 3, bgcolor: colors.primaryAlpha10, borderRadius: 99, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: "100%", bgcolor: "rgba(156,163,175,0.4)", borderRadius: 99 }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.3 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 15, color: "primary.main", lineHeight: 1 }}>
                            {apartment.Cost_per_interval}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, fontSize: 11, color: "text.secondary" }}>
                            {apartment.Currency}
                        </Typography>
                    </Box>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(paths.apartmentDetail(apartment.Id_Apartment))}
                        sx={{
                            fontSize: 11, fontWeight: 700, textTransform: "none",
                            borderRadius: 99, px: 1.5, py: 0.3,
                            borderColor: colors.primaryAlpha25,
                            color: "primary.main",
                            "&:hover": { borderColor: "primary.main", bgcolor: colors.primaryAlpha06 },
                        }}
                    >
                        {t("listings.details")}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

/* ─── main component ──────────────────────────────────────────────────── */
export default function PreviousStaysTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();

    const [stays, setStays]     = useState<StayEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(false);

    useEffect(() => {
        if (!currentUser?.id) return;
        const now = new Date();

        Promise.all([
            fetchRenterPayments(currentUser.id),
            apartmentService.getAll(),
        ])
            .then(([payments, apartments]) => {
                const aptMap = new Map<number, Apartment>(apartments.map(a => [a.Id_Apartment, a]));
                const previous = payments
                    .filter(p => p.endDate != null && new Date(p.endDate) < now)
                    .sort((a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime())
                    .reduce<StayEntry[]>((acc, p) => {
                        const apt = aptMap.get(p.apartmentId);
                        if (apt) acc.push({ apartment: apt, startDate: new Date(p.startDate!), endDate: new Date(p.endDate!) });
                        return acc;
                    }, []);
                setStays(previous);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [currentUser?.id]);

    if (loading) return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Alert severity="error" sx={{ mt: 2 }}>
            {t("dashboard.previousStays.errorLoad")}
        </Alert>
    );

    if (stays.length === 0) return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.disabled" sx={{ fontSize: 18, fontStyle: "italic" }}>
                {t("dashboard.previousStays.empty")}
            </Typography>
        </Box>
    );

    const [hero, ...rest] = stays;

    return (
        <Box sx={{ pb: 6 }}>
            {/* Section label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                <Typography sx={{
                    fontSize: 13, fontWeight: 800, color: "text.disabled",
                    textTransform: "uppercase", letterSpacing: "1px",
                }}>
                    {t("dashboard.previousStays.sectionLabel") ?? "Your previous stays"}
                </Typography>
                <Chip
                    label={stays.length}
                    size="small"
                    sx={{
                        height: 20, fontSize: 11, fontWeight: 800,
                        bgcolor: "background.default", color: "text.secondary",
                        border: `1px solid ${colors.border}`,
                    }}
                />
            </Box>

            {stays.length === 1 ? (
                <Box sx={{ maxWidth: 480 }}>
                    <HeroStayCard stay={hero} />
                </Box>
            ) : (
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                    alignItems: "stretch",
                }}>
                    <HeroStayCard stay={hero} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {rest.map(stay => (
                            <CompactStayCard key={stay.apartment.Id_Apartment} stay={stay} />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}