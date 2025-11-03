import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Conditionally load the external embed on non-Chatbot routes
// and hide it on the Chatbot page to avoid the corner avatar there.
const EMBED_SRC = 'https://www.noupe.com/embed/019a3970f83970d4b9df03430fe420d4faaf.js';
const SCRIPT_ID = 'noupe-embed-script';

export default function ExternalEmbed() {
  const location = useLocation();

  useEffect(() => {
    const isChatbot = location.pathname.startsWith('/chatbot');

    const hideNoupeIframes = () => {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      iframes.forEach((iframe) => {
        const src = iframe.getAttribute('src') || '';
        if (src.includes('noupe.com')) {
          iframe.style.display = 'none';
        }
      });
    };

    const unhideNoupeIframes = () => {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      iframes.forEach((iframe) => {
        const src = iframe.getAttribute('src') || '';
        if (src.includes('noupe.com')) {
          iframe.style.display = '';
        }
      });
    };

    if (isChatbot) {
      // On Chatbot page: hide if the widget is present
      hideNoupeIframes();
    } else {
      // On other pages: ensure the script is loaded and show the widget
      if (!document.getElementById(SCRIPT_ID)) {
        const s = document.createElement('script');
        s.id = SCRIPT_ID;
        s.src = EMBED_SRC;
        s.async = true;
        document.body.appendChild(s);
      }
      unhideNoupeIframes();
    }

    // No explicit cleanup to avoid removing script during navigation;
    // we only toggle visibility on Chatbot page.
  }, [location.pathname]);

  return null;
}
