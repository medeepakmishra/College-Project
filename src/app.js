import express from 'express';
const app = express();
import authRoutes from "./routes/auth.route.js";

/* ---------- Middlewares ---------- */
app.use(express.json());

/* ---------- Routes ---------- */
app.get('/', (req, res) => {
  res.send('App is working');
});

app.get('/test',(req,res)=>{
    res.send("test is working")

});

app.use("/api/auth", authRoutes);

//  test -3







export default app;
