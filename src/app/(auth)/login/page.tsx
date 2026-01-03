// app/login/page.tsx

import { cookies } from "next/headers";
import LoginClient from "./login-client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  // 👇 This single line FORCES dynamic rendering
  cookies();

  return <LoginClient />;
}
