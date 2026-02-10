import { Container, Grid, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo, useState } from "react";
import { apartments } from "../mockdata/apartments";
import ListingCard from "../components/ListingCard";

export default function Listings() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return apartments;
        return apartments.filter((a) => a.Address.toLowerCase().includes(q));
    }, [query]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <TextField
                fullWidth
                placeholder="Caută după adresă..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={2}>
                {filtered.map((a) => (
                    <Grid key={a.Id_Apartment} item xs={12} sm={6} md={4}>
                        <ListingCard apartment={a} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}