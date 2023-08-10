export const function_call_maps = {
  google_search: {
    name: "google_search",
    description:
      "A tool for performing a Google search and extracting snippets and webpages when you need to search for something you don't know or when your information is not up to date. Input should be a search query.",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "The search keyword",
        },
      },
      required: ["keyword"],
    },
  },
};
