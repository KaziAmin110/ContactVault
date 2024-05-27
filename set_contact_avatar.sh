#!/bin/bash

# Check if the number of arguments is exactly one
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <contact_id> <image_file_path>"
    exit 1
fi

# Check if the input is a valid integer
if ! [[ $1 =~ ^-?[0-9]+$ ]]; then
    echo "Error: '$1' is not a valid integer."
    exit 1
fi

# Reading QUERY_STRING and PAGE from arguments
CONTACT_ID=$1
FILE_PATH=$2

# Obtain the JWT token
jwt=$(bash ./login.sh | jq -r .token)

# Perform the curl request
curl -X POST http://localhost:80/api/set_contact_avatar.php \
-H "Authorization: Bearer $jwt" \
-F "image=@$FILE_PATH" \
-F "json={\"contact_id\":$CONTACT_ID}"
