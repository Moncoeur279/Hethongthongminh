import { useNavigate } from "react-router-dom";
import "../styles/ChatHeader.css";
import { FaBook } from 'react-icons/fa';
import { AccountMenu } from "./AccountMenu";

export function ChatHeader({ title = "TalkMate", subtitle = "Always here to help your english" }) {
  const navigate = useNavigate();

  return (
    <div className="chat-header">
      <div className="chat-title">
        <h2>{title}</h2>
        <p className="chat-subtitle">{subtitle}</p>
      </div>

      <div className="header-actions">
        <button className="action-button dictionary-btn" onClick={() => navigate("/dictionary")}>
          <FaBook />
          Dictionary
        </button>
        <AccountMenu />
      </div>
    </div>
  );
}
