import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Client-side assurance for brand favicon in browser tab and URL address bar
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const version = 'tapco3';
  const iconDefinitions = [
    { rel: 'shortcut icon', href: `/favicon.ico?v=${version}`, type: 'image/x-icon' },
    { rel: 'icon', href: `/favicon.ico?v=${version}`, type: 'image/x-icon' },
    { rel: 'icon', href: `/favicon-32x32.png?v=${version}`, type: 'image/png', sizes: '32x32' },
    { rel: 'icon', href: `/favicon.svg?v=${version}`, type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: `/apple-touch-icon.png?v=${version}`, sizes: '180x180' }
  ];

  iconDefinitions.forEach(({ rel, href, type, sizes }) => {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (type) link.type = type;
      if (sizes) link.setAttribute('sizes', sizes);
      document.head.appendChild(link);
    }
    link.href = href;
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
