// PWA Installation and Update Utilities

let deferredPrompt;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
});

// Show install promotion
function showInstallPromotion() {
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
}

// Install PWA
export function installPWA() {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  }
}

// Check if PWA is installed
export function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Register for push notifications
export async function registerForPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY') // Replace with your VAPID key
        });
        
        console.log('Push notification subscription:', subscription);
        return subscription;
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }
  return null;
}

// Convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check for app updates
export async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.update();
  }
}

// Show update available notification
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Show update notification
      if (confirm('تحديث جديد متاح للتطبيق. هل تريد إعادة تحميل الصفحة؟')) {
        window.location.reload();
      }
    });
  }
});

// Handle app shortcuts
export function handleAppShortcuts() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  
  switch (action) {
    case 'search':
      // Focus on search input
      const searchInput = document.querySelector('input[placeholder*="من"]');
      if (searchInput) {
        searchInput.focus();
      }
      break;
    case 'nearby':
      // Show nearby stations
      // This would trigger the nearby stations functionality
      break;
    default:
      break;
  }
}
