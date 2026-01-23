import { redirect } from "next/navigation"

export default function RegisterPage() {
  // Redirect to login page with register tab
  redirect("/login?tab=register")
}
