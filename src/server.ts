import cookie from "@fastify/cookie";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { mealsRouter } from "./layers/meals/router";
import { usersRouter } from "./layers/users/router";
import { env } from "./lib/env";

async function Main() {
  const app = fastify()

  app.register(cookie, {
    secret: env.API_COOKIE_SECRET
  })
  
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(mealsRouter)
  app.register(usersRouter)

  await app.listen({ port: env.API_PORT })
  console.log(`\n\tDaily Diet API\n\thttp://localhost:${env.API_PORT}\n`)
}

Main()