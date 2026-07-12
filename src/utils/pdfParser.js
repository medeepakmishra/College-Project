import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractPdfText = async (pdfUrl) => {
  try {
    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    const data = await pdfParse(buffer);

    return data.text;
  } catch (error) {
    console.error("PDF Parser Error:", error);
    throw error;
  }
};