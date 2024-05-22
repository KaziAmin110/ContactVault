curl -X POST http://localhost:80/api/login.php \
-H "Content-Type: application/json" \
-d '{
    "authentication_provider": "USERNAME_PASSWORD",
    "username": "your_username",
    "password": "your_password"
}'

