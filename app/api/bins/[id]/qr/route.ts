import { createClient } from "@/lib/supabase/server";
import { generateQRCode } from "@/lib/qr";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate QR code
  const qrCode = await generateQRCode(id);

  // Save to bin
  const { error } = await supabase
    .from("bins")
    .update({ qr_code: qrCode })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to save QR code" },
      { status: 500 }
    );
  }

  return NextResponse.json({ qrCode });
}