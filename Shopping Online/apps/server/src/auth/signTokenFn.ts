import jwt from "jsonwebtoken";

interface ISignToken {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  role: string;
};

function signToken (userData: ISignToken): string {
  const token: string = jwt.sign(
  { userData }, 
  process.env.TOKEN_SECRET || "mySecretKey09f26e402586e2faa8da4dsfsdaaacytec98a35f1b20d6b033c60", 
  { expiresIn: "24h" }
  );
  return token;
};

export { 
  ISignToken, 
  signToken
};


