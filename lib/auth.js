import { nanoid } from "nanoid";
import { jwtVerify } from "jose";

export async function verifyAuth(req) {
  let KEY = process.env.JWT_KEY;
  KEY = new TextEncoder().encode(KEY);
  let cookieName = process.env.COOKIE_NAME;

  debugger;
  const alg = "HS256";
  let currentUser = req.cookies.get(cookieName)?.value;
  //  console.log("Current User Valor: " + currentUser);
  //if (!currentUser) return false;
  try {
    const verified = await jwtVerify(currentUser, KEY);
    //  console.log(verified);
    return verified.payload;
  } catch (err) {
    console.log(err);
    return {};
  }
}