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


class Contact
{
    public $id;
    public $user_id;
    public $first_name;
    public $last_name;
    public $phone_number;
    public $email_address;
    public $avatar_url;
    public $bio;
    public $description;

    public function __construct($id, $user_id, $first_name, $last_name, $phone_number, $email_address, $avatar_url, $bio, $description)
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->phone_number = $phone_number;
        $this->email_address = $email_address;
        $this->avatar_url = $avatar_url;
        $this->bio = $bio;
        $this->description = $description;
    }
}


?>