import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/sales-representatives",
  "/case-types",
  "/sales-representatives/",
  "/insurances",
  "/facilities",
];

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

const getIsSalesRepAndAccessingOtherPageOrNot = (req: NextRequest) => {
  return (
    req.cookies.get("user")?.value == "MARKETER" &&
    !req.nextUrl.pathname?.includes("/sales-representatives/") &&
    !req.nextUrl.pathname?.includes("/insurances/") &&
    !req.nextUrl.pathname?.includes("/facilities/")
  );
};
const getIsManagerAndAccessingOtherPageOrNot = (req: NextRequest) => {
  // return false;
  return (
    req.cookies.get("user")?.value == "HOSPITAL_MARKETING_MANAGER" &&
    !req.nextUrl.pathname?.includes("/sales-representatives") &&
    !req.nextUrl.pathname?.includes("/dashboard") &&
    !req.nextUrl.pathname?.includes("/insurances/") &&
    !req.nextUrl.pathname?.includes("/facilities/")

  );
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
    } else {
      const absoluteURL = new URL("/dashboard", req.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  }
  if (req.nextUrl.pathname == "/") {
    const absoluteURL = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (
    containsSubstring(req.nextUrl.pathname, protectedRoutes) &&
    getIsSalesRepAndAccessingOtherPageOrNot(req)
  ) {
    const absoluteURL = new URL(
      `/sales-representatives/${getUserIdIfSalesRep(req)}`,
      req.nextUrl.origin
    );
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (
    containsSubstring(req.nextUrl.pathname, protectedRoutes) &&
    getIsManagerAndAccessingOtherPageOrNot(req)
  ) {
    const absoluteURL = new URL(`/dashboard`, req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
