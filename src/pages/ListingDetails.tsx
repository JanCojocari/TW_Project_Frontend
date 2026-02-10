import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apartments } from "../mockdata/apartments";
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Stack,
    Typography,
    Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { paths } from "../app/paths";

export default function ListingDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const apartment = useMemo(() => {
        const numericId = Number(id);
        return apartments.find((a) => a.Id_Apartment === numericId) ?? null;
    }, [id]);

    if (!apartment) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" fontWeight={800}>
                    Anunțul nu a fost găsit
                </Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate(paths.listings)} startIcon={<ArrowBackIcon />}>
                    Înapoi la anunțuri
                </Button>
            </Container>
        );
    }

    const statusLabel = apartment.Id_Renter ? "Închiriat" : "Disponibil";

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                onClick={() => navigate(paths.listings)}
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2 }}
            >
                Înapoi
            </Button>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Box
                    component="img"
                    src={apartment.image_url}
                    alt={apartment.Address}
                    sx={{
                        width: "100%",
                        height: { xs: 220, md: 360 },
                        objectFit: "cover",
                        borderRadius: 3,
                    }}
                />

                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} sx={{ mt: 2 }}>
                    <Box>
                        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography variant="h5" fontWeight={900}>
                                {apartment.Address}
                            </Typography>
                            <Chip label={statusLabel} color={apartment.Id_Renter ? "default" : "success"} />
                        </Stack>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            ID Apartment: {apartment.Id_Apartment} • Owner: {apartment.Id_Owner}
                        </Typography>
                    </Box>

                    <Box textAlign={{ xs: "left", md: "right" }}>
                        <Typography variant="h5" fontWeight={900}>
                            {apartment.Cost_per_interval} {apartment.Currency} / {apartment.Interval}
                        </Typography>
                        <Typography color="text.secondary">
                            Plată per interval
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
                    <Button
                        variant="contained"
                        disabled={!!apartment.Id_Renter}
                        sx={{ borderRadius: 2 }}
                    >
                        {apartment.Id_Renter ? "Deja închiriat" : "Închiriază acum"}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<FavoriteBorderIcon />}
                        sx={{ borderRadius: 2 }}
                    >
                        Adaugă la favorite
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}