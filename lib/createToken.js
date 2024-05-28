import { SignJWT, jwtVerify } from "jose";

/* JWT secret key */
let KEY = process.env.JWT_KEY;

KEY = new TextEncoder().encode(KEY);
const alg = "HS256";
/* End JWT Secret Key */

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export async function createToken(userInfo) {
  try {
    const jwt = await new SignJWT(userInfo)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(process.env.COOKIE_DOMAIN)
      .setAudience(process.env.COOKIE_DOMAIN)
      .setExpirationTime(process.env.TOKEN_EXPIRATION_TIME)
      .sign(KEY);

    return jwt;
  } catch (e) {
    console.log("e:", e);
    return null;
  }
}
