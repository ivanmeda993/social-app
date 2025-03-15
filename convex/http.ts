import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const svixHeaders = {
      "svix-id": request.headers.get("svix-id"),
      "svix-signature": request.headers.get("svix-signature"),
      "svix-timestamp": request.headers.get("svix-timestamp"),
    };

    if (
      !svixHeaders ||
      !svixHeaders["svix-id"] ||
      !svixHeaders["svix-signature"] ||
      !svixHeaders["svix-timestamp"]
    ) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let event: any;

    try {
      event = wh.verify(body, {
        "svix-id": svixHeaders["svix-id"],
        "svix-signature": svixHeaders["svix-signature"],
        "svix-timestamp": svixHeaders["svix-timestamp"],
      });
    } catch (err) {
      return new Response("Invalid svix payload", { status: 400 });
    }

    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      const email = email_addresses[0].email_address;
      const fullName = `${first_name} ${last_name}`;
      const username = email.split("@")[0];
      const image = image_url;

      try {
        await ctx.runMutation(api.users.createUser, {
          clerkId: id,
          email,
          fullName,
          image,
          username,
        });
      } catch (err) {
        return new Response("Failed to create user", { status: 500 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  }),
});

export default http;
