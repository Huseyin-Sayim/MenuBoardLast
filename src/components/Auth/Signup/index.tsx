import SignupWithPassword from "@/components/Auth/SignupWithPassword";
import Link from "next/link";

export default function Signup() {
  return (
    <>
      <div>
        <SignupWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Zaten bir hesabınız var mı?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Giriş Yap
          </Link>
        </p>
      </div>
    </>
  );
}
