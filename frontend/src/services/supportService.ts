import axios from "axios";

const BASE = "http://localhost:5062/api/support";

export interface SupportCreateDto {
    email:   string;
    subject: string;
    message: string;
}

export const supportService = {
    create: (data: SupportCreateDto): Promise<string> =>
        axios.post<string>(BASE, data).then(r => r.data),
};
