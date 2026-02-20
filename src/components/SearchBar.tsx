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
                background: "#0C2529",
                border: "1px solid #12383D",
                borderRadius: 4,
                p: 2,
                mb: 8,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                "&:hover, &:focus-within": {
                    borderColor: "#00E0C6",
                    background: "#0F2F34",
                    boxShadow: "0 0 15px rgba(0, 224, 198, 0.25)",
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
                            <SearchIcon sx={{ color: "#00E0C6", fontSize: 26 }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& input": {
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#E6F7F5",
                        "&::placeholder": {
                            color: "#5C7A77",
                            opacity: 1,
                        },
                    },
                }}
            />

            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                    background: "linear-gradient(135deg, #00E0C6, #00BFA6)",
                    color: "#071A1D",
                    textTransform: "none",
                    fontWeight: 800,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: "0 0 12px rgba(0, 224, 198, 0.35)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #00FFF0, #00E0C6)",
                        boxShadow: "0 0 20px rgba(0, 224, 198, 0.5)",
                    },
                }}
            >
                Caută
            </Button>
        </Paper>
    );
};

export default memo(SearchBar);
