import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const test = async()=>{

try{

const res = await axios.get(
"https://api.brevo.com/v3/account",
{
headers:{
"api-key": process.env.BREVO_API_KEY
}
}
);


console.log(res.data);


}catch(error){

console.log(
error.response?.data
);

}

}


test();