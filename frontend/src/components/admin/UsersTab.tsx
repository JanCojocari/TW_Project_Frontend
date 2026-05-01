// components/admin/UsersTab.tsx
import { useEffect, useState, useMemo } from "react";
import {
    Avatar, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert,
    TextField, InputAdornment,
} from "@mui/material";
import DeleteIcon              from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon  from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon   from "@mui/icons-material/SupervisorAccount";
import PersonOffIcon           from "@mui/icons-material/PersonOff";
import PersonIcon              from "@mui/icons-material/Person";
import SearchIcon              from "@mui/icons-material/Search";
import { useTranslation }      from "react-i18next";
import { adminService, type AdminUser } from "../../services/adminService";
import { useAuth }             from "../../auth/AuthContext";
import { resolveMediaUrl }     from "../../utils/mediaUrl";

// 0=Admin, 1=Owner, 2=Renter, 3=Moderator
const roleLabel = (role: number, t: (k: string) => string) => {
    if (role === 0) return { label: t("admin.users.roleAdmin"),     color: "warning"  as const };
    if (role === 1) return { label: t("admin.users.roleOwner"),     color: "info"     as const };
    if (role === 3) return { label: t("admin.users.roleModerator"), color: "secondary" as const };
    return             { label: t("admin.users.roleRenter"),    color: "default"  as const };
};

// Descriere actiune pentru dialogul de confirmare
const actionLabel = (newRole: number, t: (k: string) => string) => {
    if (newRole === 0) return t("admin.users.roleAdmin");
    if (newRole === 3) return t("admin.users.roleModerator");
    return t("admin.users.roleRenter");
};

export default function UsersTab() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const [users, setUsers]                 = useState<AdminUser[]>([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
    const [confirmRole, setConfirmRole]     = useState<{ user: AdminUser; newRole: number } | null>(null);
    const [busy, setBusy]                   = useState(false);
    const [query, setQuery]                 = useState("");

    const load = async () => {
        setLoading(true);
        try {
            setUsers(await adminService.getUsers());
            setError(null);
        } catch {
            setError(t("admin.users.errorLoad"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            String(u.id).includes(q) ||
            u.name?.toLowerCase().includes(q) ||
            u.surname?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    }, [users, query]);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteUser(confirmDelete.id);
            setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
        } catch {
            setError(t("admin.users.errorDelete"));
        } finally {
            setBusy(false);
            setConfirmDelete(null);
        }
    };

    const handleRoleChange = async () => {
        if (!confirmRole) return;
        setBusy(true);
        try {
            await adminService.updateUserRole(confirmRole.user.id, confirmRole.newRole);
            setUsers(prev => prev.map(u =>
                u.id === confirmRole.user.id ? { ...u, role: confirmRole.newRole } : u
            ));
        } catch {
            setError(t("admin.users.errorRole"));
        } finally {
            setBusy(false);
            setConfirmRole(null);
        }
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TextField
                fullWidth size="small"
                placeholder={t("admin.users.searchPlaceholder")}
                value={query}
                onChange={e => setQuery(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "background.default" } }}>
                            <TableCell>{t("admin.users.colId")}</TableCell>
                            <TableCell>{t("admin.users.colName")}</TableCell>
                            <TableCell>{t("admin.users.colEmail")}</TableCell>
                            <TableCell>{t("admin.users.colPhone")}</TableCell>
                            <TableCell>{t("admin.users.colRole")}</TableCell>
                            <TableCell>{t("admin.users.colBalance")}</TableCell>
                            <TableCell align="right">{t("admin.users.colActions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map(user => {
                            const rl     = roleLabel(user.role, t);
                            const isSelf = user.id === currentUser?.id;
                            const initials = `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase();

                            return (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Avatar src={resolveMediaUrl(user.avatarUrl)} sx={{ width: 28, height: 28, fontSize: 12 }}>
                                                {!user.avatarUrl && initials}
                                            </Avatar>
                                            {user.name} {user.surname}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Chip label={rl.label} color={rl.color} size="small" sx={{ fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell>${user.accountBalance.toFixed(2)}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>

                                            {/* Make Admin — vizibil daca userul NU e deja Admin */}
                                            {user.role !== 0 && (
                                                <Tooltip title={t("admin.users.makeAdmin")}>
                                                    <IconButton
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => setConfirmRole({ user, newRole: 0 })}
                                                    >
                                                        <AdminPanelSettingsIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* Make Moderator — vizibil daca userul NU e deja Moderator */}
                                            {user.role !== 3 && (
                                                <Tooltip title={t("admin.users.makeModerator")}>
                                                    <IconButton
                                                        size="small"
                                                        color="secondary"
                                                        onClick={() => setConfirmRole({ user, newRole: 3 })}
                                                    >
                                                        <SupervisorAccountIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* Remove Admin / Remove Moderator — afiseaza "retrage rol" daca e Admin sau Moderator */}
                                            {(user.role === 0 || user.role === 3) && (
                                                <Tooltip title={
                                                    user.role === 0
                                                        ? t("admin.users.removeAdmin")
                                                        : t("admin.users.removeModerator")
                                                }>
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="default"
                                                            disabled={isSelf}
                                                            onClick={() => setConfirmRole({ user, newRole: 2 })}
                                                        >
                                                            <PersonOffIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}

                                            {/* Delete user */}
                                            <Tooltip title={isSelf ? t("admin.users.cannotDeleteSelf") : t("admin.users.deleteUser")}>
                                                <span>
                                                    <IconButton size="small" color="error" disabled={isSelf} onClick={() => setConfirmDelete(user)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.disabled" }}>
                                    {t("admin.users.noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog confirmare stergere */}
            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>{t("admin.users.deleteTitle")}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("admin.users.deleteDesc", { name: `${confirmDelete?.name} ${confirmDelete?.surname}` })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)} disabled={busy}>{t("admin.common.cancel")}</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : t("admin.common.delete")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog confirmare schimbare rol */}
            <Dialog open={!!confirmRole} onClose={() => setConfirmRole(null)}>
                <DialogTitle fontWeight={700}>{t("admin.users.roleTitle")}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("admin.users.roleDesc", {
                            name: `${confirmRole?.user.name} ${confirmRole?.user.surname}`,
                            role: actionLabel(confirmRole?.newRole ?? 2, t),
                        })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRole(null)} disabled={busy}>{t("admin.common.cancel")}</Button>
                    <Button onClick={handleRoleChange} color="warning" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : t("admin.common.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}