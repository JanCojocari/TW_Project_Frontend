// components/listing/ListingsPagination.tsx
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
    currentPage:  number;
    totalPages:   number;
    pageNumbers:  number[];
    onGoToPage:   (page: number) => void;
    onPrev:       () => void;
    onNext:       () => void;
}

export default function ListingsPagination({ currentPage, totalPages, pageNumbers, onGoToPage, onPrev, onNext }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 12 }}>
            <Button
                variant="outlined"
                onClick={onPrev}
                disabled={currentPage === 1}
                sx={{ px: 3, borderRadius: 1.5 }}
            >
                {t("listings.prev")}
            </Button>

            {pageNumbers.map(pageNumber => (
                <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "contained" : "outlined"}
                    onClick={() => onGoToPage(pageNumber)}
                    sx={{ minWidth: "50px", height: "50px", borderRadius: 1.5, fontWeight: pageNumber === currentPage ? 900 : 400 }}
                >
                    {pageNumber}
                </Button>
            ))}

            <Button
                variant="outlined"
                onClick={onNext}
                disabled={currentPage === totalPages}
                sx={{ px: 3, borderRadius: 1.5 }}
            >
                {t("listings.next")}
            </Button>
        </Box>
    );
}
