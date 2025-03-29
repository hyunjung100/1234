export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "응답을 생성할 수 없습니다.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API 호출 오류:", error);
    return res.status(500).json({ error: "서버 오류 발생" });
  }
}
