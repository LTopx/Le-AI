export interface IFetchOpenAI {
  messages: any[];
  fetchURL: string;
  Authorization: string;
  model: string;
  temperature?: number;
  max_tokens?: number;
}
