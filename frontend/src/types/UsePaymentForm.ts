import { useState, useCallback, useRef } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FIELDS_BY_METHOD, BILLING_ADDRESS_FIELDS } from "./paymentPageConfig";
import { paymentService } from "../services/paymentService";
import type { PaymentMethodId, OrderSummary, PaymentPayload, PaymentResult } from "./paymentPageConfig";
import { pushAdminQueueNotif } from "../utils/adminNotifHelper";

type FieldErrors = Record<string, string>;
type FormState   = Record<string, string>;

interface Options {
    summary:     OrderSummary;
    apartmentId: string | null;
    onPay?:      (payload: PaymentPayload) => Promise<PaymentResult>;
    onSuccess?:  (result: PaymentResult) => void;
    onError?:    (err: string) => void;
    onBack?:     () => void;
    defaultMethod: PaymentMethodId;
    startDate:  Date | null;
    endDate:    Date | null;
    renterId:   number;
}

export const usePaymentForm = ({ summary, apartmentId, onPay, onSuccess, onError, onBack, defaultMethod, startDate, endDate, renterId }: Options) => {
    const navigate = useNavigate();

    const [method, setMethod]           = useState<PaymentMethodId>(defaultMethod);
    const [formState, setFormState]     = useState<FormState>({});
    const [errors, setErrors]           = useState<FieldErrors>({});
    const [sameAddress, setSameAddress] = useState(true);

    const [promoInput,    setPromoInput]    = useState("");
    const [appliedPromo,  setAppliedPromo]  = useState("");
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoMessage,  setPromoMessage]  = useState("");
    const [promoLoading,  setPromoLoading]  = useState(false);

    const [submitting,   setSubmitting]  = useState(false);
    const [submitted,    setSubmitted]   = useState(false);
    const [submitError,  setSubmitError] = useState("");
    const [snackOpen,    setSnackOpen]   = useState(false);
    const [summaryOpen,  setSummaryOpen] = useState(false);

    const formRef = useRef<HTMLDivElement>(null);

    const handleFieldChange = useCallback((name: string, value: string) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }, []);

    const validate = useCallback((): boolean => {
        const fields    = FIELDS_BY_METHOD[method];
        const allFields = method === "card" && !sameAddress ? [...fields, ...BILLING_ADDRESS_FIELDS] : fields;
        const newErrors: FieldErrors = {};
        let valid = true;
        for (const field of allFields) {
            const value = formState[field.name] ?? "";
            if (field.required && !value.trim()) { newErrors[field.name] = "Câmp obligatoriu"; valid = false; continue; }
            if (value.trim() && field.validate) {
                const err = field.validate(value);
                if (err) { newErrors[field.name] = err; valid = false; }
            }
        }
        setErrors(newErrors);
        if (!valid) document.getElementById(`field-${Object.keys(newErrors)[0]}`)?.focus();
        return valid;
    }, [method, formState, sameAddress]);

    const handlePromoApply = useCallback(async () => {
        if (!promoInput.trim()) return;
        setPromoLoading(true);
        const result = await paymentService.validatePromo(promoInput, summary.subtotal);
        setPromoLoading(false);
        if (result.valid) { setAppliedPromo(promoInput); setPromoDiscount(result.discount); setPromoMessage(""); }
        else { setPromoMessage(result.message); setPromoDiscount(0); }
    }, [promoInput, summary.subtotal]);

    const handlePromoRemove = useCallback(() => {
        setAppliedPromo(""); setPromoDiscount(0); setPromoMessage(""); setPromoInput("");
    }, []);

    const handleMethodChange = useCallback((id: PaymentMethodId) => {
        setMethod(id); setFormState({}); setErrors({});
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        if (!validate()) return;
        setSubmitting(true);
        const payload: PaymentPayload = {
            method, formValues: { ...formState, sameAddress },
            summary, promoCode: appliedPromo || undefined,
            apartmentId: apartmentId ? Number(apartmentId) : undefined,
            startDate: startDate ?? undefined,
            endDate:   endDate   ?? undefined,
        };
        try {
            const result = onPay ? await onPay(payload) : await paymentService.createPayment(payload, renterId);
            if (result.success) {
                setSubmitted(true);
                setSnackOpen(true);
                onSuccess?.(result);
                // Notificare admin: plata noua
                pushAdminQueueNotif("admin_new_payment", "O noua plata a fost inregistrata pe platforma.");
                setTimeout(() => navigate("/dashboard"), 2500);
            } else {
                const msg = result.error ?? "Plata a eșuat. Încearcă din nou.";
                setSubmitError(msg);
                onError?.(msg);
            }
        } catch {
            const msg = "A apărut o eroare neașteptată. Încearcă din nou.";
            setSubmitError(msg);
            onError?.(msg);
        } finally {
            setSubmitting(false);
        }
    }, [validate, method, formState, sameAddress, summary, appliedPromo, apartmentId, onPay, onSuccess, onError, navigate]);

    const handleBack = useCallback(() => { if (onBack) onBack(); else navigate(-1); }, [onBack, navigate]);

    return {
        method, formState, errors, sameAddress, setSameAddress,
        promoInput, setPromoInput, appliedPromo, promoDiscount, promoMessage, promoLoading,
        submitting, submitted, setSubmitted, submitError, setSubmitError, snackOpen, setSnackOpen, summaryOpen, setSummaryOpen,
        formRef, handleFieldChange, handleMethodChange, handlePromoApply, handlePromoRemove, handleSubmit, handleBack, startDate, endDate
    };
};