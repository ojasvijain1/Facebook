import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";
import db from '../../utils/db';

interface User {
    email: string;
    uID: number;
}

interface LikeResult {
    pID: number;
    likeCount: number;
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

function gettingUIDUsingUserName(userName: string): Promise<User> {
    return new Promise((resolve, reject) => {
        db.query("SELECT uID from users where fname=?", [userName], (error: Error, results: Array<User>) => {
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

async function gettingLikes(uID: number): Promise<LikeResult[]> {
    return new Promise((resolve, reject) => {
        db.query("SELECT pID, COUNT(likeCount) AS likeCount FROM likecounts WHERE uID=? GROUP BY pID", [uID], (error: Error, results: LikeResult[]) => {
            if (error) {
                console.log(error);
                reject(error); // Reject the promise if there's an error
            } else {
                console.log("Like results is : ", results);
                resolve(results);
            }
        });
    });
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("data in render-likes is : ", data)
        const {userName} = data;

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
        console.log(email);

        if (!userName || userName === null) {
            const user = await gettingUID(email);
            const uID = user.uID;
            console.log(uID);
            const likeData = await gettingLikes(uID);
            console.log(likeData);
            return new Response(JSON.stringify({likes: likeData}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            });
        }

        else {
            const user = await gettingUIDUsingUserName(userName);
            const uID = user.uID;
            const likes = await gettingLikes(uID);
            return new Response(JSON.stringify({likes: likes}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({error}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}