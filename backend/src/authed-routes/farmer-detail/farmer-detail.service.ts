import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { farmerDetailDto } from "./farmer-detail.model";
import { dynamoDbConsts } from "../../config/consts";
import { FormType } from "./form-type";

export class AddFarmerDetailService {
  private dbClient: DynamoDBDocumentClient;
  private userCognitoSub: string;

  constructor(dbClient: DynamoDBDocumentClient, userCognitoSub: string) {
    this.dbClient = dbClient;
    this.userCognitoSub = userCognitoSub;
  }

  getPk(): string {
    return `FORM_SUBMISSION#${FormType.FARMER_DETAIL}#${this.userCognitoSub}`;
  }

  getGsi1Sk(): string {
    return `FORM#${FormType.FARMER_DETAIL}#${this.userCognitoSub}`;
  }

  async addFarmerDetail(farmerDetail: farmerDetailDto): Promise<any> {
    const datetime = new Date().toISOString();
    const params = {
      TableName: dynamoDbConsts.tableName,
      Item: {
        PK: this.getPk(),
        SK: datetime,
        gsi1_sk_form_update_at: this.getGsi1Sk(),
        target_identifier: farmerDetail.basicFarmerDetails.mobileNumber, // TODO: maybe change this to aadhar later
        form_type: FormType.FARMER_DETAIL,
        form_data: farmerDetail,
        created_by: this.userCognitoSub,
        updated_by: this.userCognitoSub,
        created_at: datetime,
        updated_at: datetime,
      },
    };

    try {
      const command = new PutCommand(params);
      const output = await this.dbClient.send(command);
      if (output.$metadata.httpStatusCode !== 200) {
        throw new Error("Failed to add farmer detail");
      }
      return {
        message: "Farmer detail added successfully",
        data: farmerDetail,
      };
    } catch (error) {
      throw new Error(`Error adding farmer detail: ${error}`);
    }
  }
}
