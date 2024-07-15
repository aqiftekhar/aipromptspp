import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const prompts = await Prompt.find({
      creator: params.id,
    }).populate("creator");
    // console.log("Posts = ",JSON.stringify(prompts));
    
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to Fetch all Prompts", { status: 500 });
  }
};
