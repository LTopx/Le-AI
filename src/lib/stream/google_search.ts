export const google_search = async (keyword: string) => {
  let result = "No good search result found";
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: keyword,
        hl: "zh-cn",
      }),
    }).then((res) => res.json());

    let result = "No good search result found";

    if (res.answerBox && res.answerBox instanceof Array) {
      res.answerBox = res.answerBox[0];
    }

    if (res.answerBox?.answer) {
      result = res.answerBox.answer;
    } else if (res.answerBox?.snippet) {
      result = res.answerBox.snippet;
    } else if (res.answerBox?.snippetHighlightedWords) {
      result = res.answerBox.snippetHighlightedWords[0];
    } else if (res.sports_results?.gameSpotlight) {
      result = res.sports_results.gameSpotlight;
    } else if (res.knowledge_graph?.description) {
      result = res.knowledge_graph.description;
    }

    return "search result:\n" + result;
  } catch {
    return "search result:\n" + result;
  }
};
