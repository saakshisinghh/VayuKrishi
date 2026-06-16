import { AssistantContext } from './assistant.types';

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageType =
  | 'text'
  | 'voice'
  | 'recommendation'
  | 'disease'
  | 'forecast'
  | 'farm_plan'
  | 'scheme'
  | 'error';

export interface BaseMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  timestamp: Date;
  language: string;
  isStreaming?: boolean;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
  context?: AssistantContext;
}

export interface VoiceMessage extends BaseMessage {
  type: 'voice';
  content: string;
  audioUrl?: string;
  transcript: string;
  duration: number;
}

export interface RecommendationMessage extends BaseMessage {
  type: 'recommendation';
  content: string;
  recommendations: CropRecommendation[];
  context?: AssistantContext;
}

export interface DiseaseMessage extends BaseMessage {
  type: 'disease';
  content: string;
  diseases: DiseaseAlert[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  context?: AssistantContext;
}

export interface ForecastMessage extends BaseMessage {
  type: 'forecast';
  content: string;
  forecast: WeatherForecast[];
  context?: AssistantContext;
}

export interface FarmPlanMessage extends BaseMessage {
  type: 'farm_plan';
  content: string;
  plan: FarmPlanItem[];
  context?: AssistantContext;
}

export interface SchemeMessage extends BaseMessage {
  type: 'scheme';
  content: string;
  schemes: GovernmentScheme[];
  context?: AssistantContext;
}

export type Message =
  | TextMessage
  | VoiceMessage
  | RecommendationMessage
  | DiseaseMessage
  | ForecastMessage
  | FarmPlanMessage
  | SchemeMessage;

export interface CropRecommendation {
  crop: string;
  cropLocal: string;
  confidence: number;
  reason: string;
  season: string;
  expectedYield: string;
}

export interface DiseaseAlert {
  name: string;
  nameLocal: string;
  probability: number;
  severity: string;
  prevention: string[];
}

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  rainfall: number;
  humidity: number;
  condition: string;
}

export interface FarmPlanItem {
  week: number;
  activity: string;
  activityLocal: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export interface GovernmentScheme {
  name: string;
  nameLocal: string;
  benefit: string;
  eligibility: string;
  deadline: string;
  link: string;
}

export interface ConversationSession {
  id: string;
  farmerId: string;
  messages: Message[];
  startedAt: Date;
  lastActiveAt: Date;
  language: string;
  title?: string;
}
