import connect from "../../../../../lib/mongodb";
import Conversation from "../../../../../models/Conversation";

export async function POST(req) {
  await connect();

  try {
    const { participants } = await req.json();
    if (!participants || participants.length < 2) {
      return new Response(JSON.stringify({ error: "Participants must be at least 2" }), { status: 400 });
    }

    const sortedParticipants = participants.map(id => id.toString()).sort();

    let conversation = await Conversation.findOne({ participants: sortedParticipants });

    if (!conversation) {
      conversation = await Conversation.create({ participants: sortedParticipants });
    }

    return new Response(JSON.stringify(conversation), { status: 200 });
  } catch (err) {
    console.error("Error creating/fetching conversation:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
