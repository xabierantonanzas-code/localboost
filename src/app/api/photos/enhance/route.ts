import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoId } = await request.json();

    // Set photo to processing
    await supabase
      .from("photos")
      .update({ enhancement_status: "processing" })
      .eq("id", photoId);

    if (process.env.REPLICATE_API_TOKEN) {
      // Call Replicate Real-ESRGAN
      try {
        const { data: photo } = await supabase
          .from("photos")
          .select("original_url")
          .eq("id", photoId)
          .single();

        if (!photo) throw new Error("Photo not found");

        const replicateRes = await fetch(
          "https://api.replicate.com/v1/predictions",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              version:
                "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
              input: { image: photo.original_url, scale: 2 },
            }),
          }
        );
        const prediction = await replicateRes.json();

        // Poll for result
        let result = prediction;
        while (
          result.status !== "succeeded" &&
          result.status !== "failed"
        ) {
          await new Promise((r) => setTimeout(r, 2000));
          const pollRes = await fetch(
            `https://api.replicate.com/v1/predictions/${result.id}`,
            {
              headers: {
                Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              },
            }
          );
          result = await pollRes.json();
        }

        if (result.status === "succeeded") {
          await supabase
            .from("photos")
            .update({
              enhanced_url: result.output,
              enhancement_status: "completed",
            })
            .eq("id", photoId);

          return NextResponse.json({
            enhanced_url: result.output,
            status: "completed",
          });
        }

        throw new Error("Enhancement failed");
      } catch {
        await supabase
          .from("photos")
          .update({ enhancement_status: "failed" })
          .eq("id", photoId);

        return NextResponse.json(
          { error: "Enhancement failed" },
          { status: 500 }
        );
      }
    }

    // Dev fallback: mark as completed with original URL
    const { data: photo } = await supabase
      .from("photos")
      .select("original_url")
      .eq("id", photoId)
      .single();

    await supabase
      .from("photos")
      .update({
        enhanced_url: photo?.original_url ?? null,
        enhancement_status: "completed",
      })
      .eq("id", photoId);

    return NextResponse.json({
      enhanced_url: photo?.original_url,
      status: "completed",
    });
  } catch (err) {
    console.error("Photo enhance error:", err);
    return NextResponse.json(
      { error: "Failed to enhance photo" },
      { status: 500 }
    );
  }
}
