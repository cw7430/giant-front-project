export const formatCurrency = (value) =>
    new Intl.NumberFormat("ko-KR").format(value);

export const dateFormatter = (date) =>
    (date instanceof Date ? date : new Date(date)).toISOString().split("T")[0];

export const timeFormatter = (time) => {
    if (!time || typeof time !== "string") return "";
    const parts = time.split(":");
    return parts.slice(0, 2).join(":");
};

export const parseTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

export const addMinutesToTime = (time, minutesToAdd) => {
    const totalMinutes = parseTimeToMinutes(time) + minutesToAdd;
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}`;
};