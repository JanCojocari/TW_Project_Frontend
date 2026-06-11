// components/general/LanguageSwitcher.tsx
import { useState } from "react";
import { Box, Menu, MenuItem, Typography, ButtonBase, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLang }   from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { colors }    from "../../theme/gradients";

// SVG din flagcdn.com — randare corecta pe orice OS inclusiv Windows
const FLAGS: Record<string, string> = {
    ro: "https://flagcdn.com/md.svg",
    en: "https://flagcdn.com/gb.svg",
};

const LANG_LABELS: Record<string, string> = {
    ro: "RO",
    en: "EN",
};

const FlagCircle = ({ lang, border }: { lang: string; border: string }) => (
    <Box
        sx={{
            width:          22,
            height:         22,
            borderRadius:   "50%",
            overflow:       "hidden",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            border:         `1px solid ${border}`,
            bgcolor:        "background.paper",
            flexShrink:     0,
        }}
    >
        <Box
            component="img"
            src={FLAGS[lang]}
            alt={lang}
            sx={{
                width:      "100%",
                height:     "100%",
                objectFit:  "cover",
                display:    "block",
            }}
        />
    </Box>
);

export default function LanguageSwitcher() {
    const { lang, toggleLang }  = useLang();
    const { t }                 = useTranslation();
    const [anchor, setAnchor]   = useState<null | HTMLElement>(null);
    const open = Boolean(anchor);

    const handleOpen   = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
    const handleClose  = () => setAnchor(null);
    const handleSwitch = () => { toggleLang(); handleClose(); };

    const otherLang = lang === "ro" ? "en" : "ro";

    return (
        <>
            <Tooltip title={t("lang.switch")}>
                <ButtonBase
                    onClick={handleOpen}
                    sx={{
                        display:      "flex",
                        alignItems:   "center",
                        gap:          0.8,
                        px:           1.5,
                        py:           0.8,
                        borderRadius: 2,
                        border:       `1px solid ${open ? colors.primary : colors.border}`,
                        bgcolor:      open ? colors.primaryAlpha06 : "transparent",
                        transition:   "all 0.2s ease",
                        "&:hover": {
                            borderColor: colors.primary,
                            bgcolor:     colors.primaryAlpha06,
                        },
                    }}
                >
                    <FlagCircle lang={lang} border={colors.border} />

                    <Typography fontSize={13} fontWeight={700} color="text.primary">
                        {LANG_LABELS[lang]}
                    </Typography>

                    <KeyboardArrowDownIcon
                        sx={{
                            fontSize:   16,
                            color:      "text.secondary",
                            transition: "transform 0.2s ease",
                            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </ButtonBase>
            </Tooltip>

            <Menu
                anchorEl={anchor}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt:           1,
                            minWidth:     140,
                            borderRadius: 2,
                            border:       `1px solid ${colors.border}`,
                            boxShadow:    `0 8px 24px ${colors.primaryAlpha10}`,
                            bgcolor:      "background.paper",
                        },
                    },
                }}
            >
                <MenuItem onClick={handleSwitch} sx={{ gap: 1.5, py: 1.2 }}>
                    <FlagCircle lang={otherLang} border={colors.border} />
                    <Typography fontSize={13} fontWeight={600}>
                        {t(`lang.${otherLang}`)}
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
}