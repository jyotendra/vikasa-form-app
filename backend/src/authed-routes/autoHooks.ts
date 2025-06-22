import { FastifyPluginAsync } from "fastify";

// Extend FastifyRequest to include userCognitoSub
declare module "fastify" {
  interface FastifyRequest {
    userCognitoSub?: string;
  }
}

/**
 * This middleware checks for auth token in the incoming request
 * if not present, it will return a 401 Unauthorized response.
 * else it will verify the token with cognito service and upon successful
 * verification, it will allow the request to proceed, else it will return a 403 Forbidden response.
 * Also, on success, it will add a new property `userCognitoSub` to the request object
 * which contains the Cognito user sub (user ID).
 */
const authedRoutesMiddleware: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }
    const token = authHeader.split(" ");
    if (token.length !== 2 || token[0] !== "Bearer") {
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }
    const accessToken = token[1];
    try {
      fastify.log.info(`Verifying token: ${accessToken}`);
      const decodedToken = await fastify.cognitoVerifier.verify(accessToken);
      request.userCognitoSub = decodedToken.sub; // Add user sub to request object
      fastify.log.info(`User authenticated: ${request.userCognitoSub}`);
    } catch (err) {
      fastify.log.error(err, "Token verification failed");
      reply.status(401).send({ error: "Unauthorized" });
      return;
    }

    // You can add authentication, validation, etc. here
  });
};

export default authedRoutesMiddleware;
