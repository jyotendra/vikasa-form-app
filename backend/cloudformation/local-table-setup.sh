awslocal cloudformation deploy \
    --stack-name local-table-setup \
    --template-file "./dynamodb-stack.json" \
    --region us-east-1


# delete the stack
# awslocal cloudformation delete-stack \
#     --stack-name local-table-setup \
#     --region us-east-1