<?php
use JsonMapper\Middleware\Constructor\Constructor;

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

class RegisterPayload
{
    public string $authentication_provider;
    public string $first_name;
    public string $last_name;
    public string $username;
    public string $password;


    public function __construct(string $authentication_provider, string $first_name, string $last_name, string $username, string $password)
    {
        $this->authentication_provider = $authentication_provider;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->username = $username;
        $this->password = $password;
    }
}

class AddContactPayload
{
    public Contact $contact;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }
}
class GetContactPayload
{
    public int $contact_id;

    public function __construct(int $contact_id)
    {
        $this->contact_id = $contact_id;
    }

}

class GetUserPayload
{
    public int $user_id;

    public function __construct(int $user_id)
    {
        $this->user_id = $user_id;
    }
}

class SearchContactsPayload
{
    public string $query;
    public ?int $page = null;

    public function __construct(string $query, ?int $page)
    {
        $this->query = $query;
        $this->page = $page;
    }

}

class UpdateContactPayload
{
    public Contact $contact;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }
}

class DeleteContactPayload
{
    public int $contact_id;

    public function __construct(int $contact_id)
    {
        $this->contact_id = $contact_id;
    }

}

class User
{
    public int $id;
    public string $first_name;
    public string $last_name;
    public string $date_created;
    public string $date_last_logged_in;
    public string $authentication_id;
    public string $authentication_provider;

    public function __construct(int $id, string $first_name, string $last_name, string $date_created, string $date_last_logged_in, string $authentication_id, string $authentication_provider)
    {
        $this->id = $id;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->date_created = $date_created;
        $this->date_last_logged_in = $date_last_logged_in;
        $this->authentication_id = $authentication_id;
        $this->authentication_provider = $authentication_provider;
    }

}

class Contact
{
    public ?int $id;
    public string $first_name;
    public ?string $last_name;
    public ?string $phone_number;
    public ?string $email_address;
    public ?string $avatar_url;
    public ?string $bio;
    public ?string $description;

    public ?int $user_id;

    public function __construct(?int $id, ?int $user_id, string $first_name, ?string $last_name, ?string $phone_number, ?string $email_address, ?string $avatar_url, ?string $bio, ?string $description)
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