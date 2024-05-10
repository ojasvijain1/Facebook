import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";
import db from '../../utils/db';

interface User {
    email: string;
    uID: number;
}

interface URL {
    photoUrl: string;
}

function gettingUID(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
        db.query("SELECT uID from users where email=?", [email], (error: Error, results: Array<User>) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(results[0]);
            }
        })
    })
}

function gettingURL(uID: number): Promise<URL> {
    return new Promise((resolve, reject) => {
        db.query("SELECT postURL from posts where uID=?", [uID], (error: Error, results: Array<URL>) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(results);
            }
        })
    })
}

export async function GET(request: Request) {
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

        const email = decodedToken.email;
        console.log(email);

        const user = await gettingUID(email);
        const uID = user.uID;
        console.log(uID);

        /* const URL = await gettingURL(uID);
        console.log("URL is ", URL);
        const photoURLs = URL.map(url => url.photoUrl);
        const photo = URL[0].postURL; */

        const URLs = await gettingURL(uID);
        console.log("URLs are ", URLs);
    
        // Extract photo URLs from the results array
        const photoURLs = URLs.map(url => url.postURL);

        console.log("Photo is : ", photoURLs);
        return new Response(JSON.stringify({message: "OK", photourl: photoURLs}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        });
}