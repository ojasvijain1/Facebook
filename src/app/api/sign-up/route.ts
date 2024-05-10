import db from "../../utils/db";

interface User {
    email: string;
    password: string;
    lname: string;
    fname: string;
    day: string;
    month: string;
    year: string;
    sex: string;
}

async function gettingUsers(email: string): Promise<User | null> {
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

export async function POST(req: Request) {
    const data = await req.json();
    try {
        console.log("data is ", data.data);
        const {fname, lname, email, password, day, sex} = data.data;
        const year = day.split('-')[0];
        const month = day.split('-')[1];
        const date = day.split('-')[2];
        console.log(fname, lname, email, password, date, month, year, sex);
        
        const users = await gettingUsers(email);
        if (users) {
            return new Response(JSON.stringify({message: "This email is already registered. Please Log in"}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 401,
            });
        }
        else {
            db.query("INSERT INTO users(uID, fname, lname, email, password, day, month, year, gender) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?)", [fname, lname, email, password, date, month, year, sex], (error: Error) => {
                if (error) {
                    console.log("Error: ", error);
                }
                else {
                    console.log("Success");
                }
            })
            return new Response(JSON.stringify({message: "Sign Up Successful"}), {
                headers: {
                    "Content-Type": "application/json",
                },
                status: 200,
            });
        }
    } catch(error) {
        return new Response(JSON.stringify({message: "Failed. An error occured", error}), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}