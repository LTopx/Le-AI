type GoogleSearch = {
  enable: boolean;
  engine_id: string;
  api_key: string;
};

export type PluginStore = {
  google_search: GoogleSearch;

  updateGoogleSearch: (google_search: GoogleSearch) => void;
};
