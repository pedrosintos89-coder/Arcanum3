const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// دالة لعرض رسالة جديدة في صندوق المحادثة
function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(`${sender}-message`);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    
    // التمرير لأسفل تلقائيًا
    chatBox.scrollTop = chatBox.scrollHeight;
}

// دالة لمحاكاة الردود (في التطبيق الحقيقي، يتم استبدال هذا بربط API)
async function getAIResponse(userMessage) {
    // محاكاة تأخير في الشبكة
    await new Promise(resolve => setTimeout(resolve, 800)); 

    // منطق بسيط لمحاكاة الردود
    const lowerCaseMsg = userMessage.toLowerCase();

    if (lowerCaseMsg.includes('كيف حالك') || lowerCaseMsg.includes('ما اسمك')) {
        return "أنا نموذج ذكاء اصطناعي، اسمي Arcanum. وأنا بخير وجاهز لمساعدتك!";
    } else if (lowerCaseMsg.includes('هندسة') || lowerCaseMsg.includes('عمارة')) {
        return "بالتأكيد، الهندسة والعمارة من اختصاصاتي. هل تريد الحديث عن الطراز الكلاسيكي أو استنتاج التماثل؟";
    } else if (lowerCaseMsg.includes('وداعا') || lowerCaseMsg.includes('شكرا')) {
        return "على الرحب والسعة! يسعدني خدمتك في أي وقت.";
    } else {
        return `أتفهم سؤالك حول "${userMessage}". لربط نموذج محادثة متقدم، يجب استبدال هذا الكود بربط API لـ GPT أو Gemini.`;
    }
}

// دالة معالجة الإرسال
async function handleSend() {
    const userText = userInput.value.trim();
    if (userText === '') return; // لا ترسل رسالة فارغة

    // 1. عرض رسالة المستخدم
    appendMessage('user', userText);
    
    // 2. تعطيل الإدخال أثناء انتظار الرد
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;

    // 3. الحصول على رد الذكاء الاصطناعي (المحاكاة)
    const aiResponse = await getAIResponse(userText);
    
    // 4. عرض رد الذكاء الاصطناعي
    appendMessage('ai', aiResponse);

    // 5. تفعيل الإدخال مرة أخرى
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

// ربط وظيفة الإرسال بالأزرار والأحداث
sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSend();
    }
});

// تفعيل التركيز على صندوق الإدخال عند التحميل
userInput.focus();
