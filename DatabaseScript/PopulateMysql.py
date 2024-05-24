import mysql.connector
from faker import Faker

faker = Faker()

host = 'localhost'
dbname = "contact_manager"
username = 'test'
password = 'example'

connection = mysql.connector.connect(
    host=host,
    user=username,
    password=password,
    database=dbname
)
cursor = connection.cursor()

query=f"TRUNCATE TABLE contacts"

cursor.execute(query)

for _ in range(50):
    firstname = faker.first_name()
    lastname = faker.last_name()
    user_id = 1
    phone_number = faker.phone_number()
    email_address = f"{firstname}.{lastname}@{faker.domain_name()}"
    avatar_url = "https://thispersondoesnotexist.com/"
    bio = f"My name is {firstname} {lastname}, and I was born on {faker.date_of_birth().strftime('%m-%d-%Y')}. I currently work as a {faker.job()} in {faker.city()}, USA."
    description = faker.paragraph()
    cursor.execute("INSERT INTO contacts (user_id, first_name, last_name, phone_number, email_address, avatar_url, bio, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                   (user_id, firstname, lastname, phone_number, email_address, avatar_url, bio, description))
    connection.commit()

print("Data inserted successfully!")

cursor.close()
connection.close()