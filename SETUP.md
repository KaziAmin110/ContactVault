# Setup

This is an opinioniated project setup guide which asssumes you will be using the provided [devcontainer](https://containers.dev/).

## Requirements

- [Docker](https://www.docker.com/get-started/)
- [Visual Studio Code](https://code.visualstudio.com/)
  - [Devcontainers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)


## Quickstart

Once you have installed the required software listed above you should be ready to open the project.

### Opening Project in Devcontainer
1. Clone the project
2. Open the project using VS Code
3. At the bottom left of your VS Code window there will be an icon with 2 arrows point at each other. Click on that.
4. In the popup, select `Reopen in Container`.
5. This will reopen the project inside of the devcontainer defined [here](https://github.com/KaziAmin110/contact-manager/blob/development/.devcontainer/devcontainer.json).

### Setting up secrets
1. Create a `secrets` folder
2. Create a file called `.env` in `secrets`
3. Insert the following example secrets into the `secrets/.env` file:
    ```env
    MYSQL_HOST=database
    MYSQL_USER=test
    MYSQL_PASSWORD=example
    MYSQL_DATABASE=contact_manager
    ```
4. Run the following to create the JWT RS256 encryption keys:
    ```bash
    ssh-keygen -t rsa -b 4096 -m PEM -f secrets/jwt_encryption_key.pem
    ```
### Starting Server
```bash
docker compose up --build
```

### Stopping Server
If you are in an active docker compose session in your terminal, you can press `CTRL+C`. 

If it is running in the background you can run the following: 
```bash
docker compose down
```

### Deleting Database
If you make a change to the `init.sql` file, and want to test it end-to-end, you can delete the databse by running the following:
```bash
rm -rf .cache
```

### Accessing Website
In your VS Code window, press `F1` and select `View: Toggle Ports`. This will open the port fowarding window. 

Next, port forward port `80` by selecting `Add Port`. Under `Forwarded Address` it will give you an address to access the website.

### Accessing API Docuementation
After starting the server and port-forwarding the website in the previous section, you can open the [Swagger UI](https://swagger.io/tools/swagger-ui/) by opening http://YOUR_FORWARDED_ADDRESS/swagger-ui/.

### Accessing Database
In your VS Code window, press `F1` and select `View: Toggle Ports`. This will open the port fowarding window.


#### PHPMyAdmin (MySQL Viewer)
Port forward port `8081` by selecting `Add Port`. Under `Forwarded Address` it will give you an address to access the website.

In PHPMyAdmin, leave the `Server` field blank, and enter the username and password that you set in the `.env` file.

#### Direct Access via CLI
Use the username, password, and database name provided in the `.env` file to login. If you would like to use the mysql client you can do the following (replace `YOUR_USER` with the user in your `.env`):

```bash
docker run -it --network contact-manager_default --rm mysql mysql -hdatabase -uYOUR_USER -p
```

#### Raw Access
Port forward port `3306` by selecting `Add Port`. Under `Forwarded Address` it will give you an address to access the database.

