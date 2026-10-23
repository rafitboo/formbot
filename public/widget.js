(function () {
  const scriptTag = document.currentScript;
  const formId = scriptTag?.getAttribute('data-form-id');
  const host = scriptTag?.getAttribute('data-host') || window.location.origin;

  if (!formId) {
    console.error('FormBot: data-form-id attribute is missing on script tag.');
    return;
  }

  // Floating button
  const button = document.createElement('button');
  button.id = 'formbot-floating-btn';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: '999998',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  });

  // Modal / Iframe Container
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'formbot-container';
  Object.assign(iframeContainer.style, {
    position: 'fixed',
    bottom: '92px',
    right: '24px',
    width: '380px',
    height: '580px',
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: 'calc(100vh - 120px)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    zIndex: '999999',
    display: 'none',
    border: '1px solid rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  });

  const iframe = document.createElement('iframe');
  iframe.src = `${host}/widget/${formId}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  iframeContainer.appendChild(iframe);
  document.body.appendChild(button);
  document.body.appendChild(iframeContainer);

  let isOpen = false;
  button.onclick = function () {
    isOpen = !isOpen;
    iframeContainer.style.display = isOpen ? 'block' : 'none';
    button.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
  };
})();