# TRADE DEAR – Frontend

TRADE DEAR is a professional trading platform designed for modern traders. This frontend application is built using React, Vite, and Tailwind CSS, offering a fast, responsive, and modular user experience. The platform currently supports demo trading and will expand to real trading in future phases.

## 🔥 Key Features

- Responsive candlestick chart using TradingView Lightweight Chart (Advanced Chart integration planned)
- Live price updates via WebSocket
- Modular sidebar with watchlist, search box, and crypto support (responsive version in progress)
- User authentication (login, signup, forgot password)
- Protected routes using context-based auth
- Clean UI with reusable components and Tailwind styling

## 🚀 Getting Started

### Installation

```bash
npm install
npm run dev


Create a .env file in the project root with the following:

VITE_API_URL=https://api.tradedear.com
VITE_WEBSOCKET_URL=wss://api.tradedear.com/ws
VITE_TRADINGVIEW_KEY=your-key-here


📈 TradingView Integration
This frontend currently uses TradingView’s Lightweight Chart for demo trading. We plan to integrate the Advanced Chart library upon license approval. The chart is responsive, supports live updates, and will be extended with crypto symbols and user layout persistence. Sidebar is under active development to support responsive design and crypto watchlists.

📄 License
This project is licensed under the MIT License.

📬 Contact
For inquiries or demo access:
Email: support@tradedear.com
 Website: https://tradedear.com
