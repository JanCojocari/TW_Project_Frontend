import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { users } from "../mockdata/users";
import { paths } from "../app/paths";
import type { User } from "../types/user.types";

// TODO: replace with AuthContext later
const CURRENT_USER_ID = 1;

export default function EditProfile() {
    const navigate = useNavigate();

    const originalUser = users.find((u) => u.Id_User === CURRENT_USER_ID) ?? null;

    const [form, setForm] = useState<Pick<User, "Name" | "Surname" | "Email" | "Phone" | "Birthday" | "Gender">>({
        Name: originalUser?.Name ?? "",
        Surname: originalUser?.Surname ?? "",
        Email: originalUser?.Email ?? "",
        Phone: originalUser?.Phone ?? "",
        Birthday: originalUser?.Birthday ?? "",
        Gender: originalUser?.Gender ?? null,
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSaved(false);
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSaved(false);
        setForm((prev) => ({ ...prev, Gender: e.target.value as User["Gender"] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: call API / update AuthContext when backend is ready
        setSaved(true);
    };

    if (!originalUser) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography color="error">Utilizatorul nu a fost găsit.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(paths.dashboard)}
                        variant="text"
                        sx={{ textTransform: "none", fontWeight: 700, px: 0 }}
                    >
                        Înapoi la Dashboard
                    </Button>
                </Stack>

                <Typography variant="h5" fontWeight={900}>
                    Editează profil
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    Modifică datele contului tău.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        {/* Name & Surname */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Prenume"
                                value={form.Name}
                                onChange={handleChange("Name")}
                                fullWidth
                                required
                                inputProps={{ maxLength: 50 }}
                            />
                            <TextField
                                label="Nume"
                                value={form.Surname}
                                onChange={handleChange("Surname")}
                                fullWidth
                                required
                                inputProps={{ maxLength: 50 }}
                            />
                        </Stack>

                        {/* Email */}
                        <TextField
                            label="Email"
                            type="email"
                            value={form.Email ?? ""}
                            onChange={handleChange("Email")}
                            fullWidth
                        />

                        {/* Phone */}
                        <TextField
                            label="Telefon"
                            value={form.Phone}
                            onChange={handleChange("Phone")}
                            fullWidth
                            inputProps={{ maxLength: 15 }}
                        />

                        {/* Birthday */}
                        <TextField
                            label="Data nașterii"
                            type="date"
                            value={form.Birthday}
                            onChange={handleChange("Birthday")}
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                        {/* Gender */}
                        <FormControl>
                            <FormLabel sx={{ fontWeight: 700, mb: 0.5 }}>Gen</FormLabel>
                            <RadioGroup
                                row
                                value={form.Gender ?? ""}
                                onChange={handleGenderChange}
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Masculin" />
                                <FormControlLabel value="female" control={<Radio />} label="Feminin" />
                            </RadioGroup>
                        </FormControl>

                        {/* Actions */}
                        <Stack direction="row" gap={1.5} sx={{ pt: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                            >
                                Salvează modificările
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(paths.dashboard)}
                                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                            >
                                Anulează
                            </Button>
                        </Stack>

                        {saved && (
                            <Typography color="success.main" fontWeight={700}>
                                Profil actualizat cu succes! (mock — fără backend încă)
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}
