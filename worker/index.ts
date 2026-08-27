import { Hono } from "hono";
import type { HonoEnv } from "./types";
import workouts from "./routes/workouts";
import history from "./routes/history";
import templates from "./routes/templates";

const app = new Hono<HonoEnv>();

app.route("/api/workouts", workouts);
app.route("/api/history", history);
app.route("/api/templates", templates);

app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "not found" }, 404);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
