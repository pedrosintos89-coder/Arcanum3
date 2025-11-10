const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const imageInput = document.getElementById('imageInput');
const sendButton = document.getElementById('sendButton');

// دالة لعرض رسالة جديدة في صندوق المحادثة
function appendMessage(sender, text, imageUrl = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(`${sender}-message`);
    messageElement.textContent = text;
    
    if (imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.style.maxWidth = '100%';
        imgElement.style.borderRadius = '10px';
        imgElement.style.marginTop = '10px';
        messageElement.appendChild(imgElement);
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// دالة تحويل ملف الصورة إلى Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result.split(',')[1]); // إزالة الجزء الأول (data:image/jpeg;base64,)
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// الدالة الأساسية للاتصال بالخادم الخلفي
async function getAIResponse(userMessage, base64Image = null) {
    try {
        const response = await fetch('http://127.0.0.1:5000/chat', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: userMessage,
                image: base64Image
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response; 

    } catch (error) {
        console.error('Error fetching AI response:', error);
        return `عذراً، حدث خطأ في الاتصال بنموذج الذكاء الاصطناعي. تأكد من تشغيل الخادم الخلفي (server.py) وسلامة مفتاح API.`;
    }
}

// دالة معالجة الإرسال
async function handleSend() {
    const userText = userInput.value.trim();
    const imageFile = imageInput.files[0];
    
    if (userText === '' && !imageFile) return;

    let base64Image = null;
    let imageUrl = null; // لعرض الصورة في المحادثة

    // 1. عرض رسالة المستخدم
    if (imageFile) {
        base64Image = await fileToBase64(imageFile);
        imageUrl = URL.createObjectURL(imageFile);
        appendMessage('user', userText || 'تحليل الصورة:', imageUrl);
    } else {
        appendMessage('user', userText);
    }
    
    // 2. تعطيل الإدخال أثناء انتظار الرد
    userInput.value = '';
    userInput.disabled = true;
    imageInput.disabled = true;
    sendButton.disabled = true;

    // 3. عرض رسالة انتظار
    const thinkingMessage = document.createElement('div');
    thinkingMessage.classList.add('message', 'ai-message');
    thinkingMessage.textContent = 'Arcanum يفكر...';
    thinkingMessage.id = 'thinking-msg';
    chatBox.appendChild(thinkingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 4. الحصول على رد الذكاء الاصطناعي من الخادم
    const aiResponse = await getAIResponse(userText, base64Image);

    // 5. حذف رسالة الانتظار وعرض الرد النهائي
    const currentThinkingMsg = document.getElementById('thinking-msg');
    if (currentThinkingMsg) {
        chatBox.removeChild(currentThinkingMsg);
    }
    appendMessage('ai', aiResponse);

    // 6. تفعيل الإدخال مرة أخرى وتفريغ حقل الصورة
    userInput.disabled = false;
    imageInput.disabled = false;
    sendButton.disabled = false;
    imageInput.value = '';
    userInput.focus();
}

// ربط وظيفة الإرسال بالأزرار والأحداث
sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSend();
    }
});

userInput.focus();
