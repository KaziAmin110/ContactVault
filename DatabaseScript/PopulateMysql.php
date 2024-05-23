<?php
//phpinfo();

require_once('./vendor/autoload.php');

try{
    //# of fake users to generate
    $user_count=5;
    //# of fake contacts to generate
    $contact_count = 20;

    $faker = \Faker\Factory::create();
    $faker->locale('en_US');

    //cloud connection parameters
    $host = '143.198.232.89';
    $dbname= "CONTACTS";
    $username= 'overseer';
    $password = 'password';

    //connect to MySQL Database
    $pdo  = new PDO("mysql:host=$host;dbname=$dbname", $username, $password,[
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    //drop the tables
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    $stmt = $pdo->prepare("truncate table users");
    $stmt->execute();

    $stmt = $pdo->prepare("truncate table contacts");
    $stmt->execute();

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    function generateImageUrl($width, $height) {
        //generate random seed
        $seed = mt_rand(1, 10000);
        
        //create url using random seed
        return "https://picsum.photos/seed/{$seed}/{$width}/{$height}";
    }

    $sql= 'INSERT INTO users (date_created,date_last_logged_in,authentication_provider, authentication_id, password )
    VALUES (:date_created, :date_last_logged_in, :authentication_provider, :authentication_id, :password)';
    $stmt=$pdo->prepare($sql);

    for($i=0; $i < $user_count; $i++){
        $stmt->execute([
            ':date_created' => $faker->dateTimeThisDecade->format('Y-m-d H:i:s'),
            ':date_last_logged_in' => $faker->dateTimeThisDecade->format('Y-m-d H:i:s'),
            ':authentication_provider'=> 'USERNAME_PASSWORD',
            ':authentication_id'=> $faker->userName,
            ':password'=> $faker->password
        ]);
    }

    $sql = 'INSERT INTO contacts (user_id, first_name, last_name, phone_number, email_address, avatar_url, bio, description)
    VALUES (:user_id, :first_name, :last_name, :phone_number, :email_address, :avatar_url, :bio, :description)';
    $stmt = $pdo -> prepare($sql);

    //max user id will be equal to user_count
    for($i=0; $i<$contact_count; $i++){
        
        $firstname = $faker->firstName;
        $lastname = $faker->lastName;
        $num= $faker->numberBetween(0,99);

        //used for bio
        $DOB = $faker->dateTimeBetween('-80 years', '2012-1-1')->format('m-d-Y');
        $job = $faker->jobTitle;
        $country= 'USA';
        $city= $faker->city();
        
        $stmt->execute(
            [   
                ':user_id'=> mt_rand(1,$user_count),
                ':first_name' => $firstname, 
                ':last_name' => $lastname,  
                ':phone_number'=> $faker->phoneNumber, 
                ':email_address' => $firstname . "." . $lastname . "@" . $faker->domainName,
                ':avatar_url' => generateImageUrl(200, 200),
                ':bio' => "My name is " . $firstname . " " . $lastname . ", and I was born on " . $DOB . ". I currently work as a " . $job . " in " . $city .", USA.",
                ':description'=> $faker->paragraph(1),

                //':time_created' => $faker->dateTimeThisDecade->format('Y-m-d H:i:s'),
                //':social_links' => "| https://www.facebook.com/$firstname$num | https://twitter.com/$firstname$num | https://www.linkedin.com/in/$firstname$num | https://www.instagram.com/$firstname$num |"
            ]
        );
    }

    echo "datas inserted succesfully!";
} catch(Exception $e){
    echo '<pre>';print_r($e);echo '</pre>';exit;
}