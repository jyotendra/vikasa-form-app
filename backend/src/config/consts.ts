export const dynamoDbConsts = {
  tableName: "UserTargetFormTable",
  // GSI indexes
  userEmailGsi: {
    index: "GSI1-UserEmail-Index",
    pk: "email",
  },
  userFormSubmissionGsi: {
    index: "GSI1-UserFormSubmissions-Index",
    pk: "created_by",
    sk: "gsi1_sk_form_update_at",
  },
  userMobileGsi: {
    index: "GSI2-Mobile-Index",
    pk: "mobile_number",
  },
  targetFormSubmissionGsi: {
    index: "GSI2-TargetFormSubmissions-Index",
    pk: "target_identifier",
    sk: "gsi1_sk_form_update_at",
  },
  targetAadharGsi: {
    index: "GSI3-TargetAadhar-Index",
    pk: "aadhar_number",
  },
};
