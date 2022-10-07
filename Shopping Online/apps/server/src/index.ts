import dotenv from "dotenv";
dotenv.config();
import express, {
   Request, 
   Response, 
   Application, 
   NextFunction } from "express";
import { authRouter } from "./auth";
import { verifyToken } from "./middlewares/jwtVerifyTokenFn";
import cors from "cors";
import { exeMySqlDB } from "./db";
import { icons } from "./misc/icons";
import { validateFrontTokenRouter } from "./validateFrontToken";
import { onInitWebPageRouter } from "./onWebPageInit";
import { shoppingRouter } from "./shopping";
import { ordersRouter } from "./orders";
import { adminRouter } from "./admin";

exeMySqlDB();

const app: Application | undefined = express();

app.use(cors());

app.use(express.json());

app.get("/healthCheck", (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).send(`<<${icons.running}>> Server Is Running <<${icons.running}>>`);
  return;
});

app.use("/auth", authRouter);

app.use("/onInitWebPage", onInitWebPageRouter);

app.use(verifyToken);

app.use("/validate_front_token", validateFrontTokenRouter);

app.use("/shopping", shoppingRouter);

app.use("/orders", ordersRouter);

app.use("/admin", adminRouter);

app.get('*', (req: Request, res: Response, next: NextFunction): void => {
  const err: Error = new Error("Page Doesn't Exist"); // err not mandatory -> only for the log
  console.log(err)
  next({ status: 404 }); // express creates an error anyway ... no need to pass err to next .. just the object with the statuscode
  return;
});  

app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  console.log(error);
  if (error.status === 401) { res.status(error.status).json({ 
  message: `<<${icons.unAuthorized}>> You Are unAuthorized <<${icons.unAuthorized}>>` 
  }); 
  return;
}
// even if token is correct -> if entered wrong path gets error
  if (error.status === 404) { res.status(error.status).json({ 
  message: `<<${icons.notFound}>> The Page You Have Requested Does Not Exist <<${icons.notFound}>>` 
  }); 
  return;
}
  res.status(500).json({"Error Message":
   `<<${icons.somethingWentWrong}>> Something Went Wrong <<${icons.somethingWentWrong}>>` 
  });
  return;
});

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log("listening to port");
});
