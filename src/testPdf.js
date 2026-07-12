import dotenv from "dotenv";
dotenv.config();

import { extractPdfText } from "./utils/pdfParser.js";

const url =
"https://res.cloudinary.com/dcap8t5o4/raw/upload/v1783794774/placement-resumes/qzscjpwy8vxli2bjivld";

const text = await extractPdfText(url);

console.log(text);