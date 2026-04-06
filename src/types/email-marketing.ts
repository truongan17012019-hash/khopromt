/**
 * Email Marketing System Types
 * Complete type definitions for newsletter, campaigns, and abandoned carts
 */

// ============================================================================
// NEWSLETTER TYPES
// ============================================================================

export interface NewsletterSubscriber {
  email: string;
  name: string;
  subscribed_at: string; // ISO 8601 timestamp
  status: 'active' | 'unsubscribed';
  source: 'footer' | 'popup' | 'checkout';
}

export interface SubscribeRequest {
  email: string;
  name: string;
  source?: 'footer' | 'popup' | 'checkout';
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface UnsubscribeRequest {
  email: string;
}

export interface GetSubscribersResponse {
  success: boolean;
  data: NewsletterSubscriber[];
  error?: string;
}

// ============================================================================
// EMAIL CAMPAIGN TYPES
// ============================================================================

export type CampaignType = 'newsletter' | 'abandoned_cart' | 'welcome' | 'promo';
export type CampaignStatus = 'draft' | 'sent';

export interface EmailCampaign {
  id: string; // camp_${timestamp}
  subject: string;
  content: string;
  type: CampaignType;
  status: CampaignStatus;
  sent_at?: string; // ISO 8601 timestamp
  recipients_count: number;
  open_count: number;
  click_count: number;
  created_at: string; // ISO 8601 timestamp
}

export interface CreateCampaignRequest {
  action: 'create';
  subject: string;
  content: string;
  type: CampaignType;
}

export interface SendCampaignRequest {
  action: 'send';
  campaign_id: string;
}

export type CampaignRequest = CreateCampaignRequest | SendCampaignRequest;

export interface CreateCampaignResponse {
  success: boolean;
  message: string;
  data?: EmailCampaign;
  error?: string;
}

export interface GetCampaignsResponse {
  success: boolean;
  data: EmailCampaign[];
  error?: string;
}

export interface CampaignStats {
  id: string;
  subject: string;
  type: CampaignType;
  status: CampaignStatus;
  recipientsCount: number;
  openRate: number; // percentage
  clickRate: number; // percentage
  sentAt?: string;
}

// ============================================================================
// ABANDONED CART TYPES
// ============================================================================

export interface CartItem {
  promptId: string;
  title: string;
  price: number; // Price in VND
}

export interface AbandonedCart {
  email: string;
  items: CartItem[];
  created_at: string; // ISO 8601 timestamp
  reminded: boolean;
  recovered: boolean;
}

export interface SaveAbandonedCartRequest {
  email: string;
  items: CartItem[];
  action?: never;
}

export interface RemindAbandonedCartRequest {
  email: string;
  action: 'remind';
  items?: never;
}

export interface RecoverAbandonedCartRequest {
  email: string;
  action: 'recover';
  items?: never;
}

export type AbandonedCartRequest = 
  | SaveAbandonedCartRequest 
  | RemindAbandonedCartRequest 
  | RecoverAbandonedCartRequest;

export interface AbandonedCartResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface GetAbandonedCartsResponse {
  success: boolean;
  data: AbandonedCart[];
  error?: string;
}

export interface AbandonedCartStats {
  email: string;
  itemCount: number;
  totalValue: number; // in VND
  daysSinceAbandonment: number;
  reminded: boolean;
  recovered: boolean;
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface EmailMarketingStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribeRate: number; // percentage
  campaignsSent: number;
  averageOpenRate: number; // percentage
  averageClickRate: number; // percentage
  abandonedCartCount: number;
  cartRecoveryRate: number; // percentage
}

export interface SubscriberSourceBreakdown {
  footer: number;
  popup: number;
  checkout: number;
}

export interface SubscriberMetrics extends EmailMarketingStats {
  sourceBreakdown: SubscriberSourceBreakdown;
  recentSubscribers: NewsletterSubscriber[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

// ============================================================================
// FORM STATE TYPES
// ============================================================================

export interface NewsletterFormState {
  email: string;
  name: string;
  loading: boolean;
  error: string | null;
  subscribed: boolean;
}

export interface CampaignFormState {
  subject: string;
  content: string;
  type: CampaignType;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// ============================================================================
// FILTER & PAGINATION TYPES
// ============================================================================

export interface SubscriberFilter {
  status?: 'active' | 'unsubscribed' | 'all';
  source?: 'footer' | 'popup' | 'checkout' | 'all';
  searchTerm?: string;
}

export interface CampaignFilter {
  status?: 'draft' | 'sent' | 'all';
  type?: CampaignType | 'all';
  searchTerm?: string;
}

export interface AbandonedCartFilter {
  showReminded?: boolean;
  showRecovered?: boolean;
  minDaysAbandoned?: number;
  searchEmail?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface EmailProviderConfig {
  provider: 'resend' | 'sendgrid' | 'ses' | 'smtp';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DateRange = {
  start: Date;
  end: Date;
};

export interface AuditLog {
  id: string;
  action: string;
  email?: string;
  campaignId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreference {
  email: string;
  newsletters: boolean;
  promotions: boolean;
  abandonedCart: boolean;
  general: boolean;
  frequency: 'immediately' | 'daily' | 'weekly' | 'never';
}