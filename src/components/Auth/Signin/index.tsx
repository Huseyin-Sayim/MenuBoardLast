import Link from "next/link";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>




      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Hesabınız yok mu?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </>
  );
}
