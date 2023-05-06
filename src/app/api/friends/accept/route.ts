import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { database } from "@/lib/database";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }

    const hasFriendRequest = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (!hasFriendRequest) {
      return new Response("You don't have pending request from this user.", {
        status: 400,
      });
    }

    await database.sadd(`user:${session.user.id}:friends`, idToAdd);
    await database.sadd(`user:${idToAdd}:friends`, session.user.id);

    await database.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}