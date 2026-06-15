export const generateResponse = async (prompt) => {
    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: "You must return only valid raw JSON. No markdown. No backticks. No explanation. No extra text.",
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.2,
            }),
        });

        if (!res.ok) {
            const err = await res.text()
            throw new Error("OpenRouter err " + err)
        }

        const data = await res.json()
        const content = data.choices?.[0]?.message?.content || ""

        if (!content) {
            throw new Error("Empty response from AI")
        }

        return content

    } catch (error) {
        throw new Error("OpenRouter error: " + error.message)
    }
}