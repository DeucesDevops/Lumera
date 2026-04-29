import { env } from "./config/env";
import { createApp } from "./app";

const app = createApp();

app.listen(env.API_PORT, env.API_HOST, () => {
  console.log(`Lumera API listening on http://${env.API_HOST}:${env.API_PORT}`);
});
