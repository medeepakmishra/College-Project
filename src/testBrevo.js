import dotenv from "dotenv";
dotenv.config();


import brevo from "./config/brevo.js";


const sendTestEmail = async()=>{


try{


const response =
await brevo.post(
    "/smtp/email",
    {

        sender:{
            name:"RMLAU Placement Portal",
            email:
            process.env.BREVO_EMAIL
        },


        to:[
            {
                email:
                "your-test-email@gmail.com"
            }
        ],


        subject:
        "Brevo Test Email",


        htmlContent:
        `
        <h1>Hello Deepak 👋</h1>

        <p>
        Your OTP email system is working.
        </p>
        `
    }
);


console.log(
    "Email Sent",
    response.data
);


}
catch(error){

console.log(
    "Brevo Error:",
    error.response?.data ||
    error.message
);

}


};


sendTestEmail();