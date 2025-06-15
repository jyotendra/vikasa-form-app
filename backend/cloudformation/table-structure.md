# Table Overview
Single table to store both user information and the form submitted by them.

# Table Columns:

- **PK**: Literal "PK".
- **SK**: Literal "SK"

## Key Structure

1.1. User Profile
- **PK**:
  - `USER#<cognito_user_sub>`: Represents a user profile.
- **SK**:
    - `PROFILE`: Represents the user profile.
- Attributes:
    - `name`: User's full name.
    - `address`: User's address.
    - `email`: User's email address.
    - `mobile_number`: User's mobile number.
    - `is_email_verified`: Boolean indicating if the email is verified.
    - `is_mobile_verified`: Boolean indicating if the phone number is verified.
    - `cognito_user_sub`: Unique identifier for the user in Cognito.
    - `is_active`: Boolean indicating if the user is active.
    - `created_at`: Timestamp of when the user was created.
    - `updated_at`: Timestamp of the last update to the user profile.

1.2. User App Role
- **PK**:
  - `USER#<cognito_user_sub>`
- **SK**:
    - `APP_ROLE`: Represents the user's role.
- Attributes:
    - `role`: User's role (e.g., admin, volunteer).
    - `created_at`: Timestamp of when the role was assigned.
    - `updated_at`: Timestamp of the last update to the role.


1.3. Search by User Email
- **GSI1_PK_USER_EMAIL**:
  - `<email>`: Represents a user by their email.
- Attributes:
    - `name`: User's full name.
    - `email`: User's email address.
    - `mobile_number`: User's mobile number.
    - `cognito_user_sub`: Unique identifier for the user in Cognito.
    - `is_active`: Boolean indicating if the user is active.

1.5 User Phone Number
- **GSI2_PK_USER_MOBILE**:
  - `<mobile_number>`: Represents a user's phone number.
- Attributes:
    - `name`: User's full name.
    - `email`: User's email address.
    - `mobile_number`: User's mobile number.
    - `cognito_user_sub`: Unique identifier for the user in Cognito.
    - `is_active`: Boolean indicating if the user is active.


2.1 Target Profile
- **PK**:
  - `TARGET#<target_id>`: Represents a target profile for which form is submitted (e.g., farmer, organization). This shall be a randomly generated identifier.
- **SK**:
    - `PROFILE`: Represents the target profile.
- Attributes:
    - `name`: Target's full name or organization name.
    - `address`: Target's address.
    - `mobile_number`: Target's mobile number.
    - `aadhar_number`: Target's Aadhar number (if applicable).
    - `target_id`: Unique identifier for the target.
    - `target_type`: Type of the target (e.g., farmer, organization).
    - `created_by`: User who created the target profile (Cognito user sub).
    - `updated_by`: User who last updated the target profile (Cognito user sub).
    - `created_at`: Timestamp of when the target was created.
    - `updated_at`: Timestamp of the last update to the target profile.

2.2 Search by Target Mobile Number
- **GSI1_PK_TARGET_MOBILE**:
  - `<mobile_number>`: Represents a target by their mobile number.
- Attributes:
    - `name`: Target's full name or organization name.
    - `mobile_number`: Target's mobile number.
    - `aadhar_number`: Target's Aadhar number (if applicable).
    - `target_type`: Type of the target (e.g., farmer, organization).
    - `target_id`: Unique identifier for the target.

2.3 Search by Target Aadhar Number
- **GSI2_PK_TARGET_AADHAR**:
  - `<aadhar_number>`: Represents a target by their mobile number.
- Attributes:
    - `name`: Target's full name or organization name.
    - `mobile_number`: Target's mobile number.
    - `aadhar_number`: Target's Aadhar number (if applicable).
    - `target_type`: Type of the target (e.g., farmer, organization).
    - `target_id`: Unique identifier for the target.



3.1. Form Submission
- **PK**:
  - `FORM_SUBMISSION#<form_type>#<user_name>`: Represents a form submission.
- **SK**:
    - `<created_at>`: Unique identifier for each form submission.
- Attributes:
    - `user_name`: cognito_user_sub of the user who submitted the form. (the app user)
    - `gsi1_sk_form_update_at`: Represents the type of form submitted and the timestamp of submission. Format: `FORM#<form_type>#<updated_at>`.
    - `target_identifier`: identifier for the target of the form (e.g., farmer's mobile number).
    - `form_type`: Type of the form submitted (e.g., registration, feedback).
    - `form_data`: JSON object containing the form data.
    - `created_by`: User who created the form submission (Cognito user sub).
    - `updated_by`: User who last updated the form submission (Cognito user sub).
    - `created_at`: Timestamp of when the form was submitted.
    - `updated_at`: Timestamp of the last update to the form submission.

3.2. All User Form Submissions
- **GSI1_PK_user_id**:
  - `<updated_by>`: Represents user-name, who updated the form last.
- **GSI1_SK_form_submission_time**:
    - `<gsi1_sk_form_update_at>`: Represents the type of form submitted and the timestamp of submission. Format: `FORM#<form_type>#<updated_at>`.
- Attributes:
    - `user_name`: cognito_user_sub of the user who submitted the form.
    - `gsi1_sk_form_update_at`: Represents the type of form submitted and the timestamp of submission. Format: `FORM#<form_type>#<updated_at>`.
    - `target_identifier`: identifier for the target of the form (e.g., farmer's mobile number).
    - `form_type`: Type of the form submitted (e.g., registration, feedback).
    - `form_data`: JSON object containing the form data.
    - `created_at`: Timestamp of when the submission was created.
    - `updated_at`: Timestamp of the last update to the submission.
    

3.3. All Forms Submitted for Target
- **GSI2_PK_target_identifier**:
  - `<target_identifier>`: Represents all forms submitted for a specific target.
- **GSI2_SK_form_submission_time**:
    - `<gsi1_sk_form_submission_time>`: Represents the type of form submitted and the timestamp of submission. Format: `FORM#<form_type>#<updated_at>`.
- Attributes:
    - `user_name`: cognito_user_sub of the user who submitted the form.
    - `gsi1_sk_form_submission_time`: Represents the type of form submitted and the timestamp of submission. Format: `FORM#<form_type>#<updated_at>`.
    - `target_identifier`: identifier for the target of the form (e.g., farmer's mobile number).
    - `form_type`: Type of the form submitted (e.g., registration, feedback).
    - `form_data`: JSON object containing the form data.
    - `created_at`: Timestamp of when the submission was created.
    - `updated_at`: Timestamp of the last update to the submission.
