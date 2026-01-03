// app/page.tsx

export const dynamic = "force-dynamic";
// OR (alternative)
// export const revalidate = 0;

import HomeClient from "./home-client";

export default async function Page() {
  // ✅ This runs on the SERVER
  // You can access cookies, headers, DB, auth here later

  return <HomeClient />;
}
