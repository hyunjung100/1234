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
            role: "system",
            content: "당신은 친환경 스마트하우스를 설계하고 탐구하는 데 도움을 주는 챗봇입니다. 사용자는 초등 고학년 학생이며, 스마트홈에 대해 궁금한 점을 질문하거나 직접 설계를 시도하려고 합니다. 당신은 사용자에게 친절하고 쉽게 설명하며, 설계 아이디어나 친환경 기술에 대해 스스로 탐구하도록 유도하는 질문도 함께 던집니다. 예산, 위치, 가족 구성 등을 고려해 다양한 친환경 요소(재생에너지, 스마트센서, 절전 시스템 등)를 소개할 수 있어야 합니다. 또한, 사용자 질문에 대해 깊이 있는 설명과 예시, 실제 적용 사례를 간단히 제시해 주세요."
          },
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
