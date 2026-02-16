import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Chip,
    Divider,
    Card,
    CardContent,
    Alert,
} from "@mui/material";
import {
    LocationOn as LocationOnIcon,
    AttachMoney as AttachMoneyIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { apartments } from "../mockdata/apartments";
import { users } from "../mockdata/users";

const ApartmentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showRentSuccess, setShowRentSuccess] = useState(false);

    const apartment = useMemo(() =>
            apartments.find(a => a.Id_Apartment === Number(id)),
        [id]
    );

    const owner = useMemo(() =>
            apartment ? users.find(u => u.Id_User === apartment.Id_Owner) : null,
        [apartment]
    );

    const renter = useMemo(() =>
            apartment?.Id_Renter ? users.find(u => u.Id_User === apartment.Id_Renter) : null,
        [apartment]
    );

    if (!apartment) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h5">Apartamentul nu a fost găsit</Typography>
            </Box>
        );
    }

    const handleRent = () => {
        navigate(`/payments?apartmentId=${apartment.Id_Apartment}`);
    };

    const getIntervalLabel = (interval: string): string => {
        const intervals: { [key: string]: string } = {
            hour: "oră",
            day: "zi",
            month: "lună",
        };
        return intervals[interval] || interval;
    };

    const isAvailable = apartment.Id_Renter === null;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8f9fa 0%, #f0f4ff 100%)",
                py: { xs: 3, md: 5 },
                mt: 10,
            }}
        >
            <Container maxWidth="lg">
                {/* Buton inapoi */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 3,
                        color: '#2563eb',
                        fontWeight: 600,
                        '&:hover': {
                            background: 'rgba(37, 99, 235, 0.08)',
                        },
                    }}
                >
                    Înapoi la anunțuri
                </Button>

                {showRentSuccess && (
                    <Alert
                        severity="success"
                        onClose={() => setShowRentSuccess(false)}
                        sx={{ mb: 3, borderRadius: 2 }}
                    >
                        Apartament închiriat cu succes!
                    </Alert>
                )}

                {/* Main content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4
                    }}
                >
                    {/* Imaginea pe stanga */}
                    <Box sx={{ flex: { xs: '1', md: '1 1 58%' } }}>
                        <Paper
                            sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                height: '100%',
                                position: "relative",
                            }}
                        >
                            <img
                                src={apartment.image_url}
                                alt={apartment.Address}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                            {/* Statut box */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 20,
                                    left: 20,
                                }}
                            >
                                <Chip
                                    label={isAvailable ? "Disponibil" : "Ocupat"}
                                    sx={{
                                        background: isAvailable
                                            ? "linear-gradient(135deg, #10b981, #059669)"
                                            : "linear-gradient(135deg, #ef4444, #dc2626)",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        px: 2,
                                        py: 2.5,
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>

                    {/* Detalii pe dreapta */}
                    <Box sx={{ flex: { xs: '1', md: '1 1 42%' } }}>
                        <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                            {/* Address */}
                            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                                <Box
                                    sx={{
                                        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: "flex",
                                    }}
                                >
                                    <LocationOnIcon sx={{ color: "white", fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Adresă
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        {apartment.Address}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Pret */}
                            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
                                <Box
                                    sx={{
                                        background: "linear-gradient(135deg, #10b981, #059669)",
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: "flex",
                                    }}
                                >
                                    <AttachMoneyIcon sx={{ color: "white", fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Preț
                                    </Typography>
                                    <Typography variant="h4" fontWeight={900} color="primary">
                                        {apartment.Cost_per_interval} {apartment.Currency}
                                        <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                                            / {getIntervalLabel(apartment.Interval)}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Proprietar Info */}
                            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                                        <PersonIcon sx={{ color: '#2563eb', fontSize: 28 }} />
                                        <Typography variant="h6" fontWeight={700}>
                                            Proprietar
                                        </Typography>
                                    </Box>
                                    {owner && (
                                        <>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Nume:</strong> {owner.Name} {owner.Surname}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Email:</strong> {owner.Email || 'N/A'}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Telefon:</strong> {owner.Phone}
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Chirias info (daca e ocupat) */}
                            {!isAvailable && renter && (
                                <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                                            <PersonIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                                            <Typography variant="h6" fontWeight={700}>
                                                Chiriaș Curent
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Nume:</strong> {renter.Name} {renter.Surname}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Email:</strong> {renter.Email || 'N/A'}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Telefon:</strong> {renter.Phone}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Buton de inchiriere */}
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleRent}
                                disabled={!isAvailable}
                                sx={{
                                    background: isAvailable
                                        ? "linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)"
                                        : "#d1d5db",
                                    py: 1.8,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    '&:hover': {
                                        transform: isAvailable ? 'translateY(-2px)' : 'none',
                                        boxShadow: isAvailable
                                            ? '0 12px 24px rgba(37, 99, 235, 0.4)'
                                            : 'none',
                                    },
                                }}
                            >
                                {isAvailable ? 'Închiriază Acum (soon)' : 'Indisponibil'}
                            </Button>

                            {isAvailable && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                                >
                                    Vei fi redirecționat către pagina de plată
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Box>

                {/* Informatii suplimentare */}
                <Paper sx={{ mt: 4, p: 4, borderRadius: 4 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                        Informații Suplimentare
                    </Typography>
                    
                </Paper>
            </Container>
        </Box>
    );
};

export default ApartmentDetail;