const express = require("express");
const bodyParser = require("body-parser");
// const axios = require("axios");
const https = require("https");
// const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/3fd2ee4f4c";

    const options = {
        method: "POST", 
        auth: "mani16032:7bf36a5e6f07b3998300324ab852ec6b-us21"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("There was an error with signin up, please try again!");
            res.sendFile(__dirname + "/failure.html");

        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

    });
    // commented out to test the failure
    // request.write(jsonData);
    request.end();

});


// --data @- \
// <<EOF | jq '.id'
// {
//   "name": "$event_name",
//   "contact": $footer_contact_info,
//   "permission_reminder": "permission_reminder",
//   "email_type_option": true,
//   "campaign_defaults": $campaign_defaults
// }
// EOF

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up and running on port 3000.");
});


// mailchimp API Key
// 7bf36a5e6f07b3998300324ab852ec6b-us21
// List ID
// Typically, this is what they want: 3fd2ee4f4c.