import {
    Paper,
    TextField,
    Button,
    InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { memo, useState, useCallback } from "react";

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
            elevation={0}
            sx={{
                mx: "auto",
                width: "100%",
                maxWidth: "800px",
                background: "white",
                border: "2px solid #e5e7eb",
                borderRadius: 4,
                p: 2,
                mb: 8,
                display: "flex",
                alignItems: "center",
                gap: 2,
                willChange: "box-shadow, border-color",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                boxShadow: "0 10px 30px rgba(37, 99, 235, 0.08)",
                "&:hover, &:focus-within": {
                    borderColor: "#2563eb",
                    boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)",
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
                            <SearchIcon sx={{ color: "#2563eb", fontSize: 26 }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& input": {
                        fontSize: "16px",
                        fontWeight: 500,
                    },
                }}
            />

            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    borderRadius: 3,
                }}
            >
                Caută
            </Button>
        </Paper>
    );
};

export default memo(SearchBar);
