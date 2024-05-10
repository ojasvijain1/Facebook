import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRETKEY } from "../login/route";
import db from '../../utils/db';

interface User {
    email: string;
    uID: number;
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

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Data is : ", data);
        const { pID } = data;

        const cookies = req.headers.get('Cookie');
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

        // Step 1: Delete the row with the specified pID and uID
        const deletionResult = await deletePostByIDAndUID(pID, uID);

        // Step 2: If deletion is successful, update the pID for other rows
        if (deletionResult.success) {
            // Determine the minimum pID in the table after deletion
            const minPID = await getMinimumPID();

            // Update pIDs greater than the deleted pID
            await updatePostIDs(minPID, pID);
            await updateAutoIncrementValue();
        }

        // Step 4: Return a response indicating the result
        const message = deletionResult.success ? "Deleted successfully!" : "Not deleted successfully!";
        const status = deletionResult.success ? 200 : 500;

        return new Response(JSON.stringify({ message }), {
            headers: {
                "Content-Type": "application/json",
            },
            status,
        });
    } catch(error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}

async function deletePostByIDAndUID(pID: number, uID: number): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
        // Delete the row with the specified pID and uID
        db.query("DELETE FROM posts WHERE pID = ? AND uID = ?", [pID, uID], (error: Error, results: any) => {
            if (error) {
                console.error("Error deleting post:", error);
                resolve({ success: false });
            } else {
                console.log("Post deleted:", results);
                resolve({ success: true });
            }
        });
    });
}

async function getMinimumPID(): Promise<number> {
    return new Promise((resolve, reject) => {
        // Determine the minimum pID in the table
        db.query("SELECT MIN(pID) AS minPID FROM posts", (error: Error, results: any) => {
            if (error) {
                console.error("Error getting minimum pID:", error);
                resolve(-1); // Return -1 if an error occurs
            } else {
                console.log("Minimum pID:", results[0].minPID);
                resolve(results[0].minPID);
            }
        });
    });
}

async function updatePostIDs(minPID: number, deletedPID: number): Promise<void> {
    return new Promise((resolve, reject) => {
        // Update pIDs greater than the deleted pID
        db.query("UPDATE posts SET pID = pID - 1 WHERE pID > ?", [deletedPID], (error: Error, results: any) => {
            if (error) {
                console.error("Error updating post IDs:", error);
                reject(error);
            } else {
                console.log("Post IDs updated:", results);
                resolve();
            }
        });
    });
}

async function updateAutoIncrementValue(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Get the maximum pID value
        db.query("SELECT MAX(pID) AS maxPID FROM posts", (error: Error, results: any) => {
            if (error) {
                console.error("Error getting maximum pID:", error);
                reject(error);
            } else {
                const maxPID = results[0].maxPID || 0; // If no data in the table, set maxPID to 0
                const nextAutoIncrementValue = maxPID + 1;

                // Update AUTO_INCREMENT value for pID column
                db.query("ALTER TABLE posts AUTO_INCREMENT = ?", [nextAutoIncrementValue], (error: Error, results: any) => {
                    if (error) {
                        console.error("Error updating AUTO_INCREMENT value:", error);
                        reject(error);
                    } else {
                        console.log("AUTO_INCREMENT value updated");
                        resolve();
                    }
                });
            }
        });
    });
}