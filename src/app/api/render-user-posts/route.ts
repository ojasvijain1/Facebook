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

export async function POST(request: Request) {
    const data = await request.json();
    const username = data.username;
    const user = await gettingUID(username);

    const uID = user.uID;
    console.log(uID);
    
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