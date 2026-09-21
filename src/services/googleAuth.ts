import { authService, AuthSuccessData } from './auth.service';

interface GsiNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason?: () => string;
  getSkippedReason?: () => string;
  getDismissedReason?: () => string;
}

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
          prompt: (momentListener?: (notification: GsiNotification) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '522197281815-75ki4cgif17a0tpt4c4f0l1dqmuibn5n.apps.googleusercontent.com';

/**
 * Déclenche l'affichage de la boîte de dialogue Google Sign-In avec gestion de l'annulation
 */
export const triggerGoogleSignIn = (
  onSuccess: (data: AuthSuccessData) => void,
  onError: (errorMsg: string) => void,
  onCancel?: () => void
): void => {
  if (typeof window === 'undefined') return;

  if (!window.google?.accounts?.id) {
    onError('Le service Google n’a pas pu être chargé. Vérifiez votre connexion internet.');
    if (onCancel) onCancel();
    return;
  }

  let isHandled = false;

  const handleCancel = () => {
    if (!isHandled) {
      isHandled = true;
      if (onCancel) onCancel();
    }
  };

  try {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        isHandled = true;
        if (!response?.credential) {
          onError('Aucun jeton Google reçu.');
          if (onCancel) onCancel();
          return;
        }

        try {
          const authData = await authService.loginWithGoogle(response.credential);
          onSuccess(authData);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Erreur lors de la connexion Google.';
          onError(msg);
          if (onCancel) onCancel();
        }
      },
      cancel_on_tap_outside: true,
    });

    // Écoute de l'état de la boîte de dialogue Google avec détection précise des fermetures
    window.google.accounts.id.prompt((notification: GsiNotification) => {
      if (notification.isNotDisplayed?.()) {
        handleCancel();
        return;
      }

      if (notification.isSkippedMoment?.()) {
        handleCancel();
        return;
      }

      if (notification.isDismissedMoment?.()) {
        const reason = notification.getDismissedReason?.();
        if (reason !== 'credential_returned') {
          handleCancel();
        }
      }
    });

    // Écouteur de sécurité sur la reprise de focus de la fenêtre
    const onWindowFocus = () => {
      setTimeout(() => {
        if (!isHandled) {
          handleCancel();
        }
      }, 1000);
      window.removeEventListener('focus', onWindowFocus);
    };

    window.addEventListener('focus', onWindowFocus);
  } catch (err: unknown) {
    isHandled = true;
    const msg = err instanceof Error ? err.message : 'Impossible d’ouvrir la boîte Google.';
    onError(msg);
    if (onCancel) onCancel();
  }
};
