import { useEffect, useState } from 'react';

export interface ReferralInfo {
  code: string | null;
  timestamp: string | null;
}

/**
 * Hook to manage referral tracking
 * Retrieves stored referral code from localStorage
 * Should be called during signup to track referred user
 */
export function useReferral(): ReferralInfo {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo>({
    code: null,
    timestamp: null,
  });

  useEffect(() => {
    const code = localStorage.getItem('referral_code');
    const timestamp = localStorage.getItem('referral_timestamp');
    
    setReferralInfo({
      code,
      timestamp,
    });
  }, []);

  return referralInfo;
}

/**
 * Track signup with referral code
 * Call this when a user completes signup with a referral code
 */
export async function trackReferralSignup(
  referralCode: string,
  userEmail: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'track_signup',
        code: referralCode,
        referred_email: userEmail,
      }),
    });

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('Failed to track referral signup:', error);
    return false;
  }
}

/**
 * Complete referral reward when referred user makes first purchase
 * Call this in the checkout/payment completion flow
 */
export async function completeReferralReward(
  referredEmail: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'complete',
        referred_email: referredEmail,
      }),
    });

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('Failed to complete referral reward:', error);
    return false;
  }
}