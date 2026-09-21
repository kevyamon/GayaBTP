import { authService, AuthSuccessData } from './auth.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: string;
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            }
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '522197281815-75ki4cgif17a0tpt4c4f0l1dqmuibn5n.apps.googleusercontent.com';

/**
 * Déclenche l'affichage officiel de la boîte de dialogue Google Sign-In
 */
export const triggerGoogleSignIn = (
  onSuccess: (data: AuthSuccessData) => void,
  onError: (errorMsg: string) => void
): void => {
  if (typeof window === 'undefined') return;

  if (!window.google?.accounts?.id) {
    onError('Le service Google Identity n’a pas pu être chargé. Vérifiez votre connexion internet.');
    return;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        if (!response?.credential) {
          onError('Aucun jeton Google reçu.');
          return;
        }

        try {
          const authData = await authService.loginWithGoogle(response.credential);
          onSuccess(authData);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Erreur lors de la connexion Google.';
          onError(msg);
        }
      },
      cancel_on_tap_outside: true,
    });

    // Affichage de la boîte de dialogue Google
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // En cas de blocage tiers (ex: cookies tiers désactivés), tentative via déclencheur alternatif
        const hiddenDiv = document.createElement('div');
        hiddenDiv.style.display = 'none';
        document.body.appendChild(hiddenDiv);
        window.google?.accounts?.id?.renderButton(hiddenDiv, { size: 'large' });
        const btn = hiddenDiv.querySelector('div[role=button]') as HTMLElement | null;
        if (btn) {
          btn.click();
        }
        setTimeout(() => hiddenDiv.remove(), 2000);
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Impossible d’ouvrir la boîte Google.';
    onError(msg);
  }
};
