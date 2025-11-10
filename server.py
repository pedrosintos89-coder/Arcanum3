from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image

# *** إعداد مكتبة Gemini ***
from google import genai
from google.genai.errors import APIError

app = Flask(__name__)
CORS(app) 

# *************************************************************
# *** 🚨 يجب تغيير هذا المفتاح لمفتاح API الخاص بك لكي يعمل التطبيق 🚨 ***
# *************************************************************
GEMINI_API_KEY = "ضــــع-مفتاحك-الخاص-هنا" 

client = genai.Client(api_key=GEMINI_API_KEY)
# نموذج Gemini يدعم النصوص والصور (Multi-modal)
model_name = 'gemini-2.5-flash' 
system_instruction = (
    "أنت Arcanum، مساعد ذكي متخصص في الهندسة المعمارية وتحليل الصور الهندسية. "
    "تحدث باللغة العربية بطلاقة وبأسلوب احترافي. إذا كانت هناك صورة مرفقة، يجب عليك تحليلها وتقديم قياسات تقديرية، أو تحليل الطراز المعماري، أو تزويد المستخدم بأي بيانات هندسية يطلبها."
)


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    base64_image = data.get('image', None) 

    contents = []

    # 1. معالجة الصورة وتحويلها إلى كائن PIL Image
    if base64_image:
        try:
            image_data = base64.b64decode(base64_image)
            image = Image.open(BytesIO(image_data))
            contents.append(image) 
        except Exception as e:
            print(f"Error decoding image: {e}")
            return jsonify({"response": "فشل في معالجة الصورة المرفقة. تأكد من أن الملف بصيغة صورة صالحة."}), 400

    # 2. إضافة النص
    if user_message:
        contents.append(user_message)

    if not contents:
        return jsonify({"response": "الرسالة فارغة."}), 400

    try:
        # 3. استدعاء Gemini API مع الصورة والنص
        response = client.models.generate_content(
            model=model_name,
            contents=contents, 
            config=genai.types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        ai_response = response.text

    except APIError as e:
        print(f"Gemini API Error: {e}")
        ai_response = "عذراً، لا يمكنني الاتصال بـ API Gemini. الرجاء التحقق من مفتاح API أو رصيد الحساب."
    except Exception as e:
        print(f"General Error: {e}")
        ai_response = "حدث خطأ عام أثناء معالجة طلبك."

    return jsonify({"response": ai_response})

if __name__ == '__main__':
    # تأكد من تثبيت المكتبات: pip install flask google-genai Pillow
    print("Arcanum AI Server is starting...")
    app.run(debug=True, port=5000)
