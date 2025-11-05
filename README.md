HỆ THỐNG CHATBOT HỖ TRỢ HỌC TIẾNG ANH

Cấu trúc hệ thống:
english-chat/
├── Frontend/ #ReactJS UI (port 3000)
├── Backend/ #NodeJS Express API (port 3030)
├── Models/
│ ├── chatbot_2/ #Flask chatbot API (port 5000)
│ └── grammar_ai/ #Flask grammar correction API (port 5100)
└── README.md

Clone repository
git clone https://github.com/Moncoeur279/Hethongthongminh.git

Cài đặt dependency cho từng phần:
Frontend:
cd Frontend
npm install
Backend:
cd ../Backend
npm install
ChatbotAI:
cd ../Models/chatbot_2
python -m venv .venv
.venv\Scripts\activate
pip install flask torch sentence-transformers pandas
GrammarAI:
cd ../grammar_ai
python -m venv .venv
.venv\Scripts\activate
pip install flask transformers torch tqdm

Cách chạy hệ thống (4 terminal song song):
1. Frontend:
cd Frontend
npm start
2. Backend:
cd Backend
npm start
3. Model chatbot: 
.venv\Scripts\activate
cd Models/chatbot_2
python chatbot_train.py (tạo model)
python app.py
4. Model grammar:
.venv\Scripts\activate
cd Models/grammar
python grammar_ai.py

Điều chỉnh DB_USER và DB_PASSWORD trùng với tài khoản SQL Server (sa) trong .env để kết nối Database  
