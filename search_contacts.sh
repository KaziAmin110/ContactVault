#!/bin/bash

# Reading QUERY_STRING and PAGE from arguments
QUERY_STRING=$1
PAGE=$2

# Obtain the JWT token
jwt=$(bash ./login.sh | jq -r .token)

# If PAGE is not provided, set it to a default value (e.g., 1)
if [ -z "$PAGE" ]; then
  PAGE=1
fi

# Perform the curl request
curl -X GET http://localhost:80/api/search_contacts.php?query=$QUERY_STRING\&page=$PAGE \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $jwt" -s
