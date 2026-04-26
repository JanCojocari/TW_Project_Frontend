// components/common/DatePickerProvider.tsx
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

interface Props {
    children: React.ReactNode;
}

const DatePickerProvider = ({ children }: Props) => (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        {children}
    </LocalizationProvider>
);

export default DatePickerProvider;