// components/apartmentDetail/ImageCarousel.tsx
import { useState, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    PhotoCamera as CameraIcon,
} from "@mui/icons-material";
import { colors } from "../../theme/gradients.ts";

interface Props { images: string[]; altBase: string; statusChip: React.ReactNode; }

// Inaltimea fixa a caruselului — identica cu inaltimea ApartmentInfoPanel
const CAROUSEL_HEIGHT = 460;

const ImageCarousel = ({ images, altBase, statusChip }: Props) => {
    const [current, setCurrent] = useState(0);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    const go = useCallback((dir: "prev" | "next") => {
        setAnimDir(dir === "next" ? "left" : "right");
        setTimeout(() => {
            setCurrent((c) => dir === "next"
                ? (c + 1) % images.length
                : (c - 1 + images.length) % images.length);
            setAnimDir(null);
        }, 240);
    }, [images.length]);

    const goTo = useCallback((idx: number) => {
        if (idx === current) return;
        setAnimDir(idx > current ? "left" : "right");
        setTimeout(() => { setCurrent(idx); setAnimDir(null); }, 240);
    }, [current]);

    // Fara imagini
    if (!images || images.length === 0) return (
        <Box sx={{
            borderRadius: 3, overflow: "hidden",
            height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 1.5,
            bgcolor: "action.hover",
            border: `1px solid ${colors.border}`,
        }}>
            <CameraIcon sx={{ fontSize: 52, color: "text.disabled" }} />
            <Typography color="text.disabled" fontWeight={600} variant="body2">Fără imagini</Typography>
        </Box>
    );

    return (
        // Containerul extern — inaltimea e dictata de gridAutoRows din parinte
        <Box sx={{
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            height: "100%",
            width: "100%",
            bgcolor: "action.hover",
        }}>
            {/* Imaginea — obiect cover in container fix, nu taie sus/jos */}
            <img
                src={images[current]}
                alt={`${altBase} ${current + 1}`}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    // object-position center: centreaza imaginea in cadru
                    objectPosition: "center",
                    transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.24s ease",
                    transform: animDir
                        ? `translateX(${animDir === "left" ? "-5%" : "5%"})`
                        : "translateX(0)",
                    opacity: animDir ? 0 : 1,
                }}
            />

            {/* Gradient overlay */}
            <Box sx={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.08) 40%, transparent 65%)",
                pointerEvents: "none",
            }} />

            {/* Top-left: status chip */}
            <Box sx={{ position: "absolute", top: 18, left: 18 }}>
                {statusChip}
            </Box>

            {/* Top-right: counter */}
            <Box sx={{
                position: "absolute", top: 16, right: 16,
                bgcolor: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
                color: "white", fontSize: 12, fontWeight: 700,
                px: 1.5, py: 0.5, borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                userSelect: "none",
            }}>
                {current + 1} / {images.length}
            </Box>

            {/* Sageti navigare */}
            {images.length > 1 && (["prev", "next"] as const).map((dir) => (
                <IconButton
                    key={dir}
                    onClick={() => go(dir)}
                    aria-label={dir === "prev" ? "Imaginea anterioară" : "Imaginea următoare"}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        [dir === "prev" ? "left" : "right"]: 14,
                        transform: "translateY(-50%)",
                        width: 40, height: 40,
                        bgcolor: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                        transition: "transform 0.18s ease, box-shadow 0.18s ease",
                        "&:hover": {
                            bgcolor: "white",
                            transform: "translateY(-50%) scale(1.1)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
                        },
                    }}
                >
                    {dir === "prev"
                        ? <ChevronLeftIcon sx={{ color: "text.primary", fontSize: 22 }} />
                        : <ChevronRightIcon sx={{ color: "text.primary", fontSize: 22 }} />
                    }
                </IconButton>
            ))}

            {/* Dot indicators */}
            {images.length > 1 && (
                <Box sx={{
                    position: "absolute", bottom: 18, left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex", gap: 0.75, alignItems: "center",
                }}>
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => goTo(idx)}
                            sx={{
                                width: idx === current ? 22 : 7,
                                height: 7,
                                borderRadius: "100px",
                                bgcolor: idx === current ? "white" : "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.85)" },
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <Box sx={{
                    position: "absolute", bottom: 42, left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex", gap: 0.75,
                    px: 1.2, py: 0.8,
                    bgcolor: "rgba(0,0,0,0.38)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.12)",
                }}>
                    {images.map((url, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={url}
                            alt={`thumb-${idx + 1}`}
                            onClick={() => goTo(idx)}
                            sx={{
                                width: 46, height: 32,
                                objectFit: "cover",
                                objectPosition: "center",
                                borderRadius: "6px", cursor: "pointer",
                                border: idx === current ? "2px solid white" : "2px solid transparent",
                                opacity: idx === current ? 1 : 0.55,
                                transition: "all 0.2s ease",
                                "&:hover": { opacity: 1, transform: "scale(1.06)" },
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageCarousel;