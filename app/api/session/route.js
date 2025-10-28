import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  console.log(session);
  
  if (!session) {
    return Response.json({ status: "no session" });
  }

  return Response.json({
    status: "active",
    user: session.user,
    expires: session.expires,
  });
}
