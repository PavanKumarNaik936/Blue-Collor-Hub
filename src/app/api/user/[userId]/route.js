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
    const { userId } = params;
    const body = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Fields to update
    const fieldsToUpdate = [
      "name",
      "phone",
      "title",
      "profilePic",
      "coverImage",
      "whatsappNo",
      "skillCategories",
      "skills",
      "connections",
    ];

    fieldsToUpdate.forEach((field) => {
      if (body[field] !== undefined && body[field] !== null) {
        user[field] = body[field];
      }
    });

    // Nested location update
    if (body.location) {
      const locFields = ["type", "coordinates", "state", "district", "town"];
      locFields.forEach((key) => {
        if (body.location[key] !== undefined && body.location[key] !== null) {
          user.location[key] = body.location[key];
        }
      });
    }

    // Save and return without password
    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    return new Response(
      JSON.stringify({ message: "User updated successfully", user: userObj }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
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