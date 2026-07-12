import dotenv from "dotenv";
dotenv.config();

import axios from "axios";


const sendEmail = async()=>{

try{

const response = await axios.post(

"https://api.brevo.com/v3/smtp/email",

{

sender:{
    name:"RMLAU Placement Portal",
    email:process.env.BREVO_EMAIL
},


to:[
    {
        email:"YOUR_TEST_EMAIL@gmail.com",
        name:"Student"
    }
],


subject:"OTP Test Mail",


htmlContent:`

<h2>Placement Portal OTP</h2>

<p>Your OTP is:</p>

<h1>123456</h1>

<p>This OTP expires in 5 minutes.</p>

`

},

{

headers:{
    "api-key":process.env.BREVO_API_KEY,
    "Content-Type":"application/json"
}

}

);


console.log(
"EMAIL SENT:",
response.data
);


}

catch(error){

console.log(
"EMAIL ERROR:",
error.response?.data || error.message
);

}

};


sendEmail();