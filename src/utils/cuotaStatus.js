import { COLORS } from "@/constants/colors";

export const getCuotaStatus = (dueData, isPaid) => {
    if (isPaid) return COLORS.success; // Verde - pagado
    const today = new Date();
    const dueDate = new Date(dueData);
    const timeDiff = dueDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return COLORS.danger; // Rojo - vencido
    if (daysDiff <= 3) return COLORS.warning; // Amarillo - por vencer
    return COLORS.primary; // Azul - vigente
}
