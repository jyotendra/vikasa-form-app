import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { farmerDetailDto } from "./farmer-detail.model";
import { AddFarmerDetailService } from "./farmer-detail.service";

const farmerDetailForm: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.post("/form/farmer-detail", async (request, reply) => {
    const body = request.body as farmerDetailDto;
    const userCognitoSub = request.userCognitoSub;
    const service = new AddFarmerDetailService(
      fastify.dynamodb,
      userCognitoSub!
    );
    service.addFarmerDetail(body).catch((error) => {
      fastify.log.error(error, "Error adding farmer detail");
      reply.status(500).send({
        error: "Failed to add farmer detail",
        details: error.message,
      });
    });
    reply.status(201).send({
      message: "Farmer detail form submitted successfully",
      data: body,
    });
  });

  fastify.get("/form/farmer-detail", async (request, reply) => {
    reply.send({
      message: "Dummy GET endpoint for farmer detail",
      data: {},
    });
  });
};

export default farmerDetailForm;
