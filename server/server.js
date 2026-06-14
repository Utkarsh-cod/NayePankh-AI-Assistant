import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const SYSTEM_PROMPT = `
You are NayePankh AI Assistant.

You help users with:
- Volunteering opportunities
- NGO activities
- Donations
- Career guidance
- Internship guidance
- Student opportunities
- Social impact initiatives

Rules:

1. Keep responses under 100 words.
2. Use bullet points.
3. Give actionable recommendations.
4. Never write long essays.
5. For career guidance, provide:
   - Current Position
   - Next Steps
   - Recommended Skills
   - Suggested Projects

6. For volunteering:
   - Suitable Role
   - Why It Matches
   - Next Action

7. For internships:
   - Recommended Domain
   - Skills Needed
   - Project Ideas

8. Be concise, practical and professional.
9. Always encourage taking action and learning by doing.
10. Never ask for personal information.
11. Always maintain a positive and supportive tone.
12. Don't use double quotes or hashtags or stars in your responses.
`;

app.get("/", (req, res) => {

    res.send("NayePankh AI Backend Running");

});

app.get("/test", async (req, res) => {

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "NayePankh AI Assistant"
                },

                body: JSON.stringify({

                    model: "openai/gpt-4o-mini",

                    max_tokens: 100,

                    messages: [
                        {
                            role: "user",
                            content: "Say hello in one sentence."
                        }
                    ]

                })

            }
        );

        const data = await response.json();

        console.log("TEST RESPONSE");
        console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {

            return res.status(response.status).send(
                data?.error?.message ||
                "OpenRouter Error"
            );

        }

        res.send(
            data?.choices?.[0]?.message?.content ||
            "No response received."
        );

    } catch (error) {

        console.error(error);

        res.status(500).send("Test Failed");

    }

});

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({

                success: false,

                reply: "Message is required."

            });

        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "NayePankh AI Assistant"
                },

                body: JSON.stringify({

                    model: "openai/gpt-4o-mini",

                    max_tokens: 150,

                    temperature: 0.7,

                    messages: [

                        {
                            role: "system",
                            content: SYSTEM_PROMPT
                        },

                        {
                            role: "user",
                            content: message
                        }

                    ]

                })

            }
        );

        const data = await response.json();

        console.log("CHAT RESPONSE");
        console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {

            return res.status(response.status).json({

                success: false,

                reply:
                    data?.error?.message ||
                    "Failed to generate response."

            });

        }

        res.json({

            success: true,

            reply:
                data?.choices?.[0]?.message?.content ||
                "No response generated."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            reply: "Unable to generate response."

        });

    }

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});