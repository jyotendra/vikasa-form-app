stack_name="local-table-setup"
region="ap-south-1"

awslocal cloudformation delete-stack \
    --stack-name "$stack_name" \
    --region "$region"