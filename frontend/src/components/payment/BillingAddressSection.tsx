import { Box, Typography, Checkbox, FormControlLabel, Collapse } from "@mui/material";
import { BILLING_ADDRESS_FIELDS, LABELS } from "../../types/paymentPageConfig";
type FieldErrors = Record<string, string | undefined>;
import FormField from "./FormField.tsx";

interface Props {
    formState:    Record<string, string>;
    errors:       FieldErrors;
    sameAddress:  boolean;
    onSameChange: (v: boolean) => void;
    onChange:     (name: string, value: string) => void;
    disabled?:    boolean;
}

const BillingAddressSection = ({ formState, errors, sameAddress, onSameChange, onChange, disabled }: Props) => (
    <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} mb={1}>{LABELS.billingAddress}</Typography>
        <FormControlLabel
            control={<Checkbox checked={sameAddress} onChange={(e) => onSameChange(e.target.checked)} disabled={disabled} color="primary" />}
            label={<Typography variant="body2">{LABELS.sameAsProfile}</Typography>}
        />
        <Collapse in={!sameAddress}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mt: 2 }}>
                {BILLING_ADDRESS_FIELDS.map((field, i) => (
                    <Box key={field.name} sx={{ gridColumn: i === 0 ? "1 / -1" : "auto" }}>
                        <FormField
                            field={field}
                            value={formState[field.name] ?? ""}
                            error={errors[field.name]}
                            onChange={onChange}
                            disabled={disabled}
                        />
                    </Box>
                ))}
            </Box>
        </Collapse>
    </Box>
);

export default BillingAddressSection;