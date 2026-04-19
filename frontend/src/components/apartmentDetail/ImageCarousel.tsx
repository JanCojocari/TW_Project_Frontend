import { useState, useCallback } from "react";
import { Box, Paper, IconButton, Typography } from "@mui/material";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, PhotoCamera as CameraIcon } from "@mui/icons-material";
import { colors } from "../../theme/gradients.ts";

interface Props { images: string[]; altBase: string; statusChip: React.ReactNode; }

const ImageCarousel = ({ images, altBase, statusChip }: Props) => {
    const [current, setCurrent] = useState(0);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    const go = useCallback((dir: "prev" | "next") => {
        setAnimDir(dir === "next" ? "left" : "right");
        setTimeout(() => {
            setCurrent((c) => dir === "next" ? (c + 1) % images.length : (c - 1 + images.length) % images.length);
            setAnimDir(null);
        }, 260);
    }, [images.length]);

    const goTo = useCallback((idx: number) => {
        if (idx === current) return;
        setAnimDir(idx > current ? "left" : "right");
        setTimeout(() => { setCurrent(idx); setAnimDir(null); }, 260);
    }, [current]);

    // Guard — nu exista imagini
    if (!images || images.length === 0) return (
        <Paper elevation={2} sx={{
            borderRadius: 4, overflow: "hidden", height: "100%", minHeight: 320,
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 1, bgcolor: "background.paper",
            border: `1px solid ${colors.border}`,
        }}>
            <Box sx={{ position: "absolute", top: 20, left: 20 }}>{statusChip}</Box>
            <CameraIcon sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography color="text.disabled" fontWeight={600}>Fără imagini</Typography>
        </Paper>
    );

    return (
        <Paper elevation={2} sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            height: "100%",
            maxHeight: 566,
        }}>
            <img src={images[current]} alt={altBase} style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
                transform: animDir ? `translateX(${animDir === "left" ? "-6%" : "6%"})` : "translateX(0)",
                opacity: animDir ? 0 : 1,
            }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 45%)", pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", top: 20, left: 20 }}>{statusChip}</Box>
            <Box sx={{ position: "absolute", top: 18, right: 18, bgcolor: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", color: "white", fontSize: 12, fontWeight: 700, px: 1.5, py: 0.4, borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)", userSelect: "none" }}>
                {current + 1} / {images.length}
            </Box>

            {(["prev", "next"] as const).map((dir) => (
                <IconButton key={dir} onClick={() => go(dir)}
                            aria-label={dir === "prev" ? "Imaginea anterioară" : "Imaginea următoare"}
                            sx={{
                                position: "absolute", top: "50%",
                                [dir === "prev" ? "left" : "right"]: 12,
                                transform: "translateY(-50%)",
                                bgcolor: "background.paper",
                                backdropFilter: "blur(8px)",
                                width: 40, height: 40,
                                border: `1px solid ${colors.border}`,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) scale(1.08)",
                                    boxShadow: `0 4px 16px ${colors.primaryAlpha25}`,
                                    borderColor: "primary.main",
                                },
                            }}
                >
                    {dir === "prev"
                        ? <ChevronLeftIcon  sx={{ color: "primary.main" }} />
                        : <ChevronRightIcon sx={{ color: "primary.main" }} />
                    }
                </IconButton>
            ))}

            {images.length > 1 && (
                <Box sx={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", gap: 1, px: 1.2, py: 0.8, bgcolor: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", borderRadius: 2.5, border: "1px solid rgba(255,255,255,0.12)" }}>
                        {images.map((url, idx) => (
                            <Box key={idx} component="img" src={url} alt={`thumb-${idx + 1}`} onClick={() => goTo(idx)}
                                 sx={{ width: 48, height: 34, objectFit: "cover", borderRadius: 1.2, cursor: "pointer", border: idx === current ? "2px solid white" : "2px solid transparent", opacity: idx === current ? 1 : 0.55, transition: "all 0.2s ease", "&:hover": { opacity: 1, transform: "scale(1.06)" } }} />
                        ))}
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.8 }}>
                        {images.map((_, idx) => (
                            <Box key={idx} onClick={() => goTo(idx)} sx={{ width: idx === current ? 20 : 7, height: 7, borderRadius: "100px", bgcolor: idx === current ? "white" : "rgba(255,255,255,0.45)", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", "&:hover": { bgcolor: "rgba(255,255,255,0.8)" } }} />
                        ))}
                    </Box>
                </Box>
            )}
        </Paper>
    );
};

export default ImageCarousel;