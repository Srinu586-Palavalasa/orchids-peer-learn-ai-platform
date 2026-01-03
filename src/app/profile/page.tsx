import { cookies } from "next/headers";
import ProfileClient from "./profile-client";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  cookies(); // 🔥 Forces dynamic rendering
  return <ProfileClient />;
}
