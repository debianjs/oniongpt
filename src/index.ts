export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const ask = url.searchParams.get("ask");

    if (!ask) {
      return new Response(
        JSON.stringify({ error: "Falta parámetro ?ask" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const CF_ACCOUNT_ID = "29715a4edbff4e4241d11479cf326854";
    const CF_API_KEY = "DLivP1FNXX8v1mvWFN5ispayr1klkTeHbVKIFx0M";
    const MODEL = "@cf/meta/llama/gpt-oss-120b";

    try {
      const aiResp = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CF_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: ask })
        }
      );

      const result = await aiResp.json();
      const reply = result?.result?.response || "🤖 No entendí";

      return new Response(
        JSON.stringify({ question: ask, answer: reply }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: "Error interno", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
