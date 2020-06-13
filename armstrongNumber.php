<?php
    //check if form was submitted
    if(isset($_POST['SubmitButton'])){ 
        // Starting clock time in seconds 
        $start_time = microtime(true); 

        //get input text
        $number = $_POST['inputNumber']; 


        $temp = $number;

        $armNum = 0;
        while($number > 0){
            $rem = $number % 10;
            $armNum = $armNum + ($rem * $rem * $rem);
            $number =intdiv($number, 10);
        }
        if($temp == $armNum)
            echo "Number Is Armstrong Number <br>";
        else
            echo "Number Is Not Armstrong Number <br>";

             // End clock time in seconds 
        $end_time = microtime(true); 
        
        // Calculate script execution time 
        $execution_time = ($end_time - $start_time); 
        
        echo " Execution time of script = ".$execution_time." sec <br> Memory Usage Is ". round(memory_get_usage() / 1024) ."KB";
    }    
   
?>

<!DOCTYPE html>
<html>
    <head>
        <title> Armstong Number</title>
    </head>
    <body>
        <form method="POST" action="">
            <input type="number" placeholder="Enter Any Number" name="inputNumber">
            <input type="submit" name="SubmitButton"> 
        </form>
    </body>
</html>