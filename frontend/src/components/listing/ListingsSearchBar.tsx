// components/listing/ListingsSearchBar.tsx
import { Box, Badge, Button } from "@mui/material";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";

interface Props {
    activeFilterCount: number;
    onSearch:          (query: string) => void;
    onOpenFilter:      () => void;
}

export default function ListingsSearchBar({ activeFilterCount, onSearch, onOpenFilter }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{ width: "100%", mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: 1 }}>
                <SearchBar onSearch={onSearch} />
            </Box>
            <Badge badgeContent={activeFilterCount} color="primary" overlap="circular">
                <Button
                    variant={activeFilterCount > 0 ? "contained" : "outlined"}
                    onClick={onOpenFilter}
                    startIcon={<FilterListIcon />}
                    sx={{ px: 3, borderRadius: 2.5, fontWeight: 700, whiteSpace: "nowrap" }}
                >
                    {t("listings.filters")}
                </Button>
            </Badge>
        </Box>
    );
}
