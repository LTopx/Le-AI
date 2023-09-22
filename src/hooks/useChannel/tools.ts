export async function summarize(
  messages: any[],
  proxy: string,
  Authorization: string,
  summarize_content: string
) {
  try {
    const params = {
      messages: messages.map((item) => ({
        role: item.role,
        content: item.content,
      })),
      summarize_content,
      proxy,
    };
    const res = await fetch("/api/openai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization },
      body: JSON.stringify(params),
    }).then((res) => res.json());
    return res.data;
  } catch (error) {
    console.log(error, "summarize error");
  }
}
