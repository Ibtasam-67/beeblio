export const GET_FILTERED_CONTENT = 'GET_FILTERED_CONTENT';
export const HTTP_ERROR = 'HTTP_ERROR';
export const HTTP_SUCCESS = 'HTTP_SUCCESS';
export const HTTP_INFO = 'HTTP_INFO';
export const HTTP_WARN = 'HTTP_WARN';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const SET_CURATED_CONTENT_URL = 'SET_CURATED_CONTENT_URL';
export const LOADER = 'SET_LOADER_STAT';
export const NEW_ALERT = 'NEW_ALERT';
export const CLEAR_ALERT = 'CLEAR_ALERT';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const CLEAR_CURRENT_USER_TOKEN = 'CLEAR_CURRENT_USER_TOKEN'

export interface Stat {
    totalContentSearched: number,
    totalUrlSearched: number,
    totalContentCollected: number,
    totalWordCollected: number
}

export interface Content {
    authors: string[],
    contentId: string,
    contentBody: string,
    contentLink: string,
    contentTitle: string,
    contentType: string,
    country: string,
    curatedContentType: string,
    filterSorting: string,
    frequencyLimit: number,
    isPremium: boolean,
    isbn: string,
    mainGenres: string[],
    publicationDate: Date,
    publisher: string,
    referenceImageLink: string,
    requestBody: string,
    responseBody: string,
    rssFeeds: string[],
    searchedAt: Date,
    sourceLink: string
    subGenres: string[]
    summary: string
    url: string
    version: number,
    userInteractionId: string
}

export interface EsContent {
    authors: string[],
    id: string,
    content_body: string,
    content_link: string,
    name: string,
    content_type: string,
    country: string,
    curated_content_type: string,
    filter_sorting: string,
    frequency_limit: number,
    is_premium: boolean,
    isbn: string,
    main_genres: string[],
    publication_date: Date,
    publisher: string,
    reference_image_link: string,
    request_body: string,
    response_body: string,
    rss_feeds: string[],
    searchedAt: Date,
    source_link: string
    sub_genres: string[]
    summary: string
    url: string
    version: number,
    user_interaction_id: string
}

export interface EsInteraction {
    id: string,
    content_id: string,
    date_created: Date,
    filter_sorting: string,
    frequency_limit: number,
    last_updated: Date,
    request_body: string,
    response_body: string,
    status: string,
    user_id: string,
    content: EsContent
}

export interface AppStat {
    totalContent: number,
    totalContentSearch: number,
    totalUser: number,
    totalWordCollected: number,
    totalWordFiltered: number,
}

export interface WordsAPIDictionaryResult {
    frequency: number,
    pronunciation: any
    results: Result[],
    rhymes: Rhyme[]
    word: string,
    syllables: Syllable
}

export interface Result {
    antonyms: string[],
    definition: string,
    examples: string[],
    partOfSpeech: string,
    synonyms: string[]
}

export interface Rhyme {
    all: string[]
}

export interface Syllable {
    count: number,
    list: string[]
}



export interface OxfordDictionaryResult {
    id: string;
    type: string;
    word: string;
    language: string;
    lexicalEntries: LexicalEntry[];
}

export interface LexicalEntry {
    text: string;
    entries: Entry[];
    language: string;
    lexicalCategory: DomainClass;
    phrases?: DomainClass[];
    derivatives?: DomainClass[];
}

export interface Entry {
    senses: Sense[];
    inflections: Inflection[];
    pronunciations: Pronunciation[];
    etymologies?: string[];
}

export interface Pronunciation {
    dialects: string[];
    phoneticNotation: string;
    phoneticSpelling: string;
    audioFile?: string;
}

export interface Inflection {
    inflectedForm: string;
}

export interface Sense {
    id: string;
    examples: Example[];
    synonyms?: Synonym[];
    definitions: string[];
    thesaurusLinks?: ThesaurusLink[];
    shortDefinitions: string[];
    subsenses?: Subsense[];
    regions?: DomainClass[];
    notes?: Note[];
}

export interface Subsense {
    id: string;
    notes?: Note[];
    examples: Example2[];
    synonyms?: Synonym[];
    definitions: string[];
    thesaurusLinks?: ThesaurusLink[];
    shortDefinitions: string[];
    domainClasses?: DomainClass[];
}

export interface DomainClass {
    id: string;
    text: string;
}

export interface Example2 {
    text: string;
}

export interface ThesaurusLink {
    entry_id: string;
    sense_id: string;
}

export interface Synonym {
    text: string;
    language: string;
}

export interface Example {
    text: string;
    notes?: Note[];
}

export interface Note {
    text: string;
    type: string;
}


export interface TwinwordMeaning {
    entry: string;
    request: string;
    response: string;
    meaning: Meaning;
    ipa: string;
    result_msg: string;
}

export interface Meaning {
    noun: string;
    verb: string;
    adverb: string;
    adjective: string;
}