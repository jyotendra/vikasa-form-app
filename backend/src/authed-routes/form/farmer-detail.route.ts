import { FastifyPluginAsync } from "fastify";

export enum RelationType {
  WO = "w/o",
  DO = "d/o",
  SO = "s/o",
}

export enum FarmCategory {
  LANDLESS = "landless",
  MARGINAL = "marginal",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum FarmerSocialCategory {
  SC = "SC",
  ST = "ST",
  OC = "OC",
  BC = "BC",
}

type FarmerDetail = {
  farmerName: string;
  relationType: RelationType;
  relationName: string;
  cluster: string;
  village: string;
  mobileNumber: string;
  farmCategory: FarmCategory;
  farmerSocialCategory: FarmerSocialCategory;
  totalFamilyMembers: number;
  totalMaleMembers: number;
};

const farmerDetailForm: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/form/farmer-detail", async (request, reply) => {
    return [
      {
        abc: "abc",
        def: "def",
      },
      {
        ghi: "ghi",
        jkl: "jkl",
      },
      {
        mno: "mno",
        pqr: "pqr",
      },
    ];
  });

  fastify.post("/form/farmer-detail", async (request, reply) => {
    const body = request.body as FarmerDetail;
    fastify.log.info({ body }, "Received farmer detail form data ");
    reply.status(201).send({
      message: "Farmer detail form submitted successfully",
      data: body,
    });
  });
};

export default farmerDetailForm;
