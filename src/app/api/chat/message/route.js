import Message from "../../../../../models/Message";
import connect from "../../../../../lib/mongodb";
export async function POST(req) {
  await connect();
  try {
    const { conversationId, sender, receiver, text } = await req.json();

    if (!conversationId || !sender || !receiver || !text) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const message = await Message.create({ conversationId, sender, receiver, text });

    return new Response(JSON.stringify(message), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
