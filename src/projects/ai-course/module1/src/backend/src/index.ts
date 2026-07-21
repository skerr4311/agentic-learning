import { buildApp } from "./app";

const start = async () => {
  const app = buildApp({ logger: true });

  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${port}`);
    console.log(`API documentation available at http://localhost:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
