// components/admin/UsersTab.tsx
import { useEffect, useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, CircularProgress, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { adminService, type AdminUser } from "../../services/adminService";
import { useAuth } from "../../auth/AuthContext";

const roleLabel = (role: number) => {
    if (role === 0) return { label: "Admin",  color: "warning" as const };
    if (role === 1) return { label: "Owner",  color: "info"    as const };
    return             { label: "Renter", color: "default" as const };
};

export default function UsersTab() {
    const { currentUser } = useAuth();
    const [users, setUsers]         = useState<AdminUser[]>([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
    const [confirmRole, setConfirmRole]     = useState<{ user: AdminUser; newRole: number } | null>(null);
    const [busy, setBusy]           = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            setUsers(await adminService.getUsers());
            setError(null);
        } catch {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setBusy(true);
        try {
            await adminService.deleteUser(confirmDelete.id);
            setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
        } catch {
            setError("Failed to delete user.");
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
            setError("Failed to update role.");
        } finally {
            setBusy(false);
            setConfirmRole(null);
        }
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>;
    if (error)   return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "background.default" } }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => {
                            const rl = roleLabel(user.role);
                            const isSelf = user.id === currentUser?.id;
                            return (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name} {user.surname}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Chip label={rl.label} color={rl.color} size="small" sx={{ fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell>${user.accountBalance.toFixed(2)}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                                            {user.role !== 0 ? (
                                                <Tooltip title="Make Admin">
                                                    <IconButton
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => setConfirmRole({ user, newRole: 0 })}
                                                    >
                                                        <AdminPanelSettingsIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Make Renter">
                                                    <IconButton
                                                        size="small"
                                                        color="default"
                                                        disabled={isSelf}
                                                        onClick={() => setConfirmRole({ user, newRole: 2 })}
                                                    >
                                                        <PersonIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title={isSelf ? "Cannot delete yourself" : "Delete user"}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        disabled={isSelf}
                                                        onClick={() => setConfirmDelete(user)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <DialogTitle fontWeight={700}>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>{confirmDelete?.name} {confirmDelete?.surname}</strong>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)} disabled={busy}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Role Change Confirm Dialog */}
            <Dialog open={!!confirmRole} onClose={() => setConfirmRole(null)}>
                <DialogTitle fontWeight={700}>Change Role</DialogTitle>
                <DialogContent>
                    <Typography>
                        Set <strong>{confirmRole?.user.name} {confirmRole?.user.surname}</strong> as{" "}
                        <strong>{confirmRole?.newRole === 0 ? "Admin" : "Renter"}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRole(null)} disabled={busy}>Cancel</Button>
                    <Button onClick={handleRoleChange} color="warning" variant="contained" disabled={busy}>
                        {busy ? <CircularProgress size={16} /> : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
