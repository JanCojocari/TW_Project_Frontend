// src/pages/RoleSelection.tsx
import { useEffect, useState } from "react";
import { useNavigate }         from "react-router-dom";
import { useTranslation }      from "react-i18next";
import { Box, Button, Typography } from "@mui/material";
import { paths } from "../app/paths";

const RoleSelection = () => {
    const navigate          = useNavigate();
    const { t }             = useTranslation();

    const [visible,         setVisible]         = useState(false);
    const [fadeOut,         setFadeOut]          = useState(false);
    const [secondQ,         setSecondQ]          = useState(false);
    const [secondVisible,   setSecondVisible]    = useState(false);
    const [redirecting,     setRedirecting]      = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleOwner = () => {
        setFadeOut(true);
        setTimeout(() => {
            setRedirecting(true);
            setTimeout(() => {
                navigate(`${paths.registerForm}?role=owner`);
            }, 800);
        }, 400);
    };

    const handleRenter = () => {
        setFadeOut(true);
        setTimeout(() => {
            // apare intrebarea 2
            setSecondQ(true);
            setTimeout(() => setSecondVisible(true), 50);

            // dupa 1.5s apare "Redirectionare..." sub intrebarea 2
            setTimeout(() => setRedirecting(true), 1500);

            // dupa inca 800ms navigheaza
            setTimeout(() => {
                navigate(`${paths.registerForm}?role=renter`);
            }, 1500 + 800);
        }, 400);
    };

    return (
        <Box sx={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            flex:           1,
            gap:            4,
        }}>
            {/* Intrebarea 1 */}
            {!secondQ && (
                <Box sx={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           4,
                    opacity:       fadeOut ? 0 : visible ? 1 : 0,
                    transition:    fadeOut
                        ? "opacity 400ms ease-in"
                        : "opacity 600ms ease-in",
                }}>
                    <Typography variant="h5" color="text.primary" textAlign="center">
                        {t("roleSelection.question")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained" color="primary" size="large"
                            onClick={handleOwner}
                            sx={{ minWidth: 100 }}
                        >
                            {t("roleSelection.yes")}
                        </Button>
                        <Button
                            variant="outlined" color="primary" size="large"
                            onClick={handleRenter}
                            sx={{ minWidth: 100 }}
                        >
                            {t("roleSelection.no")}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Intrebarea 2 + Redirectionare... (coexista) */}
            {secondQ && (
                <Box sx={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           2,
                    opacity:       secondVisible ? 1 : 0,
                    transition:    "opacity 600ms ease-in",
                }}>
                    <Typography variant="h5" color="text.primary" textAlign="center" maxWidth={500}>
                        {t("roleSelection.question2")}
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        fontStyle="italic"
                        sx={{
                            opacity:    redirecting ? 1 : 0,
                            transition: "opacity 600ms ease-in",
                        }}
                    >
                        {t("roleSelection.redirecting")}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default RoleSelection;