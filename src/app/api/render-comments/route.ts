import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";
import db from '../../utils/db';

interface User {
    pID: number;
    uID: number;
    likeID: number;
    likeCount: number;
}

interface Comments {
    comment: string;
    pID: number;
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

function gettingComments(uID: number): Promise<Comments | null> {
    return new Promise((resolve, reject) => {
        db.query("SELECT pID, comment from comments where uID=?", [uID], (error: Error, results: Array<Comments>) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                if (results.length > 0)
                    resolve(results);
                else 
                    resolve(null);
            }
        })
    })
}

function gettingUIDusinFname(username: string): Promise<User> {
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

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {userName} = data;
        // console.log(data);

        const cookies = req.headers.get('Cookie');
        if (!cookies) {
            throw new Error("No cookies found");
        }

        const tokenMatch = cookies.match(/token=([^;]*)/);
        if (!tokenMatch || !tokenMatch[1]) {
            throw new Error("Token not found");
        }

        const token = tokenMatch[1];
        const decodedToken = jwt.verify(token, SECRETKEY) as JwtPayload;
        const email = decodedToken.email;

        if (!userName || userName === null) {
            const user = await gettingUID(email);
            const uID = user.uID
            
            // const fname = user.fname, lname = user.lname;
            // const userName = fname + " " + lname;
            console.log(uID);
            const comments = await gettingComments(uID);
            console.log("comments is : ", comments);
            return new Response(JSON.stringify({comment: comments}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            });
        }
        else {
            const user2 = await gettingUIDusinFname(userName);
            const uID = user2.uID;
            console.log(uID);

            const comments = await gettingComments(uID);
            console.log("comments is : ", comments);
            return new Response(JSON.stringify({comment: comments}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            });
        }
    } catch (error) {
        console.log("Error in render comments is : ", error);
        return new Response(JSON.stringify(error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}