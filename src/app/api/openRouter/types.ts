export interface IFetchOpenRouter {
  messages: any[];
  fetchURL: string;
  Authorization: string;
  model: string;
  temperature?: number;
  max_tokens?: number;
}
