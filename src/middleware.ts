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
const getUserIdIfSalesRep = (req: NextRequest) => {
  const userId = req.cookies.get("user_ref_id")?.value;
  return userId;
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
    if (req.cookies.get("user")?.value == "MARKETER") {
      const absoluteURL = new URL(
        `/sales-representatives/${getUserIdIfSalesRep(req)}`,
        req.nextUrl.origin
      );
      return NextResponse.redirect(absoluteURL.toString());
    }
    const absoluteURL = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (req.nextUrl.pathname == "/") {
    const absoluteURL = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
