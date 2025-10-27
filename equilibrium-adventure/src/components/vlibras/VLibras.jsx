import React, { useEffect } from 'react';

const VLibras = () => {
  useEffect(() => {
    // Avoid injecting multiple times
    if (document.getElementById('vlibras-plugin-root')) return;

    // Create the plugin root element required by VLibras
    const wrapper = document.createElement('div');
    wrapper.id = 'vlibras-plugin-root';
    wrapper.setAttribute('vw', '');
    wrapper.className = 'enabled';
    wrapper.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(wrapper);
    // debug
    // eslint-disable-next-line no-console
    console.debug('[VLibras] wrapper appended to body');

    // Helper to initialize widget if available
    const tryInit = () => {
      try {
        if (window.VLibras && !window.__vlibrasInitialized) {
          // initialize with the official path
          // eslint-disable-next-line no-new
          new window.VLibras.Widget('https://vlibras.gov.br/app');
          window.__vlibrasInitialized = true;
          // eslint-disable-next-line no-console
          console.debug('[VLibras] initialized widget');
          return true;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[VLibras] erro ao inicializar widget:', e);
      }
      return false;
    };

    // Inject the VLibras plugin script (only once)
    const existing = document.getElementById('vlibras-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'vlibras-script';
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => {
        // eslint-disable-next-line no-console
        console.debug('[VLibras] script loaded');
        // Try immediate init; if not ready, poll a few times
        if (!tryInit()) {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts += 1;
            if (tryInit() || attempts > 10) {
              clearInterval(interval);
              if (attempts > 10) {
                // eslint-disable-next-line no-console
                console.warn('[VLibras] widget did not initialize after polling');
              }
            }
          }, 500);
        }
      };
      script.onerror = () => {
        // eslint-disable-next-line no-console
        console.error('[VLibras] Falha ao carregar script VLibras');
      };
      document.body.appendChild(script);
    } else {
      // script already present - try initialize immediately or poll
      // eslint-disable-next-line no-console
      console.debug('[VLibras] script already present, attempting init');
      if (!tryInit()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts += 1;
          if (tryInit() || attempts > 10) {
            clearInterval(interval);
            if (attempts > 10) {
              // eslint-disable-next-line no-console
              console.warn('[VLibras] widget did not initialize after polling (existing script)');
            }
          }
        }, 500);
      }
    }

    // Cleanup only removes the wrapper and leaves the script in place (so other pages keep working)
    return () => {
      const el = document.getElementById('vlibras-plugin-root');
      if (el && el.parentNode) el.parentNode.removeChild(el);
      // eslint-disable-next-line no-console
      console.debug('[VLibras] wrapper removed');
    };
  }, []);

  return null;
};

export default VLibras;
