import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { register, login, activateUser } from "./controller/userController";
import { PORT } from "./config";

const app: Express = express();
const port = PORT;
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
