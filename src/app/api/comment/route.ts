import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";
import db from '../../utils/db';

interface User {
    pID: number;
    uID: number;
    likeID: number;
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
    const data = await req.json();
    const {userName} = data;
    console.log("UserName is : ", userName)
    const pID = data.pID, comment = data.comment;
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
        const uID = user.uID;
        console.log(uID);

        db.query("INSERT INTO comments(pID, uID, commentID, comment) VALUES(?, ?, ?, ?)", [pID, uID, uID, comment]);
        return new Response(JSON.stringify({message: "Ok"}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        });
    }

    else {
        const user = await gettingUID(email);
        const commentID = user.uID;
        console.log(commentID);

        const user2 = await gettingUIDusinFname(userName);
        const uID = user2.uID;
        console.log(uID);
        db.query("INSERT INTO comments(pID, uID, commentID, comment) VALUES(?, ?, ?, ?)", [pID, uID, commentID, comment]);
        return new Response(JSON.stringify({message: "Ok"}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        });
    }
}