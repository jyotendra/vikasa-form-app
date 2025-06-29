stack_name="local-table-setup"
region="ap-south-1"

aws cloudformation delete-stack \
    --endpoint-url "http://localhost:4566" \
    --stack-name "$stack_name" \
    --region "$region"