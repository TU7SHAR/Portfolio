import { NextResponse } from "next/server";

// One canonical, lowercase URL per page: /About → /about, /Projects/CPP → /projects/cpp.
// (Old /ContactMe links are handled by a redirect in next.config.js.)
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (pathname === lower) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // pages only — skip API routes, Next internals and files with an extension
  matcher: ["/((?!api/|_next/|.*\\.[\\w]+$).*)"],
};
