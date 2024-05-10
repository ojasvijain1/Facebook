import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";

export async function GET(request: Request) {
    try {
        // Retrieve the cookies from the request
        const cookies = request.headers.get('Cookie');
        if (!cookies) {
            throw new Error("No cookies found");
        }

        // Extract the token from the cookies
        const tokenMatch = cookies.match(/token=([^;]*)/);

        // Check if token exists
        if (!tokenMatch || !tokenMatch[1]) {
            throw new Error("Token not found");
        }

        const token = tokenMatch[1];

        // Verify the token using the SECRETKEY
        const decodedToken = jwt.verify(token, SECRETKEY) as JwtPayload;

        const username = decodedToken.username;
        console.log(username);

        // Log the decoded token
        console.log("Decoded Token:", decodedToken);

        // Send a success response
        return new Response(JSON.stringify({message: "Token verified", username: username}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        });
    } catch (error: any) {
        // Log and send an error response
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        });
    }
}