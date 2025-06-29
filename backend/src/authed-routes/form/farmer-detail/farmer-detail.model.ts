import { z } from "zod";

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

export type FarmerDetailForm = {
  farmCategory: FarmCategory;
  farmerSocialCategory: FarmerSocialCategory;
  totalFamilyMembers: number;
  totalMaleMembers: number;
};

export const basicFarmerDetailsSchema = z.object({
  farmerName: z.string().min(1, "Farmer name is required"),
  relationType: z.nativeEnum(RelationType),
  relationName: z.string().min(1, "Relation name is required"),
  cluster: z.string().min(1, "Cluster is required"),
  village: z.string().min(1, "Village is required"),
  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits long"),
});
export type basicFarmerDetailType = z.infer<typeof basicFarmerDetailsSchema>;

export const farmerDetailFormSchema = z.object({
  farmCategory: z.nativeEnum(FarmCategory),
  farmerSocialCategory: z.nativeEnum(FarmerSocialCategory),
  totalFamilyMembers: z
    .number()
    .min(1, "Total family members is required")
    .max(20, "Total family members cannot exceed 20"),
  totalMaleMembers: z
    .number()
    .min(0, "Total male members cannot be negative")
    .max(20, "Total male members cannot exceed 20"),
});

export type farmerDetailFormType = z.infer<typeof farmerDetailFormSchema>;

export type farmerDetailDto = {
  basicFarmerDetails: basicFarmerDetailType;
  detailedFarmerInfo: FarmerDetailForm;
};
