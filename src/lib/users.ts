import bcrypt from "bcryptjs";
import type { Role } from "@/types";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
}

// Demo accounts only. Replace with a real database + signup flow in production.
const USERS: StoredUser[] = [
  {
    id: "u_1",
    name: "Alex Admin",
    email: "admin@example.com",
    role: "admin",
    passwordHash: bcrypt.hashSync("Admin@123", 10),
  },
  {
    id: "u_2",
    name: "Vera Viewer",
    email: "viewer@example.com",
    role: "viewer",
    passwordHash: bcrypt.hashSync("Viewer@123", 10),
  },
];

export function findUserByEmail(email: string) {
  return USERS.find((u) => u.email === email.trim().toLowerCase());
}
