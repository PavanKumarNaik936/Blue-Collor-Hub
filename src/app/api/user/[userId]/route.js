import connect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";



//get by user id route
export async function GET(req, { params }) {
  await connect();

  try {
    const { userId } =await params; // coming from route: /api/user/[userId]
console.log(userId)
    // Find user by ID and exclude password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify(user),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}   

//update user route


export async function PATCH(req, { params }) {
  await connect();

  try {
    const { userId } =await params;
    const body = await req.json();

    // Find existing user
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // List of top-level fields to update
    const fieldsToUpdate = [
      "phone",
      "name",
      "title",
      "profilePic",
      "whatsappNo",
      "skillCategories",
      "connections",
      "name",
      "skills",
     
    ];

    // Update only if provided and not null/empty
    fieldsToUpdate.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null && body[field] !== "") {
        user[field] = body[field];
      }
    });

    // Handle nested location update
    if (body.location) {
      // Only update provided keys in location
      const locFields = ["type", "coordinates", "city", "state", "country"];
      locFields.forEach((key) => {
        if (body.location[key] !== undefined && body.location[key] !== null && body.location[key] !== "") {
          user.location[key] = body.location[key];
        }
      });
    }


    // Save user
    const updatedUser = await user.save();

    // Return without password
    const userObj = updatedUser.toObject();
    delete userObj.password;

    return new Response(
      JSON.stringify({ message: "User updated successfully", user: userObj }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}



//delete user based on id
export async function DELETE(req, { params }) {
  await connect();

  try {
    const { userId } =await params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}