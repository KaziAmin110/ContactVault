<?php

$JSON_MAPPER = (new \JsonMapper\JsonMapperFactory())->default();

class LoggedInUser
{
    public int $user_id;

    public function __construct(int $user_id)
    {
        $this->user_id = $user_id;
    }
}

class LoginPayload
{
    public string $authentication_provider;
    public string $username;
    public string $password;


    public function __construct(string $authentication_provider, string $username, string $password)
    {
        $this->authentication_provider = $authentication_provider;
        $this->username = $username;
        $this->password = $password;
    }
}

class LoginResponse
{
    public int $user_id;
    public string $jwt;

    public function __construct(int $user_id, string $jwt)
    {
        $this->user_id = $user_id;
        $this->jwt = $jwt;
    }
}


class RegisterPayload
{
    public string $authentication_provider;
    public string $username;
    public string $password;


    public function __construct(string $authentication_provider, string $username, string $password)
    {
        $this->authentication_provider = $authentication_provider;
        $this->username = $username;
        $this->password = $password;
    }
}

class RegisterResponse
{
    public int $user_id;
    public string $jwt;

    public function __construct(int $user_id, string $jwt)
    {
        $this->user_id = $user_id;
        $this->jwt = $jwt;
    }
}


?>