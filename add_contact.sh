
jwt=$(bash ./login.sh | jq -r .token) 

curl -X POST http://localhost:80/api/add_contact.php \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $jwt" \
-d '{
    "contact": {
        "first_name": "Joe",
        "last_name": "Mama"
    }
}' -s
