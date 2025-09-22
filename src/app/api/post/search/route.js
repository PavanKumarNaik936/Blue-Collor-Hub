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

    // Step 1: Build filter for Users
    const userFilter = { $or: [] };
    if (location) userFilter.$or.push({ "location.district": location });
    if (skillCategory) userFilter.$or.push({ skillCategories: skillCategory });
    if (subSkill) userFilter.$or.push({ skills: subSkill });

    // Step 2: Find users matching the filter
    const matchingUsers = await User.find(userFilter).select("_id");
    const userIds = matchingUsers.map(u => u._id);

    // Step 3: Build filter for Posts
    const postFilter = { $or: [] };
    if (skillCategory) postFilter.$or.push({ skillCategories: skillCategory });
    if (subSkill) postFilter.$or.push({ skills: subSkill });
    if (userIds.length > 0) postFilter.$or.push({ userId: { $in: userIds } });

    // Step 4: If no filters are provided, return all posts
    const hasFilters = location || skillCategory || subSkill;
    const posts = hasFilters
      ? await Post.find(postFilter)
          .sort({ createdAt: -1 })
          .populate("userId", "name location skillCategories skills")
      : await Post.find()
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
