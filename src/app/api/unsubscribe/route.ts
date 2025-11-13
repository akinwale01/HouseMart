import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import Subscriber from "../../../../models/Subscriber";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    await connectToDatabase();

    // Find and delete the subscriber
    const deleted = await Subscriber.findOneAndDelete({ email });

    // Determine message based on deletion result
    const message = deleted
      ? "Hate to see you go 😢 Come back soon!"
      : "This email is not subscribed.";

    // Return a clean, styled HTML response
    const htmlResponse = `
      <html>
        <head>
          <title>Unsubscribed | HouseMart</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #fafafa;
              color: #333;
              text-align: center;
              padding: 50px;
              line-height: 1.6;
              letter-spacing: 0.5px;
            }
            .container {
              max-width: 480px;
              margin: auto;
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            h1 {
              color: #f97316;
              font-size: 28px;
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            a {
              display: inline-block;
              margin-top: 20px;
              text-decoration: none;
              background: #f97316;
              color: white;
              padding: 10px 20px;
              border-radius: 8px;
              transition: background 0.3s;
            }
            a:hover {
              background: #ea580c;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${message}</h1>
            ${
              deleted
                ? `<p><b>${email}</b> has been removed from our mailing list.</p>`
                : `<p>The email <b>${email}</b> was not found in our mailing list.</p>`
            }
            <p>If this was a mistake, you can re-subscribe anytime on our website.</p>
            <a href="https://shop-right-nu.vercel.app/blogs">Return to Blog</a>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}