import connect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function GET(req) {
  await connect();
  const { searchParams } = new URL(req.url);
  const user1Id = searchParams.get("user1");
  const user2Id = searchParams.get("user2");

  if (!user1Id || !user2Id) {
    return new Response(JSON.stringify({ error: "Both user1 and user2 are required" }), { status: 400 });
  }

  try {
    const user1 = await User.findById(user1Id);

    if (!user1) {
      return new Response(JSON.stringify({ error: "User1 not found" }), { status: 404 });
    }

    const connected = Array.isArray(user1.connections) && user1.connections.includes(user2Id);

    return new Response(JSON.stringify({ connected }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
