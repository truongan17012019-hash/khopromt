export interface CartItem {
  promptId: string;
  title: string;
  price: number;
}

/**
 * Track abandoned cart when user adds items but doesn't checkout
 * This function should be called in the checkout flow to detect abandonment
 * 
 * @param email - User's email address
 * @param items - Array of items in the cart
 */
export async function trackAbandonedCart(email: string, items: CartItem[]): Promise<void> {
  try {
    if (!email || items.length === 0) {
      return;
    }

    const response = await fetch('/api/abandoned-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        items,
        action: 'save'
      })
    });

    if (!response.ok) {
      console.error('Failed to track abandoned cart');
    }
  } catch (error) {
    console.error('Error tracking abandoned cart:', error);
  }
}

/**
 * Clear abandoned cart when user completes checkout
 * @param email - User's email address
 */
export async function clearAbandonedCart(email: string): Promise<void> {
  try {
    if (!email) {
      return;
    }

    // Implement cart clearing logic if needed
    // For now, we could mark it as recovered
    const response = await fetch('/api/abandoned-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        action: 'recover'
      })
    });

    if (!response.ok) {
      console.error('Failed to clear abandoned cart');
    }
  } catch (error) {
    console.error('Error clearing abandoned cart:', error);
  }
}