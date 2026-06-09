const BACKEND_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', () => {
  const ingestScreen = document.getElementById('ingest-screen');
  const chatScreen = document.getElementById('chat-screen');
  const currentUrlText = document.getElementById('current-url');
  const ingestBtn = document.getElementById('ingest-btn');
  const resetBtn = document.getElementById('reset-btn');
  const chatWindow = document.getElementById('chat-window');
  const queryInput = document.getElementById('query-input');
  const sendBtn = document.getElementById('send-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingText = document.getElementById('loading-text');

  let activeTabUrl = '';
  let activeTabTitle = '';

  // Get active tab info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const tab = tabs[0];
      activeTabUrl = tab.url;
      activeTabTitle = tab.title;

      // Hide active tab URL if it is a chrome internal URL
      if (activeTabUrl.startsWith('chrome://') || activeTabUrl.startsWith('edge://') || activeTabUrl.startsWith('about:')) {
        currentUrlText.textContent = 'Cannot analyze browser settings pages.';
        ingestBtn.disabled = true;
        ingestBtn.style.opacity = '0.5';
      } else {
        currentUrlText.textContent = activeTabUrl;
      }
    }
  });

  // Action: Ingest URL
  ingestBtn.addEventListener('click', async () => {
    if (!activeTabUrl) return;

    showLoading('Analyzing and indexing page content...');
    try {
      const formData = new URLSearchParams();
      formData.append('url', activeTabUrl);

      const response = await fetch(`${BACKEND_URL}/ingest/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ingest URL');
      }

      const result = await response.json();
      hideLoading();
      
      // Transition to chat screen
      ingestScreen.classList.remove('active');
      chatScreen.classList.add('active');
      resetBtn.style.display = 'flex';

      // Load initial bot message
      loadMessages([
        { role: 'bot', text: `Hi! I have successfully read and analyzed this page. Ask me anything about it!` }
      ]);

    } catch (error) {
      hideLoading();
      alert(`Error: ${error.message}`);
    }
  });

  // Action: Reset/Analyze New Page
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to stop chatting with this page and analyze a new one?')) {
      chatScreen.classList.remove('active');
      ingestScreen.classList.add('active');
      resetBtn.style.display = 'none';
      chatWindow.innerHTML = '';
    }
  });

  // Action: Send Message
  sendBtn.addEventListener('click', sendMessage);
  queryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  async function sendMessage() {
    const question = queryInput.value.trim();
    if (!question) return;

    // Append user message
    appendMessage('user', question);
    queryInput.value = '';

    // Show loading indicator in bubble
    const loadingBubble = appendMessage('bot', 'Thinking...');
    
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from bot');
      }

      const result = await response.json();
      
      // Replace loading bubble with real response
      loadingBubble.remove();
      appendMessage('bot', result.answer, result.sources);

    } catch (error) {
      loadingBubble.remove();
      appendMessage('bot', `Sorry, I encountered an error: ${error.message}`);
    }
  }

  function appendMessage(role, text, sources = []) {
    const row = document.createElement('div');
    row.classList.add('message-row', role);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerText = text;
    row.appendChild(bubble);

    // If bot has matching sources, add sources list
    if (role === 'bot' && sources && sources.length > 0) {
      const sourcesDiv = document.createElement('div');
      sourcesDiv.classList.add('sources-container');
      
      const toggle = document.createElement('button');
      toggle.classList.add('sources-toggle');
      toggle.innerText = `Sources (${sources.length})`;
      
      const list = document.createElement('div');
      list.classList.add('sources-list');
      list.style.display = 'none';

      sources.forEach((source, index) => {
        const item = document.createElement('div');
        item.classList.add('source-item');
        item.innerText = `Chunk #${index + 1}: "${source.trim()}"`;
        list.appendChild(item);
      });

      toggle.addEventListener('click', () => {
        const isHidden = list.style.display === 'none';
        list.style.display = isHidden ? 'flex' : 'none';
      });

      sourcesDiv.appendChild(toggle);
      sourcesDiv.appendChild(list);
      row.appendChild(sourcesDiv);
    }

    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    return row;
  }

  function loadMessages(messages) {
    chatWindow.innerHTML = '';
    messages.forEach(msg => appendMessage(msg.role, msg.text, msg.sources));
  }

  function showLoading(text) {
    loadingText.textContent = text;
    loadingOverlay.classList.add('active');
  }

  function hideLoading() {
    loadingOverlay.classList.remove('active');
  }
});
