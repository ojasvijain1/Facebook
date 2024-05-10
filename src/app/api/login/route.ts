import db from "../../utils/db";
import jwt from 'jsonwebtoken';

export const SECRETKEY = "123456789";

interface User {
    email: string;
    password: string;
    fname: string;
    lname: string;
}

async function gettingUser(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users where email=?", [email], (error: Error, results: Array<User>) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : null);
            }
        })
    })
}

export async function POST(request: Request) {
    const data = await request.json();
    try {
        const { email, password } = data;
        const user = await gettingUser(email);
        if (!user) {
            return new Response(JSON.stringify({message: "User not found. Please Sign Up"}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 404,
            });
        } else {
            if (password !== user.password) {
                return new Response(JSON.stringify({message: "Invalid credentials. Please type correct credentials"}), {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    status: 401,
                });
            } else {
                console.log("user is : ", user);
                const fname = user['fname'];
                const lname = user['lname'];
                const userName = fname + " " + lname;

                const token = jwt.sign({ username: userName, fname: fname, email: email }, SECRETKEY, { expiresIn: "1h" });
                console.log("Token is : ", token);

                return new Response(JSON.stringify({message: "Login Successful", token: token}), {
                    headers: {
                        "Content-Type": "application/json",
                        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; SameSite=Strict`,
                    },
                    status: 201,
                });
            }
        }
    } catch(error) {
        console.log("error is : ", error);
        return new Response(JSON.stringify({message: "Failed. An error occured", error}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}