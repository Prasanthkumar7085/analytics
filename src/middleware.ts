import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

const unProtectedRoutes = ["/signin"];
function containsSubstring(inputString: string, substrings: Array<string>) {
  return substrings.some((substring) => inputString.includes(substring));
}

const isAuthenticated = (req: NextRequest) => {
  const loggedIn = req.cookies.get("user");
  if (loggedIn) return true;
  return false;
};

export default function middleware(req: NextRequest) {
  if (
    !isAuthenticated(req) &&
    containsSubstring(req.nextUrl.pathname, protectedRoutes)
  ) {
    const absoluteURL = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (
    isAuthenticated(req) &&
    unProtectedRoutes.includes(req.nextUrl.pathname)
  ) {
    const absoluteURL = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (req.nextUrl.pathname == "/") {
    const absoluteURL = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
