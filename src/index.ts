import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { register, login, activateUser } from "./controller/userController";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
    res.json({
        "message": "Hello World!"
    })
});

app.post("/register", register);
app.post("/activation", activateUser)
app.post("/login", login);

app.listen(port, () => {
    console.log(`⚡[server] server is running at http://localhost:${port}`);
});
