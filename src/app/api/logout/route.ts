export async function GET(request: Request) {
    try {
      // Clear the token cookie
      const response = new Response(JSON.stringify({message: "User logged out successfully: "}), {
          headers: {
              "Content-Type": "application/json",
              "Set-Cookie": 'token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict'
          },
          status: 302,
      })
      return response;
    } catch (error) {
      console.error('Error logging out:', error);
      return new Response(JSON.stringify("Internal Server error"), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      });
    }
  }