import connect from "../../../../../lib/mongodb";
import Post from "../../../../../models/Post";
import User from "../../../../../models/User";

export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get("location");
    const skillCategory = searchParams.get("skillCategory");
    const subSkill = searchParams.get("subSkill");

    // Build user filter dynamically
    const userFilter = {};
    const userConditions = [];
    if (location) userConditions.push({ "location.district": location });
    if (skillCategory) userConditions.push({ skillCategories: skillCategory });
    if (subSkill) userConditions.push({ skills: subSkill });
    if (userConditions.length > 0) userFilter.$or = userConditions;

    // Find matching users
    const matchingUsers = await User.find(userFilter).select("_id");
    const userIds = matchingUsers.map(u => u._id);

    // Build post filter
    const postFilter = {};
    if (userIds.length > 0) postFilter.userId = { $in: userIds };

    // Fetch posts
    const posts = await Post.find(postFilter)
      .sort({ createdAt: -1 })
      .populate("userId", "name location skillCategories skills");

    return new Response(JSON.stringify({ success: true, posts }), { status: 200 });

  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
