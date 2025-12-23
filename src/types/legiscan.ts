// LegiScan API Type Definitions
// Based on LegiScan API v1.91 User Manual

// ============================================
// Static Value Enums
// ============================================

export enum BillType {
  Bill = 1,
  Resolution = 2,
  ConcurrentResolution = 3,
  JointResolution = 4,
  JointResolutionConstitutionalAmendment = 5,
  ExecutiveOrder = 6,
  ConstitutionalAmendment = 7,
  Memorial = 8,
  Claim = 9,
  Commendation = 10,
  CommitteeStudyRequest = 11,
  JointMemorial = 12,
  Proclamation = 13,
  StudyRequest = 14,
  Address = 15,
  ConcurrentMemorial = 16,
  Initiative = 17,
  Petition = 18,
  StudyBill = 19,
  InitiativePetition = 20,
  RepealBill = 21,
  Remonstration = 22,
  CommitteeBill = 23,
}

export enum EventType {
  Hearing = 1,
  ExecutiveSession = 2,
  MarkupSession = 3,
}

export enum MimeType {
  HTML = 1,
  PDF = 2,
  WordPerfect = 3,
  MSWord = 4,
  RichTextFormat = 5,
  MSWord2007 = 6,
}

export enum PartyId {
  Democrat = 1,
  Republican = 2,
  Independent = 3,
  GreenParty = 4,
  Libertarian = 5,
  Nonpartisan = 6,
}

export enum RoleId {
  Representative = 1,
  Senator = 2,
  JointConference = 3,
}

export enum SASTType {
  SameAs = 1,
  SimilarTo = 2,
  ReplacedBy = 3,
  Replaces = 4,
  CrossFiled = 5,
  EnablingFor = 6,
  EnabledBy = 7,
  Related = 8,
  CarryOver = 9,
}

export enum SponsorType {
  Sponsor = 0,
  PrimarySponsor = 1,
  CoSponsor = 2,
  JointSponsor = 3,
}

export enum Stance {
  Watch = 0,
  Support = 1,
  Oppose = 2,
}

export enum BillStatus {
  NA = 0,
  Introduced = 1,
  Engrossed = 2,
  Enrolled = 3,
  Passed = 4,
  Vetoed = 5,
  Failed = 6,
  Override = 7,
  Chaptered = 8,
  Refer = 9,
  ReportPass = 10,
  ReportDNP = 11,
  Draft = 12,
}

export enum SupplementType {
  FiscalNote = 1,
  Analysis = 2,
  FiscalNoteAnalysis = 3,
  VoteImage = 4,
  LocalMandate = 5,
  CorrectionsImpact = 6,
  Miscellaneous = 7,
  VetoLetter = 8,
}

export enum TextType {
  Introduced = 1,
  CommitteeSubstitute = 2,
  Amended = 3,
  Engrossed = 4,
  Enrolled = 5,
  Chaptered = 6,
  FiscalNote = 7,
  Analysis = 8,
  Draft = 9,
  ConferenceSubstitute = 10,
  Prefiled = 11,
  VetoMessage = 12,
  VetoResponse = 13,
  Substitute = 14,
}

export enum VoteValue {
  Yea = 1,
  Nay = 2,
  NotVoting = 3,
  Absent = 4,
}

// ============================================
// Data Structures
// ============================================

export interface Session {
  session_id: number;
  state_id: number;
  year_start: number;
  year_end: number;
  prefile: number;
  sine_die: number;
  prior: number;
  special: number;
  session_tag: string;
  session_title: string;
  session_name: string;
  dataset_hash?: string;
}

export interface Committee {
  committee_id: number;
  chamber: string;
  chamber_id: number;
  name: string;
}

export interface Referral {
  date: string;
  committee_id: number;
  chamber: string;
  chamber_id: number;
  name: string;
}

export interface HistoryStep {
  date: string;
  action: string;
  chamber: string;
  chamber_id: number;
  importance: number;
}

export interface Progress {
  date: string;
  event: number;
}

export interface Sponsor {
  people_id: number;
  person_hash: string;
  party_id: number;
  party: string;
  role_id: number;
  role: string;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  nickname: string;
  district: string;
  ftm_eid: number;
  votesmart_id: number;
  opensecrets_id: string;
  knowwho_pid: number;
  ballotpedia: string;
  sponsor_type_id: number;
  sponsor_order: number;
  committee_sponsor: number;
  committee_id: string;
}

export interface SAST {
  type_id: number;
  type: string;
  sast_bill_number: string;
  sast_bill_id: number;
}

export interface Subject {
  subject_id: number;
  subject_name: string;
}

export interface TextReference {
  doc_id: number;
  date: string;
  type: string;
  type_id: number;
  mime: string;
  mime_id: number;
  url: string;
  state_link: string;
  text_size: number;
  text_hash: string;
}

export interface VoteReference {
  roll_call_id: number;
  date: string;
  desc: string;
  yea: number;
  nay: number;
  nv: number;
  absent: number;
  total: number;
  passed: number;
  chamber: string;
  chamber_id: number;
  url: string;
  state_link: string;
}

export interface AmendmentReference {
  amendment_id: number;
  adopted: number;
  chamber: string;
  chamber_id: number;
  date: string;
  title: string;
  description: string;
  mime: string;
  mime_id: number;
  url: string;
  state_link: string;
  amendment_size: number;
  amendment_hash: string;
}

export interface SupplementReference {
  supplement_id: number;
  date: string;
  type_id: number;
  type: string;
  title: string;
  description: string;
  mime: string;
  mime_id: number;
  url: string;
  state_link: string;
  supplement_size: number;
  supplement_hash: string;
}

export interface CalendarEvent {
  type_id: number;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Bill {
  bill_id: number;
  change_hash: string;
  session_id: number;
  session: Session;
  url: string;
  state_link: string;
  completed: number;
  status: number;
  status_date: string;
  progress: Progress[];
  state: string;
  state_id: number;
  bill_number: string;
  bill_type: string;
  bill_type_id: string;
  body: string;
  body_id: number;
  current_body: string;
  current_body_id: number;
  title: string;
  description: string;
  pending_committee_id: number;
  committee?: Committee;
  referrals: Referral[];
  history: HistoryStep[];
  sponsors: Sponsor[];
  sasts: SAST[];
  subjects: Subject[];
  texts: TextReference[];
  votes: VoteReference[];
  amendments: AmendmentReference[];
  supplements: SupplementReference[];
  calendar: CalendarEvent[];
}

export interface Person {
  people_id: number;
  person_hash: string;
  state_id: number;
  party_id: string;
  party: string;
  role_id: number;
  role: string;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  nickname: string;
  district: string;
  ftm_eid: number; // Follow the Money entity ID
  votesmart_id: number;
  opensecrets_id: string;
  knowwho_pid: number;
  ballotpedia: string;
  bioguide_id?: string;
  committee_sponsor: number;
  committee_id: number;
  state_federal?: number;
}

export interface IndividualVote {
  people_id: number;
  vote_id: number;
  vote_text: string;
}

export interface RollCall {
  roll_call_id: number;
  bill_id: number;
  date: string;
  desc: string;
  yea: number;
  nay: number;
  nv: number;
  absent: number;
  total: number;
  passed: number;
  chamber: string;
  chamber_id: number;
  votes: IndividualVote[];
}

export interface BillText {
  doc_id: number;
  bill_id: number;
  date: string;
  type: string;
  type_id: number;
  mime: string;
  mime_id: number;
  text_size: number;
  text_hash: string;
  doc: string; // Base64 encoded
}

export interface Amendment {
  amendment_id: number;
  chamber: string;
  chamber_id: number;
  bill_id: number;
  adopted: number;
  date: string;
  title: string;
  description: string;
  mime: string;
  mime_id: number;
  amendment_size: number;
  amendment_hash: string;
  doc: string; // Base64 encoded
}

export interface Supplement {
  supplement_id: number;
  bill_id: number;
  date: string;
  type_id: number;
  type: string;
  title: string;
  description: string;
  mime: string;
  mime_id: number;
  supplement_size: number;
  supplement_hash: string;
  doc: string; // Base64 encoded
}

export interface MasterListItem {
  bill_id: number;
  number: string;
  change_hash: string;
  url: string;
  status_date: string;
  status: string;
  last_action_date: string;
  last_action: string;
  title: string;
  description: string;
}

export interface MasterListRawItem {
  bill_id: number;
  number: string;
  change_hash: string;
}

export interface SearchResultItem {
  relevance: number;
  state: string;
  bill_number: string;
  bill_id: number;
  change_hash: string;
  url: string;
  text_url: string;
  research_url: string;
  last_action_date: string;
  last_action: string;
  title: string;
}

export interface SearchSummary {
  page: string;
  range: string;
  relevancy: string;
  count: number;
  page_current: number;
  page_total: number;
}

export interface SearchRawResultItem {
  relevance: number;
  bill_id: number;
  change_hash: string;
}

export interface Dataset {
  state_id: number;
  session_id: number;
  year_start: number;
  year_end: number;
  prefile: number;
  sine_die: number;
  prior: number;
  special: number;
  session_tag: string;
  session_title: string;
  session_name: string;
  dataset_hash: string;
  dataset_date: string;
  dataset_size: number;
  dataset_size_csv: number;
  access_key: string;
}

export interface DatasetArchive {
  state_id: number;
  session_id: number;
  year_start: number;
  year_end: number;
  prefile: number;
  sine_die: number;
  prior: number;
  special: number;
  session_tag: string;
  session_title: string;
  session_name: string;
  dataset_hash: string;
  dataset_date: string;
  dataset_size: number;
  dataset_size_csv: number;
  mime_type: string;
  zip: string; // Base64 encoded ZIP
}

export interface MonitorListItem {
  bill_id: number;
  state: string;
  number: string;
  stance: number;
  change_hash: string;
  url: string;
  status_date: string;
  status: number;
  last_action_date: string;
  last_action: string;
  title: string;
  description: string;
}

export interface MonitorListRawItem {
  bill_id: number;
  state: string;
  number: string;
  stance: number;
  change_hash: string;
  status: number;
}

export interface SponsoredBillItem {
  session_id: number;
  bill_id: number;
  number: string;
}

export interface SessionPeople {
  session: Session;
  people: Person[];
}

export interface SponsoredBills {
  sponsor: Person;
  sessions: Session[];
  bills: SponsoredBillItem[];
}

// ============================================
// API Response Types
// ============================================

export interface BaseResponse {
  status: "OK" | "ERROR";
  alert?: {
    message: string;
  };
}

export interface SessionListResponse extends BaseResponse {
  sessions: Session[];
}

export interface MasterListResponse extends BaseResponse {
  masterlist: Record<string, MasterListItem>;
}

export interface MasterListRawResponse extends BaseResponse {
  masterlist: Record<string, MasterListRawItem>;
}

export interface BillResponse extends BaseResponse {
  bill: Bill;
}

export interface BillTextResponse extends BaseResponse {
  text: BillText;
}

export interface AmendmentResponse extends BaseResponse {
  amendment: Amendment;
}

export interface SupplementResponse extends BaseResponse {
  supplement: Supplement;
}

export interface RollCallResponse extends BaseResponse {
  roll_call: RollCall;
}

export interface PersonResponse extends BaseResponse {
  person: Person;
}

export interface SearchResponse extends BaseResponse {
  searchresult: {
    summary: SearchSummary;
    [key: string]: SearchResultItem | SearchSummary;
  };
}

export interface SearchRawResponse extends BaseResponse {
  searchresult: {
    summary: SearchSummary;
    results: SearchRawResultItem[];
  };
}

export interface DatasetListResponse extends BaseResponse {
  datasetlist: Dataset[];
}

export interface DatasetResponse extends BaseResponse {
  dataset: DatasetArchive;
}

export interface SessionPeopleResponse extends BaseResponse {
  sessionpeople: SessionPeople;
}

export interface SponsoredListResponse extends BaseResponse {
  sponsoredbills: SponsoredBills;
}

export interface MonitorListResponse extends BaseResponse {
  monitorlist: Record<string, MonitorListItem>;
}

export interface MonitorListRawResponse extends BaseResponse {
  monitorlist: Record<string, MonitorListRawItem>;
}

export interface SetMonitorResponse extends BaseResponse {
  return: Record<string, string>;
}
