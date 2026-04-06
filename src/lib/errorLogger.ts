/**
 * Error Logging Service
 * Centralized error tracking and alerting
 */

export enum ErrorSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface LogError {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  stack?: string;
  userId?: string;
  endpoint?: string;
  timestamp?: Date;
}

/**
 * Log error to console and optionally to external service
 */
export function logError(error: LogError) {
  const timestamp = error.timestamp || new Date();
  const severityEmoji = getSeverityEmoji(error.severity);

  const logMessage = `${severityEmoji} [${error.severity}] ${error.message}`;

  // Log to console
  if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
    console.error(logMessage, {
      code: error.code,
      context: error.context,
      stack: error.stack,
      userId: error.userId,
      endpoint: error.endpoint,
      timestamp,
    });
  } else {
    console.warn(logMessage, {
      code: error.code,
      timestamp,
    });
  }

  // Send to external service (e.g., Sentry, Logtail)
  if (process.env.NEXT_PUBLIC_ERROR_TRACKING_URL) {
    sendToErrorTracking(error);
  }

  // Alert if critical
  if (error.severity === ErrorSeverity.CRITICAL) {
    sendAlert(`🚨 Critical Error: ${error.message}`);
  }
}

/**
 * Log API error with request context
 */
export function logApiError(
  message: string,
  statusCode: number,
  endpoint: string,
  userId?: string,
  context?: Record<string, any>
) {
  const severityMap: Record<number, ErrorSeverity> = {
    400: ErrorSeverity.LOW,
    401: ErrorSeverity.MEDIUM,
    403: ErrorSeverity.MEDIUM,
    404: ErrorSeverity.LOW,
    500: ErrorSeverity.CRITICAL,
    503: ErrorSeverity.CRITICAL,
  };

  const severity = severityMap[statusCode] || ErrorSeverity.MEDIUM;

  logError({
    message,
    code: `HTTP_${statusCode}`,
    severity,
    endpoint,
    userId,
    context: {
      statusCode,
      ...context,
    },
  });
}

/**
 * Log database error
 */
export function logDatabaseError(message: string, error: any, context?: Record<string, any>) {
  logError({
    message,
    code: "DB_ERROR",
    severity: ErrorSeverity.HIGH,
    context: {
      dbMessage: error?.message || String(error),
      ...context,
    },
    stack: error?.stack,
  });
}

/**
 * Log payment error
 */
export function logPaymentError(
  message: string,
  paymentMethod: string,
  transactionId: string,
  error?: any
) {
  logError({
    message,
    code: "PAYMENT_ERROR",
    severity: ErrorSeverity.CRITICAL,
    context: {
      paymentMethod,
      transactionId,
      error: error?.message || String(error),
    },
    stack: error?.stack,
  });
}

/**
 * Log authentication error
 */
export function logAuthError(message: string, userId?: string, context?: Record<string, any>) {
  logError({
    message,
    code: "AUTH_ERROR",
    severity: ErrorSeverity.MEDIUM,
    userId,
    context,
  });
}

/**
 * Get emoji for severity level
 */
function getSeverityEmoji(severity: ErrorSeverity): string {
  const emojiMap = {
    [ErrorSeverity.LOW]: "ℹ️",
    [ErrorSeverity.MEDIUM]: "⚠️",
    [ErrorSeverity.HIGH]: "🔴",
    [ErrorSeverity.CRITICAL]: "🚨",
  };
  return emojiMap[severity];
}

/**
 * Send error to external tracking service
 */
async function sendToErrorTracking(error: LogError) {
  try {
    await fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_URL || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        code: error.code,
        severity: error.severity,
        context: error.context,
        timestamp: error.timestamp,
        environment: process.env.NODE_ENV,
      }),
    });
  } catch (err) {
    console.error("Failed to send to error tracking:", err);
  }
}

/**
 * Send critical alert (Slack, Discord, Email)
 */
async function sendAlert(message: string) {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

  if (slackWebhook) {
    try {
      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message,
          username: "PromptVN Error",
          icon_emoji: ":warning:",
        }),
      });
    } catch (err) {
      console.error("Failed to send Slack alert:", err);
    }
  }

  if (discordWebhook) {
    try {
      await fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          username: "PromptVN Error Bot",
        }),
      });
    } catch (err) {
      console.error("Failed to send Discord alert:", err);
    }
  }
}

/**
 * Create structured error response for API
 */
export function createErrorResponse(
  message: string,
  statusCode: number,
  details?: Record<string, any>
) {
  return {
    error: {
      message,
      code: `ERR_${statusCode}`,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && { details }),
    },
  };
}
