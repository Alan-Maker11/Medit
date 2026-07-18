import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");
  const isDriverRoute = request.nextUrl.pathname.startsWith("/driver") && !request.nextUrl.pathname.startsWith("/driver/login");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase env vars missing in middleware: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is unset."
    );
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();

    if (isAdminRoute && !data.user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (isDriverRoute && !data.user) {
      const url = request.nextUrl.clone();
      url.pathname = "/driver/login";
      return NextResponse.redirect(url);
    }

    // A logged-in user who is ALSO a driver-account (i.e. a driver, not staff) must never
    // reach the admin panel — being authenticated is not enough, staff access must be explicit.
    if (data.user && (isAdminRoute || isLoginRoute)) {
      const { data: driverAccount } = await supabase
        .from("driver_accounts")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (driverAccount) {
        const url = request.nextUrl.clone();
        url.pathname = "/driver/dashboard";
        return NextResponse.redirect(url);
      }

      if (isLoginRoute) {
        const adminUrl = request.nextUrl.clone();
        adminUrl.pathname = "/admin";
        return NextResponse.redirect(adminUrl);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Supabase middleware auth check failed:", error);
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (isDriverRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/driver/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }
}
