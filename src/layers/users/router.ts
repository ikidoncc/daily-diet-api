import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { prisma } from "../../lib/prisma"

export async function usersRouter(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string(),
        })
      }
    },
    async (request, reply) => {
      const { name, email } = request.body

      const userAlreadyExist = await prisma.user.findUnique({
        where: {
          email
        }
      })

      if(userAlreadyExist) {
        throw new Error("User already exist")
      }

      let sessionId = request.cookies.sessionId

      if(!sessionId) {
        const SEVEN_DAYS = 60 * 60 * 24 * 7
        
        sessionId = crypto.randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: "/",
          maxAge: SEVEN_DAYS
        })
      }

      await prisma.user.create({
        data: {
          name,
          email,
          sessionId
        }
      })

      return reply.status(201).send()
    }
  )
}