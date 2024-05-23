
# Check if the number of arguments is exactly one
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <integer>"
    exit 1
fi

# Check if the input is a valid integer
if ! [[ $1 =~ ^-?[0-9]+$ ]]; then
    echo "Error: '$1' is not a valid integer."
    exit 1
fi

contact_id=$1

jwt=$(bash ./login.sh | jq -r .token) 

curl -X POST http://localhost:80/api/delete_contact.php \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $jwt" \
-d "{
    \"contact_id\": $contact_id
}"
