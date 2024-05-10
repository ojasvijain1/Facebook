import db from "../../utils/db";

interface User {
    uID: number;
    lname: string;
}

async function fetchUser(username: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        db.query("SELECT uID, lname from users where fname=?", [username], (error: Error, results: Array<User>)=> {
            if (error) {
                console.log("Error is : ", error);
                reject(error);
            }
            else {
                if (results.length > 0)
                    resolve(results[0]);
                else 
                    resolve(null);
            }
        })
    })
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const username = data.username;
        console.log("userName is : ", data.username);
        const user = await fetchUser(username);
        if (!user || user === null) {
            return new Response(JSON.stringify({message: "User not found: "}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 404,
            });
        }
        else {
            const userName = username + " " + user.lname;
            return new Response(JSON.stringify({message: "User found", userName: userName, uID: user.uID}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            });
        }
    } catch(error) {
        return new Response(JSON.stringify({message: "Not ok, something went wrong."}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}