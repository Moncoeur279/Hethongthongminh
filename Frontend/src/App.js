// src/App.js
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ChatHeader } from "./components/ChatHeader";
import Sidebar from "./components/Sidebar";
import ChatMain from "./components/ChatMain";
import ProfilePage from "./components/ProfilePage";
import { DictionaryPage } from "./components/DictionaryModal";

export default function App() {
  return (
    <div className="app">
      <div className="layout">
        <Sidebar />
        <div className="main">
          <ChatHeader />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<ChatMain />} />
              <Route path="/chat" element={<ChatMain />} />
              <Route path="/chat/:id" element={<ChatMain />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dictionary" element={<DictionaryPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
