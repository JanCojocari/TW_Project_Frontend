import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography, Chip } from "@mui/material";
import type { Apartment } from "../types/apartment.types";
import { generatePath, Link as RouterLink } from "react-router-dom";
import { paths } from "../app/paths";

type ListingCardProps = {
    apartment: Apartment;
};

function formatPrice(a: Apartment) {
    return `${a.Cost_per_interval} ${a.Currency} / ${a.Interval}`;
}

export default function ListingCard({ apartment }: ListingCardProps) {
    return (
        <Card sx={{ height: "100%" }}>
            <CardActionArea
                component={RouterLink}
                to={generatePath(paths.listingDetails, { id: String(apartment.Id_Apartment) })}
                sx={{ height: "100%", alignItems: "stretch" }}
            >
                <CardMedia
                    component="img"
                    height="180"
                    image={apartment.image_url}
                    alt={apartment.Address}
                />

                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                        <Typography variant="h6" fontWeight={800} noWrap>
                            {apartment.Address}
                        </Typography>

                        {/* quick status: available / rented */}
                        {apartment.Id_Renter ? (
                            <Chip size="small" label="Închiriat" color="default" />
                        ) : (
                            <Chip size="small" label="Disponibil" color="success" />
                        )}
                    </Stack>

                    <Typography variant="h6" sx={{ mt: 1 }}>
                        {formatPrice(apartment)}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}