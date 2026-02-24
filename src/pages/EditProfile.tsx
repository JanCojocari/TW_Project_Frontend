import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert, Box, Button, Container, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel,
    FormHelperText, FormLabel, Paper, Radio, RadioGroup, Stack, TextField, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { users } from "../mockdata/users";
import { paths } from "../app/paths";
import type { User } from "../types/user.types";
import { colors } from "../theme/gradients.ts";

const CURRENT_USER_ID = 1;

type FormFields = Pick<User, "Name" | "Surname" | "Email" | "Phone" | "Birthday" | "Gender">;
type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\- ]{6,15}$/;

function validate(form: FormFields): FormErrors {
    const errors: FormErrors = {};
    if (!form.Name.trim())    errors.Name    = "Prenumele este obligatoriu.";
    else if (form.Name.trim().length < 2)    errors.Name = "Prenumele trebuie să aibă cel puțin 2 caractere.";
    if (!form.Surname.trim()) errors.Surname = "Numele este obligatoriu.";
    else if (form.Surname.trim().length < 2) errors.Surname = "Numele trebuie să aibă cel puțin 2 caractere.";
    if (form.Email && !EMAIL_RE.test(form.Email)) errors.Email = "Adresa de email nu este validă.";
    if (form.Phone && !PHONE_RE.test(form.Phone)) errors.Phone = "Telefonul trebuie să conțină 6–15 cifre.";
    if (form.Birthday) {
        const date = new Date(form.Birthday);
        const today = new Date();
        const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        if (isNaN(date.getTime()))  errors.Birthday = "Data nașterii nu este validă.";
        else if (date > today)      errors.Birthday = "Data nașterii nu poate fi în viitor.";
        else if (date > minAge)     errors.Birthday = "Trebuie să ai cel puțin 18 ani.";
    }
    return errors;
}

export default function EditProfile() {
    const navigate = useNavigate();
    const originalUser = users.find((u) => u.Id_User === CURRENT_USER_ID) ?? null;

    const initialForm: FormFields = {
        Name:     originalUser?.Name     ?? "",
        Surname:  originalUser?.Surname  ?? "",
        Email:    originalUser?.Email    ?? "",
        Phone:    originalUser?.Phone    ?? "",
        Birthday: originalUser?.Birthday ?? "",
        Gender:   originalUser?.Gender   ?? "",
    };

    const [form,             setForm]             = useState<FormFields>(initialForm);
    const [errors,           setErrors]           = useState<FormErrors>({});
    const [touched,          setTouched]          = useState<Partial<Record<keyof FormFields, boolean>>>({});
    const [saved,            setSaved]            = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const isDirty = (Object.keys(initialForm) as Array<keyof FormFields>).some((k) => form[k] !== initialForm[k]);

    const handleChange = (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = { ...form, [field]: e.target.value };
        setForm(updated);
        setSaved(false);
        if (touched[field]) setErrors(validate(updated));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = { ...form, Gender: e.target.value as User["Gender"] };
        setForm(updated);
        setSaved(false);
        setTouched((prev) => ({ ...prev, Gender: true }));
        setErrors(validate(updated));
    };

    const handleBlur = (field: keyof FormFields) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors(validate(form));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched = Object.fromEntries((Object.keys(form) as Array<keyof FormFields>).map((k) => [k, true])) as Record<keyof FormFields, boolean>;
        setTouched(allTouched);
        const currentErrors = validate(form);
        setErrors(currentErrors);
        if (Object.keys(currentErrors).length > 0) return;
        setSaved(true);
    };

    const handleCancelClick = () => isDirty ? setCancelDialogOpen(true) : navigate(paths.dashboard);

    if (!originalUser) return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography color="error">Utilizatorul nu a fost găsit.</Typography>
        </Container>
    );

    const showError = (f: keyof FormFields) => !!(touched[f] && errors[f]);
    const errorMsg  = (f: keyof FormFields) => touched[f] ? errors[f] : undefined;

    return (
        <Container maxWidth="sm" sx={{ py: 4, mt: 8 }}>
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, border: `1px solid ${colors.border}` }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={handleCancelClick} variant="text" sx={{ px: 0, fontWeight: 700 }}>
                        Înapoi la Dashboard
                    </Button>
                </Stack>

                <Typography variant="h5" fontWeight={900}>Editează profil</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>Modifică datele contului tău.</Typography>

                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2.5}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField label="Prenume" value={form.Name}    onChange={handleChange("Name")}    onBlur={handleBlur("Name")}    error={showError("Name")}    helperText={errorMsg("Name")}    fullWidth required inputProps={{ maxLength: 50 }} />
                            <TextField label="Nume"    value={form.Surname} onChange={handleChange("Surname")} onBlur={handleBlur("Surname")} error={showError("Surname")} helperText={errorMsg("Surname")} fullWidth required inputProps={{ maxLength: 50 }} />
                        </Stack>

                        <TextField label="Email"   type="email" value={form.Email ?? ""}  onChange={handleChange("Email")}   onBlur={handleBlur("Email")}   error={showError("Email")}   helperText={errorMsg("Email")}   fullWidth />
                        <TextField label="Telefon"              value={form.Phone}         onChange={handleChange("Phone")}   onBlur={handleBlur("Phone")}   error={showError("Phone")}   helperText={errorMsg("Phone") ?? "Ex: 069123456"} fullWidth inputProps={{ maxLength: 15 }} />
                        <TextField label="Data nașterii" type="date" value={form.Birthday} onChange={handleChange("Birthday")} onBlur={handleBlur("Birthday")} error={showError("Birthday")} helperText={errorMsg("Birthday")} fullWidth slotProps={{ inputLabel: { shrink: true } }} />

                        <FormControl error={showError("Gender")}>
                            <FormLabel sx={{ fontWeight: 700, mb: 0.5 }}>Gen</FormLabel>
                            <RadioGroup row value={form.Gender ?? ""} onChange={handleGenderChange}>
                                <FormControlLabel value="male"   control={<Radio />} label="Masculin" />
                                <FormControlLabel value="female" control={<Radio />} label="Feminin"  />
                            </RadioGroup>
                            {showError("Gender") && <FormHelperText>{errorMsg("Gender")}</FormHelperText>}
                        </FormControl>

                        <Stack direction="row" gap={1.5} sx={{ pt: 1 }}>
                            <Button type="submit"  variant="contained" sx={{ borderRadius: 2, fontWeight: 700 }}>Salvează modificările</Button>
                            <Button variant="outlined" onClick={handleCancelClick} sx={{ borderRadius: 2, fontWeight: 700 }}>Anulează</Button>
                        </Stack>

                        {saved && <Alert severity="success">Profil actualizat cu succes! (mock — fără backend încă)</Alert>}
                    </Stack>
                </Box>
            </Paper>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle sx={{ fontWeight: 900 }}>Ai modificări nesalvate</DialogTitle>
                <DialogContent>
                    <DialogContentText>Dacă pleci acum, modificările nu vor fi salvate. Ești sigur că vrei să continui?</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }}>Rămân pe pagină</Button>
                    <Button onClick={() => navigate(paths.dashboard)}  variant="contained" color="error"  sx={{ fontWeight: 700, borderRadius: 2 }}>Renunț la modificări</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}