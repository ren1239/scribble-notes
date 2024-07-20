import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

export default async function NavBar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b gorder-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-semibold">
            Scribble.
          </Link>

          {/* Add Mobile Navbar */}
          <div className="hidden items-center space-x-4 sm:flex ">
            <>
              {user ? <p>Welcome {user.given_name}!</p> : null}

              <Link
                href={"/pricing"}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>

              {/* Signin / Sign out */}

              {user ? (
                <LogoutLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign out
                </LogoutLink>
              ) : (
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </LoginLink>
              )}

              {/* Get started / Dashboard */}
              {user ? (
                <Link
                  href={"/dashboard"}
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>
              ) : (
                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Start for Free
                </RegisterLink>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
