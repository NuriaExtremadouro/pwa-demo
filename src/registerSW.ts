// Check if the path of the Service Worker returns a valid file
const checkIfServiceWorkerExists = async (swUrl: string): Promise<Boolean> => {
  const headers = { 'Service-Worker': 'script' }

  // Try fetching the service worker
  return fetch(swUrl, { headers })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      const isFoundAndValid = () => 
        !(response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1));

      return isFoundAndValid();
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      return false;
    });
}

// Register Service Worker
const registerServiceWorker = (swUrl: string): void => {
  // Registration
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // If we detect any changes on the SW, it will be installed as a new one (Installation)
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        // When the installation is done, we handle our offline behaviour (Activation)
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('New content available. Close all tabs to see it.');
            } else {
              console.log('Content cached.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

// Register the Service Worker
export const register = (): void => {
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

  // Check for SW support on the browser
  if ('serviceWorker' in navigator) {
    // Wait until the page is loaded before using resources for the SW
    window.addEventListener('load', () => {
      // Check if the SW path is valid
      checkIfServiceWorkerExists(swUrl)
        .then(exists => {
          if (exists) {
            registerServiceWorker(swUrl)
          } else {
            unregister();
          }
        })
    });
  }
}

// Unregister the Service Worker
export const unregister = (): void => {
  // Check for SW support on the browser
  if ('serviceWorker' in navigator) {
    // Unregister the SW
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
