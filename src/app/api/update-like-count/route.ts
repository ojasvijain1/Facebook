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

async function ifLikeFound(pID: number, uID: number, likeID: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM likecounts where pID=? and uID=? and likeID=?", [pID, uID, likeID], (error: Error, results: Array<User>) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

async function isAlreadyLiked(pID: number, uID: number,  likeID: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
        db.query("SELECT likeCount from likecounts where pID=? and uID=? and likeID=?", [pID, uID, likeID], (error: Error, results: Array<User>) => {
            if (error) {
                console.log("Error inside isAlreadyLiked function is : ", error);
                reject(error);
            }
            else {
                if (results.length > 0) {
                    console.log("results is : ", results);
                    resolve(results[0]);
                }
                else {
                    resolve(null);
                }
            }
        })
    })
} 

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log(data);
        const { pID, likeCount, userName } = data;

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
            
            const isAlready = await isAlreadyLiked(pID, uID, uID);
            console.log("isAlready is : ", isAlready);
            if (isAlready === null) {
                db.query("INSERT INTO likecounts(pID, uID, likeID, likeCount) VALUES(?, ?, ?, ?)", [pID, uID, uID, likeCount], (error: Error) => {
                    if (error) {
                        console.log(error);
                    }
                });
            }
            else {
                const isLikeFound = await ifLikeFound(pID, uID, uID);
                if (isLikeFound === null) {
                    const counts = isAlready.likeCount + 1;
                    db.query("UPDATE likecounts SET likeCount=? where pID=? and uID=? and likeID=?", [counts, pID, uID, uID])
                }
                else {
                    db.query("DELETE FROM likecounts where pID=? and uID=? and likeID=?", [pID, uID, uID], (error: Error) => {
                        if (error) {
                            console.log(error);
                        }
                    })
                }
            }
        }
        
        else {
            const user = await gettingUID(email);
            const likeID = user.uID;
            console.log(likeID);

            const user2 = await gettingUIDusinFname(userName);
            const uID = user2.uID;
            console.log(uID);

            const isAlready = await isAlreadyLiked(pID, uID, likeID);
            console.log("isAlready is : ", isAlready);
            if (isAlready === null) {
                db.query("INSERT INTO likecounts(pID, uID, likeID, likeCount) VALUES(?, ?, ?, ?)", [pID, uID, likeID, likeCount], (error: Error) => {
                    if (error) {
                        console.log(error);
                    }
                });
            }
            else {
                const isLikeFound = await ifLikeFound(pID, uID, likeID);
                if (isLikeFound === null) {
                    const counts = isAlready.likeCount + 1;
                    console.log("Counts is : ", counts);
                    db.query("UPDATE likecounts SET likeCount=? where pID=? and uID=? and likeID=?", [counts, pID, uID, likeID])
                }
                else {
                    db.query("DELETE FROM likecounts where pID=? and uID=? and likeID=?", [pID, uID, likeID], (error: Error) => {
                        if (error) {
                            console.log(error);
                        }
                    })
                }
            }
        }

        console.log("pID and likeCount is : ", pID, likeCount);
        return new Response(JSON.stringify({ message: "Ok" }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        });
    } catch(error) {
        console.log("error in update like count is: ", error);
        return new Response(JSON.stringify({ message: "Not ok" }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
} 