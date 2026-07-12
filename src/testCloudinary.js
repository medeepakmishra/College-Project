import cloudinary from "./config/cloudinary.js";

async function test() {
  try {
    const result = await cloudinary.api.ping();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

test();