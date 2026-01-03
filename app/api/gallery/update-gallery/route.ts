import { revalidateTag } from "next/cache";

export default function POST(req: Request) {
    
  revalidateTag("gallery");
  return new Response(
    JSON.stringify({ message: "Gallery updated successfully" }),
    { status: 200 }
  );
}
