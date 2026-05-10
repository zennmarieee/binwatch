import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify requester is admin
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use service role — bypasses RLS entirely
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { email, password, full_name, role } = await request.json();

  // Create auth user
  const { data: newUser, error: createError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create user" },
      { status: 500 }
    );
  }

  const newUserId = newUser.user.id;

  // Wait for trigger to fire
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Check if profile exists
  const { data: existingProfile } = await adminSupabase
    .from("profiles")
    .select("id")
    .eq("id", newUserId)
    .single();

  let profileError;

  if (existingProfile) {
    // Profile exists — update it
    const { error } = await adminSupabase
      .from("profiles")
      .update({ full_name, role })
      .eq("id", newUserId);
    profileError = error;
  } else {
    // Profile doesn't exist yet — insert it
    const { error } = await adminSupabase
      .from("profiles")
      .insert({ id: newUserId, full_name, role });
    profileError = error;
  }

  if (profileError) {
    console.error("Profile error:", JSON.stringify(profileError));
    return NextResponse.json(
      { error: `Profile update failed: ${profileError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}