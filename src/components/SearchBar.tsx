import {
    Paper,
    TextField,
    Button,
    InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { memo, useState, useCallback } from "react";
import { colors } from "../theme/gradients.ts";

interface Props {
    onSearch: (value: string) => void;
}

const SearchBar = ({ onSearch }: Props) => {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = useCallback(() => {
        onSearch(inputValue.trim());
    }, [inputValue, onSearch]);

    return (
        <Paper
            elevation={1}
            sx={{
                mx: "auto",
                width: "100%",
                maxWidth: "800px",
                p: 1.5,
                mb: 8,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.3s ease",
                border: `1px solid ${colors.border}`,
                "&:hover, &:focus-within": {
                    borderColor: "primary.main",
                    boxShadow: `0 0 0 3px ${colors.primaryAlpha10}`,
                },
            }}
        >
            <TextField
                placeholder="Caută după adresă sau preț..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                fullWidth
                variant="standard"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch();
                    }
                }}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "primary.main", fontSize: 26 }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& input": {
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "text.primary",
                        "&::placeholder": { color: "text.disabled", opacity: 1 },
                    },
                }}
            />

            <Button
                variant="contained"
                onClick={handleSearch}
                sx=
                    {{  px: 4, 
                        borderRadius: 2.5, 
                        whiteSpace: "nowrap" }}
            >
                Caută
            </Button>
        </Paper>
    );
};

export default memo(SearchBar);
