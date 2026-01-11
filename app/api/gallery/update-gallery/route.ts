import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    revalidateTag("gallery");
    revalidateTag("banners");
    return new Response("Revalidated successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
