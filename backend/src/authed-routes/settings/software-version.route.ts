import { FastifyPluginAsync } from "fastify";

const softwareVersionRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // TODO: change the aggregated route to POST
  fastify.get("/settings/software-version", async (request, reply) => {
    const softwareVersion = process.env.SOFTWARE_VERSION || "1";
    if (!softwareVersion) {
      return reply.status(500).send({ error: "Software version not found" });
    }
    return { softwareVersion };
  });
};

export default softwareVersionRoute;
