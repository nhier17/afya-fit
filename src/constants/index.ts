import { GraduationCap, School } from "lucide-react";

export const USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.USER,
        label: "User",
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.ADMIN,
        label: "Admin",
        icon: School,
    },
];

export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;