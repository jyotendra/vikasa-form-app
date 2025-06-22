stack_name="local-table-setup"
region="ap-south-1"

awslocal cloudformation deploy \
    --stack-name "$stack_name" \
    --template-file "../backend/cloudformation/dynamodb-stack.json" \
    --region "$region"


