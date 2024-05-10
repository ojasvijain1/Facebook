import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'buffer';
import db from "../../utils/db";
import { SECRETKEY } from '../login/route';
import jwt, { JwtPayload } from 'jsonwebtoken';

cloudinary.config({ 
  cloud_name: 'dm39cq43w', 
  api_key: '564847437543791', 
  api_secret: 'r-dKfLNv0njpGJB0xmHDijjkHDc' 
});

interface User {
    uID: number;
}

function gettingUID(fname: string): Promise<User> {
    return new Promise((resolve, reject) => {
        db.query("SELECT uID FROM users where fname=?", [fname], (error: Error, results: Array<User>) => {
            if (error) {
                console.log("error", error);
                reject(error);
            }
            else {
                resolve(results[0]);
            }
        });
    });
}

export async function POST(request: Request) {
    try {
        // Parse the multipart form data
        const formData = await request.formData();

        console.log("FormData is : ", formData);

        // Access the file data
        const photo = formData.get('photo') as File;
        if (!photo) {
            throw new Error('Photo data not found');
        }

        // Read the file data as a Buffer
        let imageBuffer: Buffer;
        if (typeof FileReader !== 'undefined') {
            // Use FileReader if available
            imageBuffer = await new Promise
            ((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && event.target.result) {
                        const buffer = Buffer.from(event.target.result as ArrayBuffer);
                        resolve(buffer);
                    } else {
                        reject(new Error('Failed to read file data'));
                    }
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsArrayBuffer(photo);
            });
        } else {
            // Use Buffer if FileReader is not available (e.g., server-side)
            imageBuffer = Buffer.from(await photo.arrayBuffer());
        }

        // Upload the image to Cloudinary using upload_stream
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'uploads'
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            uploadStream.write(imageBuffer);
            uploadStream.end();
        });

        // Log the result
        console.log(uploadResult);

        // Return a response indicating success

        const cookies = request.headers.get('Cookie');
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

        const fname = decodedToken.fname;
        console.log(fname);

        const user = await gettingUID(fname);

        console.log("User is", user);

        const uID = user.uID;
        console.log('uID is : ', uID);

        db.query("INSERT INTO posts (uID, postURL) VALUES (?, ?)", [uID, uploadResult.secure_url], (error: Error) => {
            if (error)
                console.log("Error is : ", error);
        });

        return new Response(JSON.stringify({ message: "Photo uploaded successfully", imageUrl: uploadResult.secure_url }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 201,
        });
    } catch (error) {
        // If an error occurs during processing, handle it and return an error response
        console.error("Error processing file upload:", error);
        return new Response(JSON.stringify({ error: "Failed to process file upload" }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
}