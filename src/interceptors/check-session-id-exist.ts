import { FastifyRequest } from "fastify";

export async function checkSessionIdExist(request: FastifyRequest) {
  const sessionId = request.cookies.sessionId
      
  if(!sessionId) {
    throw new Error("Unauthorized")
  }
}