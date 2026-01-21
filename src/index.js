import 'dotenv/config';
import app from './app.js';
import connectDB from "./db/db.js"

/* ---------- Connect Database ---------- */
connectDB
  .then(() => {
    /* ---------- Start Server ---------- */
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server due to DB error:', err.message);
    process.exit(1);
  });



