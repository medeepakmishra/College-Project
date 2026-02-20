// import express from 'express';
// const app = express();
// import authRoutes from "./routes/auth.route.js";
// import cors from "cors";


// /* ---------- Middlewares ---------- */
// app.use(express.json());

// /* ---------- Routes ---------- */
// app.get('/', (req, res) => {
//   res.send('App is working');
// });

// app.get('/test',(req,res)=>{
//     res.send("test is working")

// });

// app.use("/api/auth", authRoutes);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );


// //  test -3







// export default app;






import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.route.js";

const app = express();

/* ---------- Middlewares ---------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ---------- Routes ---------- */
app.get('/', (req, res) => {
  res.send('App is working');
});

app.get('/test', (req, res) => {
  res.send("test is working");
});

app.use("/api/auth", authRoutes);

export default app;
