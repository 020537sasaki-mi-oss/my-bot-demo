(function() {
    // 1. Shadow DOMの仕組みを使って、既存サイトとデザインが混ざらないようにする
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    // 2. チャットボット専用のスタイル（CSS）
    const style = document.createElement('style');
    style.textContent = `
        .chat-btn {
            position: fixed; bottom: 20px; right: 20px;
            width: 60px; height: 60px; background: #4285F4;
            border-radius: 50%; cursor: pointer; display: flex;
            align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 9999;
            transition: transform 0.3s;
        }
        .chat-btn:hover { transform: scale(1.1); }
        .chat-btn svg { width: 30px; height: 30px; fill: white; }

        .chat-window {
            position: fixed; bottom: 90px; right: 20px;
            width: 350px; height: 450px; background: white;
            border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: none; flex-direction: column; overflow: hidden;
            font-family: 'Segoe UI', sans-serif; z-index: 9999;
        }
        .header { background: #4285F4; color: white; padding: 15px; font-weight: bold; }
        .messages { flex: 1; padding: 15px; overflow-y: auto; background: #f9f9f9; display: flex; flex-direction: column; gap: 10px; }
        .msg { padding: 8px 12px; border-radius: 10px; font-size: 14px; max-width: 80%; line-height: 1.4; }
        .bot { background: #eee; align-self: flex-start; }
        .user { background: #4285F4; color: white; align-self: flex-end; }
        .input-area { border-top: 1px solid #ddd; padding: 10px; display: flex; }
        input { flex: 1; border: none; outline: none; padding: 8px; }
    `;

    // 3. HTML構造
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="chat-btn">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div class="chat-window">
            <div class="header">AI Assistant Demo</div>
            <div class="messages" id="msgs">
                <div class="msg bot">こんにちは！何かお手伝いしましょうか？</div>
            </div>
            <div class="input-area">
                <input type="text" id="userInput" placeholder="メッセージを入力...">
            </div>
        </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    // 4. ボタンを押した時の開閉処理
    const btn = shadow.querySelector('.chat-btn');
    const window = shadow.querySelector('.chat-window');
    btn.onclick = () => {
        window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
    };

    // 5. メッセージ送信処理
    const input = shadow.querySelector('#userInput');
    const msgs = shadow.querySelector('#msgs');

    input.onkeypress = async (e) => {
        if (e.key === 'Enter' && input.value.trim() !== "") {
            const text = input.value;
            appendMsg(text, 'user');
            input.value = "";

            // --- ここであなたのバックエンドURLを呼び出します ---
            appendMsg("（接続先が設定されると、ここにAIの回答が表示されます）", "bot");
            
            // 例: const res = await fetch('YOUR_GCP_API_URL', { ... });
        }
    };

    function appendMsg(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }
})();
