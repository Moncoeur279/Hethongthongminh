import React, { useEffect, useState } from "react";
import axios from "axios";
import FlashcardGame from "./FlashcardGame";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [recentLookups, setRecentLookups] = useState([]);
    const [error, setError] = useState(null);

    const formatDate = (value) => {
        if (!value) return "Unknown";
        try {
            const date =
                typeof value === "string"
                    ? new Date(value)
                    : value instanceof Date
                        ? value
                        : null;
            if (!date || isNaN(date)) return "Unknown";
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
            });
        } catch {
            return "Unknown";
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("You must log in first.");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:3030/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Failed to load profile data.");
            }
        };

        const fetchRecentLookups = async () => {
            try {
                const res = await axios.get("http://localhost:3030/api/dict/recent", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecentLookups(res.data);
            } catch (err) {
                console.error("Lookup fetch error:", err);
            }
        };

        fetchProfile();
        fetchRecentLookups();
    }, []);

    if (error) {
        return (
            <div className="profile-page">
                <h2>TalkMate</h2>
                <p className="muted">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-page">
                <h2>Loading profile...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h2>
                <span role="img" aria-label="user">
                    👤
                </span>{" "}
                {user.username || "User"}'s Profile
            </h2>

            {/* Basic Info */}
            <section className="section card">
                <h3 className="section-title">Basic Information</h3>
                <p>
                    <strong>User name:</strong> {user.username}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
            </section>

            {/* Recent Lookups */}
            <section className="section card">
                <h3 className="section-title">Recent Lookups (7 days)</h3>
                {recentLookups.length ? (
                    <ul className="list">
                        {recentLookups.map((w, i) => (
                            <li key={i} className="list-row">
                                <span className="badge">{w.word}</span>
                                <span className="muted">{formatDate(w.at || w.createdAt)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="muted">No lookups yet.</p>
                )}
            </section>

            {/* Flashcard Game */}
            <section className="section card">
                <FlashcardGame lookups={recentLookups} />{" "}
            </section>
        </div>
    );
}