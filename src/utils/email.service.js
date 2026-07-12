import axios from "axios";


export const sendEmail = async ({
    to,
    subject,
    html
}) => {


    try {


        const response = await axios.post(

            "https://api.brevo.com/v3/smtp/email",

            {

                sender:{
                    name:"RMLAU Placement Portal",
                    email:process.env.BREVO_EMAIL
                },


                to:[
                    {
                        email:to
                    }
                ],


                subject,


                htmlContent:html

            },


            {

                headers:{
                    "api-key":
                    process.env.BREVO_API_KEY,

                    "Content-Type":
                    "application/json"
                }

            }

        );


        return response.data;


    } catch(error){

        console.log(
            "Email Error:",
            error.response?.data ||
            error.message
        );

        throw error;

    }

};