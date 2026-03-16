import type { ChangeEvent } from "react";
import { TextField } from "@mui/material";
import type { FieldConfig } from "../../types/paymentPageConfig";

interface Props {
    field:    FieldConfig;
    value:    string;
    error?:   string;
    onChange: (name: string, value: string) => void;
    disabled?: boolean;
}

const FormField = ({ field, value, error, onChange, disabled }: Props) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw       = e.target.value;
        const formatted = field.format ? field.format(raw) : raw;
        onChange(field.name, formatted);
    };

    return (
        <TextField
            id={`field-${field.name}`}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            value={value}
            onChange={handleChange}
            error={!!error}
            helperText={error ?? field.hint ?? ""}
            fullWidth
            required={field.required}
            disabled={disabled}
            autoComplete={field.autoComplete}
            inputProps={{ maxLength: field.maxLength }}
        />
    );
};

export default FormField;