stack_name="local-table-setup"
region="ap-south-1"

aws cloudformation deploy \
    --endpoint-url "http://localhost:4566" \
    --stack-name "$stack_name" \
    --template-file "../backend/cloudformation/dynamodb-stack.json" \
    --region "$region"


