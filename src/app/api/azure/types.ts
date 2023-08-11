export interface IFetchAzureOpenAI {
  messages: any[];
  fetchURL: string;
  Authorization: string;
  temperature?: number;
  max_tokens?: number;
}
