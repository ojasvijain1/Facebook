import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";
import db from '../../utils/db';

interface User {
    uID: number;
}

interface URL {
    photoUrl: string;
}

function gettingUID(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
        db.query("SELECT uID from users where fname=?", [username], (error: Error, results: Array<User>) => {
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
        db.query("SELECT photoUrl from profilephoto where uID=?", [uID], (error: Error, results: Array<URL>) => {
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

export async function POST(request: Request) {
    const data = await request.json();
    const username = data.username;
    const user = await gettingUID(username);
    const uID = user.uID;
    console.log(uID);
    const URL = await gettingURL(uID);
    console.log("URL is ", URL);
    const photo = URL.photoUrl;
    return new Response(JSON.stringify({message: "OK", photo: photo}), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    });
}