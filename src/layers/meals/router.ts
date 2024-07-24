import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { checkSessionIdExist } from "../../interceptors/check-session-id-exist";
import { prisma } from "../../lib/prisma";

export async function mealsRouter(app: FastifyInstance) {
  app.addHook("preHandler", checkSessionIdExist)

  app.withTypeProvider<ZodTypeProvider>().post(
    "/meals",
    {
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string(),
          date: z.coerce.date(),
          isOnDiet: z.boolean()
        })
      }
    },
    async (request, reply) => {
      const { name, description, date, isOnDiet } = request.body
      const sessionId = request.cookies.sessionId

      const user = await prisma.user.findFirst({
        select: {
          id: true
        },
        where: {
          sessionId
        }
      })

      if(!user) {
        throw new Error('User not found')
      }

      await prisma.meal.create({
        data: {
          name,
          description,
          date,
          isOnDiet,
          userId: user.id
        }
      })

      return reply.status(201).send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    "/meals/:mealId",
    {
      schema: {
        params: z.object({
          mealId: z.string().uuid()
        }),
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          date: z.coerce.date().optional(),
          isOnDiet: z.boolean().optional()
        })
      }
    },
    async (request, reply) => {
      const { mealId } = request.params
      const { name, description, date, isOnDiet } = request.body
      const sessionId = request.cookies.sessionId

      const user = await prisma.user.findFirst({
        select: {
          id: true
        },
        where: {
          sessionId
        }
      })

      if(!user) {
        throw new Error('User not found')
      }

      await prisma.meal.update({
        where: {
          id: mealId,
          userId: user.id
        },
        data: {
          name,
          description,
          date,
          isOnDiet
        }
      })

      return reply.send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/meals/:mealId",
    {
      schema: {
        params: z.object({
          mealId: z.string().uuid()
        }),
      }
    },
    async (request, reply) => {
      const { mealId } = request.params
      const sessionId = request.cookies.sessionId

      const user = await prisma.user.findFirst({
        select: {
          id: true
        },
        where: {
          sessionId
        }
      })

      if(!user) {
        throw new Error('User not found')
      }
      
      await prisma.meal.delete({
        where: {
          id: mealId,
          userId: user.id
        },
      })

      return reply.send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    "/meals/:mealId",
    {
      schema: {
        params: z.object({
          mealId: z.string().uuid()
        }),
      }
    },
    async (request, reply) => {
      const { mealId } = request.params
      const sessionId = request.cookies.sessionId

      const user = await prisma.user.findFirst({
        select: {
          id: true
        },
        where: {
          sessionId
        }
      })

      if(!user) {
        throw new Error('User not found')
      }

      const meal = await prisma.meal.findUnique({
        where: {
          id: mealId,
          userId: user.id
        },
      })

      if(!meal) {
        throw new Error('Meal not found')
      }

      return reply.send({
        data: {
          meal
        }
      })
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    "/meals",
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const user = await prisma.user.findFirst({
        select: {
          id: true
        },
        where: {
          sessionId
        }
      })

      if(!user) {
        throw new Error('User not found')
      }

      const meals = await prisma.meal.findMany({
        where: {
          userId: user.id
        },
      })

      return reply.send({
        data: {
          meals
        }
      })
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    "/meals/metrics",
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const user = await prisma.user.findFirst({
        select: {
          id: true
        },
        where: {
          sessionId
        }
      })

      if(!user) {
        throw new Error('User not found')
      }

      const meals = await prisma.meal.findMany({
        where: {
          userId: user.id
        },
      })


      const totalMeals = meals.length 
      const mealsWithinDiet = meals.filter(meal => meal.isOnDiet === true)
      const mealsOutsideDiet = meals.filter(meal => meal.isOnDiet === false)
      const { bestStreakWithinDiet } = meals.reduce(
        (acumulator, meal) => {
          if (meal.isOnDiet) {
            acumulator.currentSequence += 1
          } else {
            acumulator.currentSequence = 0
          }

          if (acumulator.currentSequence > acumulator.bestStreakWithinDiet) {
            acumulator.bestStreakWithinDiet = acumulator.currentSequence
          }

          return acumulator
        },
        { bestStreakWithinDiet: 0, currentSequence: 0 },
      )


      return reply.send({
        data: {
          totalMeals,
          mealsWithinDiet,
          mealsOutsideDiet,
          bestStreakWithinDiet
        }
      })
    }
  )
}