# Barberros  
Barberros back-end for barbers online android application.  
This code is for my friends.  

# First thing you need to start before running the server
1. Open your mongodb service
2. command ``` sudo service mongod start ```

# How to use it
```javascript
        npm start
        // This code will run with nodemon

        /*
            If you find that the project had an error. Please rebuild or update or reinstall npm
        */
```
# If there's an error package?
1. Delete node_modules directory
2. Open terminal
3. Input command ``` npm install  ``` or ``` npm update ```

## Routes Params
Route | Expected Parameter
----- | ------------------
/user/register | username(string), full_name(string), no_telp(string), password(string), sec_password(string), email(string)
/user/login | username(string), password(string)
/user/check-secondary-password | username(string), sec_pass(string), token(string)
/user/change-password | username(string), new_password(string), token(string)
/barber/getbarbers (get request need authorization header) | auth header
/barber/addBarber | barber_name(string), times(array of string), services(array of string), latitude(string), longitude(string), description(string), no_telp(string)
/user/barber/makeAppointment | token(string), barber_name(string), username(string), time(string), service(string)
/barber/done | time(string), name(string)
/user/barber/ongoing/:username (get request need authorization header) | username url param, authorization header with token
/user/favorite/add | token(string), username(string), barber_id(string)
/user/:username/favorites (get request need authorization header) | username request params, token in authorization header

## Info
If there's something missing or need improve, please contact me. Or discuss it on the group-chat 
