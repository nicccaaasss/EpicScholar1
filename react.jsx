import React, { useState, useEffect, useRef } from "react";

/* ==================================================================================
   1. CSS STYLES (ENHANCED CONTROLS & MODALS)
   ================================================================================== */
const APP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg-color: #09090b;
    --text-primary: #ffffff;
    --text-secondary: #a1a1aa;
    --brand-primary: #3b82f6;
    --brand-gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f43f5e 100%);
    --glass-base: rgba(20, 20, 23, 0.75);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
    --input-bg: rgba(0, 0, 0, 0.4);
    --box-bg: rgba(255, 255, 255, 0.05);
    --nav-active: rgba(59, 130, 246, 0.15);
    --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --ease-smooth: cubic-bezier(0.23, 1, 0.32, 1);
  }

  [data-theme="light"] {
    --bg-color: #f3f4f6;
    --text-primary: #111827;
    --text-secondary: #4b5563;
    --glass-base: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(0, 0, 0, 0.06);
    --input-bg: rgba(255, 255, 255, 0.8);
    --box-bg: rgba(0, 0, 0, 0.04);
    --nav-active: rgba(59, 130, 246, 0.1);
  }

  * { box-sizing: border-box; user-select: none; outline: none; }
  body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-color); color: var(--text-primary); overflow: hidden; transition: background 0.5s; }

  /* --- LAYOUT --- */
  .app-layout {
    display: grid; grid-template-columns: 260px 1fr 80px; grid-template-rows: 80px 1fr;
    height: 100vh; width: 100vw; gap: 20px; padding: 20px; position: relative;
  }
  
  .glass-panel {
    background: var(--glass-base); backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow);
    border-radius: 24px; transition: all 0.4s var(--ease-smooth);
  }

  /* --- HEADER & TOGGLE --- */
  .header { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; z-index: 100; }
  .logo-text { font-size: 26px; font-weight: 800; background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* Actual Toggle Button Switch */
  .toggle-switch {
    width: 60px; height: 32px; background: var(--input-bg); border-radius: 50px;
    border: 1px solid var(--glass-border); position: relative; cursor: pointer;
    transition: background 0.3s;
  }
  .toggle-knob {
    width: 24px; height: 24px; background: #fff; border-radius: 50%;
    position: absolute; top: 3px; left: 3px; transition: transform 0.3s var(--ease-elastic);
    display: flex; align-items: center; justify-content: center; font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  }
  [data-theme="light"] .toggle-knob { transform: translateX(28px); background: #fbbf24; }

  /* --- SIDEBAR --- */
  .sidebar { grid-row: 2; display: flex; flex-direction: column; padding: 20px; }
  .nav-group { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .nav-item {
    display: flex; align-items: center; gap: 15px; padding: 14px 18px; border-radius: 16px;
    cursor: pointer; color: var(--text-secondary); transition: 0.3s; font-weight: 500;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); transform: translateX(5px); color: var(--text-primary); }
  .nav-item.active { background: var(--nav-active); color: var(--brand-primary); font-weight: 700; }

  /* --- FEED & POSTS --- */
  .main-content { grid-row: 2; grid-column: 2; overflow-y: auto; padding-bottom: 100px; border-radius: 24px; }
  .feed-wrapper { max-width: 680px; margin: 0 auto; padding-top: 20px; }
  .search-bar {
    width: 100%; height: 50px; background: var(--input-bg); border: 1px solid var(--glass-border);
    border-radius: 25px; padding: 0 25px; color: var(--text-primary); margin-bottom: 30px;
  }

  .post-card { margin-bottom: 30px; padding: 25px; position: relative; }
  .post-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
  .avatar { width: 45px; height: 45px; border-radius: 50%; background: var(--brand-gradient); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
  
  /* Video Player Styles */
  .media-container {
    width: 100%; height: 400px; background: #000; border-radius: 18px;
    overflow: hidden; position: relative; margin-bottom: 15px; group: hover;
  }
  .media-content { width: 100%; height: 100%; object-fit: contain; }
  
  .video-controls {
    position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; gap: 10px;
  }
  .media-container:hover .video-controls { opacity: 1; }
  
  .timeline-container { width: 100%; height: 5px; background: rgba(255,255,255,0.3); border-radius: 5px; cursor: pointer; position: relative; }
  .timeline-fill { height: 100%; background: var(--brand-primary); border-radius: 5px; position: relative; }
  .timeline-knob { width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; right: -6px; top: -3.5px; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
  
  .controls-row { display: flex; align-items: center; justify-content: space-between; color: white; }
  .control-btn { background: none; border: none; color: white; cursor: pointer; font-size: 18px; width: 30px; display: flex; align-items: center; justify-content: center; }
  .volume-slider { width: 60px; height: 4px; -webkit-appearance: none; background: rgba(255,255,255,0.3); border-radius: 2px; }
  .volume-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; background: white; border-radius: 50%; cursor: pointer; }

  /* Actions */
  .action-row { display: flex; gap: 15px; }
  .action-btn {
    background: var(--box-bg); border: 1px solid var(--glass-border); padding: 8px 18px;
    border-radius: 20px; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s;
  }
  .action-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

  /* --- BOTTOM SHEET MODAL (COMMENTS) --- */
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); z-index: 1000;
    opacity: 0; pointer-events: none; transition: opacity 0.3s;
    display: flex; justify-content: center; align-items: flex-end;
  }
  .modal-overlay.active { opacity: 1; pointer-events: auto; }
  
  .bottom-sheet {
    width: 100%; max-width: 600px; height: 60vh;
    background: var(--glass-base); backdrop-filter: blur(30px);
    border-radius: 30px 30px 0 0; border-top: 1px solid var(--glass-border);
    padding: 20px; transform: translateY(100%); transition: transform 0.4s var(--ease-elastic);
    display: flex; flex-direction: column;
  }
  .modal-overlay.active .bottom-sheet { transform: translateY(0); }

  .comment-list { flex: 1; overflow-y: auto; margin: 15px 0; padding-right: 5px; }
  .comment-bubble { padding: 10px 15px; border-radius: 15px; margin-bottom: 10px; max-width: 85%; font-size: 14px; line-height: 1.4; }
  .comment-bubble.others { background: var(--box-bg); align-self: flex-start; margin-right: auto; }
  .comment-bubble.me { background: var(--brand-gradient); color: white; align-self: flex-end; margin-left: auto; text-align: right; }

  /* --- SHARE MODAL --- */
  .share-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;
    margin-top: 20px;
  }
  .share-option {
    background: var(--box-bg); border: 1px solid var(--glass-border);
    padding: 15px; border-radius: 15px; text-align: center; cursor: pointer;
    transition: 0.2s; display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .share-option:hover { background: rgba(255,255,255,0.1); transform: scale(1.05); }

  /* --- RIGHT PANEL --- */
  .right-panel { grid-row: 2; grid-column: 3; display: flex; flex-direction: column; gap: 15px; align-items: flex-end; z-index: 200; }
  .mini-card {
    width: 60px; height: 60px; background: var(--glass-base); backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border); border-radius: 20px;
    display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden;
    transition: width 0.5s var(--ease-elastic), height 0.5s var(--ease-elastic), border-radius 0.4s;
    position: relative; box-shadow: var(--glass-shadow); font-size: 24px;
  }
  .mini-card:hover, .mini-card.active { width: 300px; height: auto; min-height: 160px; border-radius: 24px; align-items: flex-start; justify-content: flex-start; z-index: 300; }
  .mini-icon { position: absolute; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
  .mini-card:hover .mini-icon, .mini-card.active .mini-icon { opacity: 0; }
  .mini-content { opacity: 0; width: 300px; padding: 20px; transform: translateY(20px); transition: 0.3s 0.1s; pointer-events: none; }
  .mini-card:hover .mini-content, .mini-card.active .mini-content { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .info-box { background: var(--box-bg); border: 1px solid var(--glass-border); padding: 12px; border-radius: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; font-size: 14px; }

  @media (max-width: 1200px) { .app-layout { grid-template-columns: 80px 1fr; } .right-panel { display: none; } .nav-item span { display: none; } .nav-item { justify-content: center; } }
`;

/* ==================================================================================
   2. MAIN APPLICATION
   ================================================================================== */
const EpicScholar = () => {
  const [theme, setTheme] = useState("dark");
  const [activeView, setActiveView] = useState("home");
  const [posts, setPosts] = useState(MOCK_POSTS);

  // Modal States
  const [commentPost, setCommentPost] = useState(null); // Stores post object for comments
  const [sharePost, setSharePost] = useState(null); // Stores post object for sharing

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const handleAddPost = (newPost) => setPosts([newPost, ...posts]);

  return (
    <div className="app-layout">
      <style>{APP_STYLES}</style>

      {/* Backgrounds */}
      <div
        className="blob"
        style={{
          background: "#3b82f6",
          width: "50vw",
          height: "50vw",
          top: "-10%",
          left: "-10%",
          position: "fixed",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: -1,
          opacity: 0.4,
        }}
      ></div>
      <div
        className="blob"
        style={{
          background: "#f43f5e",
          width: "40vw",
          height: "40vw",
          bottom: "-10%",
          right: "-10%",
          position: "fixed",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: -1,
          opacity: 0.4,
        }}
      ></div>

      {/* 1. HEADER */}
      <header className="header glass-panel">
        <div className="logo-text">EpicScholar</div>
        <ThemeToggle
          theme={theme}
          toggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </header>

      {/* 2. SIDEBAR (Emojis) */}
      <aside className="sidebar glass-panel">
        <div className="nav-group">
          <NavItem
            id="home"
            icon="🏠"
            label="Home"
            active={activeView}
            onClick={setActiveView}
          />
          <NavItem
            id="messages"
            icon="📨"
            label="Messages"
            active={activeView}
            onClick={setActiveView}
          />
          <NavItem
            id="self-study"
            icon="📖"
            label="Self-Study"
            active={activeView}
            onClick={setActiveView}
          />
          <NavItem
            id="edubot"
            icon="🤖"
            label="EduBot"
            active={activeView}
            onClick={setActiveView}
          />
          <NavItem
            id="mini-games"
            icon="🎮"
            label="Mini Games"
            active={activeView}
            onClick={setActiveView}
          />
        </div>
        <NavItem
          id="profile"
          icon="👤"
          label="Profile"
          active={activeView}
          onClick={setActiveView}
        />
      </aside>

      {/* 3. FEED */}
      <main className="main-content glass-panel">
        <div className="feed-wrapper">
          <input className="search-bar" placeholder="Search topics..." />
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onComment={() => setCommentPost(post)}
              onShare={() => setSharePost(post)}
            />
          ))}
        </div>
      </main>

      {/* 4. RIGHT PANEL (Emojis + Logic) */}
      <aside className="right-panel">
        <AddPostCard onPost={handleAddPost} />
        <MiniCard icon="⏰" title="Reminders">
          <ContentBox icon="📝" title="Calculus HW" subtitle="Due 5 PM" />
          <ContentBox icon="💊" title="Take Break" subtitle="In 10 mins" />
        </MiniCard>
        <MiniCard icon="🔔" title="Notifications">
          <ContentBox icon="❤️" title="New Like" subtitle="On your post" />
          <ContentBox
            icon="💬"
            title="Prof. X replied"
            subtitle="Physics 101"
          />
        </MiniCard>
        <MiniCard icon="🗓️" title="Schedule">
          <ContentBox icon="09:00" title="Chemistry" subtitle="Lab 3" />
          <ContentBox icon="11:00" title="Library" subtitle="Study Group" />
        </MiniCard>
      </aside>

      {/* --- MODALS --- */}
      <CommentModal
        post={commentPost}
        onClose={() => setCommentPost(null)}
        onAddComment={(text) => {
          // Logic to add comment to local state
          post.comments.push({ user: "Me", text, type: "me" });
        }}
      />
      <ShareModal post={sharePost} onClose={() => setSharePost(null)} />
    </div>
  );
};

/* ==================================================================================
   3. SUB-COMPONENTS
   ================================================================================== */

// Theme Toggle Switch
const ThemeToggle = ({ theme, toggle }) => (
  <div className="toggle-switch" onClick={toggle}>
    <div className="toggle-knob">{theme === "dark" ? "🌙" : "☀️"}</div>
  </div>
);

// Sidebar Item
const NavItem = ({ id, icon, label, active, onClick }) => (
  <div
    className={`nav-item ${active === id ? "active" : ""}`}
    onClick={() => onClick(id)}
  >
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span>{label}</span>
  </div>
);

// Content Box
const ContentBox = ({ icon, title, subtitle }) => (
  <div className="info-box">
    <div style={{ fontSize: 18 }}>{icon}</div>
    <div>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{subtitle}</div>
    </div>
  </div>
);

// Mini Card
const MiniCard = ({ icon, title, children }) => {
  const [active, setActive] = useState(false);
  return (
    <div
      className={`mini-card ${active ? "active" : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="mini-icon">{icon}</div>
      <div className="mini-content">
        <h3 style={{ margin: "0 0 15px 0", color: "var(--brand-primary)" }}>
          {icon} {title}
        </h3>
        {children}
      </div>
    </div>
  );
};

// Add Post Card (Preview Logic)
const AddPostCard = ({ onPost }) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const submit = () => {
    if (!text && !file) return;
    onPost({
      id: Date.now(),
      author: "Epic Student",
      initials: "ES",
      time: "Just now",
      content: text,
      type: file?.type.startsWith("video") ? "video" : "image",
      url: preview || "https://via.placeholder.com/600",
      likes: 0,
      comments: [],
    });
    setText("");
    setFile(null);
    setPreview(null);
    setActive(false);
  };

  return (
    <div
      className={`mini-card ${active ? "active" : ""}`}
      onClick={() => !active && setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="mini-icon">➕</div>
      <div className="mini-content">
        <h3 style={{ margin: "0 0 10px 0", color: "var(--brand-primary)" }}>
          Create Post
        </h3>
        <div
          onClick={() => inputRef.current.click()}
          style={{
            width: "100%",
            height: 100,
            background: "#000",
            borderRadius: 10,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {preview ? (
            <img
              src={preview}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            <span>📷 Upload</span>
          )}
        </div>
        <input type="file" hidden ref={inputRef} onChange={handleFile} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Caption..."
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: 10,
            color: "white",
            padding: 10,
            marginBottom: 10,
          }}
        ></textarea>
        <button
          onClick={(e) => {
            e.stopPropagation();
            submit();
          }}
          style={{
            width: "100%",
            padding: 10,
            background: "var(--brand-gradient)",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
};

/* ==================================================================================
   4. VIDEO PLAYER & POST CARD
   ================================================================================== */
const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const vid = videoRef.current;
    const updateTime = () =>
      setProgress((vid.currentTime / vid.duration) * 100);
    vid.addEventListener("timeupdate", updateTime);
    vid.addEventListener("loadedmetadata", () => setDuration(vid.duration));
    return () => vid.removeEventListener("timeupdate", updateTime);
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleVol = (e) => {
    e.stopPropagation();
    const vol = e.target.value;
    setVolume(vol);
    videoRef.current.volume = vol;
  };

  const skip = (sec) => {
    videoRef.current.currentTime += sec;
  };

  const fullScreen = (e) => {
    e.stopPropagation();
    videoRef.current.requestFullscreen();
  };

  return (
    <div className="media-container" onClick={togglePlay}>
      <video ref={videoRef} src={src} className="media-content" loop />

      {/* Controls Overlay */}
      <div className="video-controls" onClick={(e) => e.stopPropagation()}>
        <div className="timeline-container" onClick={handleSeek}>
          <div className="timeline-fill" style={{ width: `${progress}%` }}>
            <div className="timeline-knob"></div>
          </div>
        </div>

        <div className="controls-row">
          <div style={{ display: "flex", gap: 10 }}>
            <button className="control-btn" onClick={togglePlay}>
              {playing ? "⏸️" : "▶️"}
            </button>
            <button className="control-btn" onClick={() => skip(-5)}>
              ⏪
            </button>
            <button className="control-btn" onClick={() => skip(5)}>
              ⏩
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span>🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVol}
                className="volume-slider"
              />
            </div>
          </div>
          <button className="control-btn" onClick={fullScreen}>
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, onComment, onShare }) => {
  const [liked, setLiked] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [heartPos, setHeartPos] = useState(null);

  const handleDouble = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHeartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (!isLiked) {
      setIsLiked(true);
      setLiked((l) => l + 1);
    }
    setTimeout(() => setHeartPos(null), 800);
  };

  return (
    <div className="post-card glass-panel">
      <div className="post-header">
        <div className="avatar">{post.initials}</div>
        <div>
          <div style={{ fontWeight: 700 }}>{post.author}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {post.time}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 15 }}>{post.content}</div>

      {post.type === "video" ? (
        <VideoPlayer src={post.url} />
      ) : (
        <div className="media-container" onDoubleClick={handleDouble}>
          {heartPos && (
            <div
              style={{
                position: "absolute",
                top: heartPos.y,
                left: heartPos.x,
                fontSize: 80,
                transform: "translate(-50%,-50%)",
                pointerEvents: "none",
                animation: "popIn 0.5s",
              }}
            >
              ❤️
            </div>
          )}
          <img src={post.url} className="media-content" alt="Post" />
        </div>
      )}

      <div className="action-row">
        <button
          className="action-btn"
          onClick={() => {
            setIsLiked(!isLiked);
            setLiked(isLiked ? liked - 1 : liked + 1);
          }}
        >
          {isLiked ? "❤️" : "🤍"} {liked}
        </button>
        <button className="action-btn" onClick={onComment}>
          💬 {post.comments.length}
        </button>
        <button className="action-btn" onClick={onShare}>
          ↗️ Share
        </button>
      </div>
    </div>
  );
};

/* ==================================================================================
   5. MODALS (COMMENT & SHARE)
   ================================================================================== */

const CommentModal = ({ post, onClose, onAddComment }) => {
  const [text, setText] = useState("");
  if (!post) return null;

  return (
    <div className={`modal-overlay ${post ? "active" : ""}`} onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 10 }}>
          Comments{" "}
          <span style={{ color: "var(--text-secondary)" }}>
            ({post.comments.length})
          </span>
        </div>
        <div className="comment-list">
          {post.comments.length === 0 && (
            <div style={{ textAlign: "center", opacity: 0.5, marginTop: 20 }}>
              No comments yet. Be the first!
            </div>
          )}
          {post.comments.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 15,
              }}
            >
              <div
                className={`comment-bubble ${
                  c.type === "me" ? "me" : "others"
                }`}
              >
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 2 }}>
                  {c.user}
                </div>
                {c.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            style={{
              flex: 1,
              background: "var(--input-bg)",
              border: "none",
              padding: 15,
              borderRadius: 25,
              color: "white",
            }}
          />
          <button
            onClick={() => {
              if (text) {
                onAddComment(text);
                setText("");
              }
            }}
            style={{
              background: "var(--brand-gradient)",
              border: "none",
              width: 50,
              borderRadius: 25,
              cursor: "pointer",
            }}
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareModal = ({ post, onClose }) => {
  if (!post) return null;
  const copyLink = () => {
    navigator.clipboard.writeText("https://epicscholar.app/post/" + post.id);
    alert("Link Copied!");
    onClose();
  };

  return (
    <div
      className={`modal-overlay ${post ? "active" : ""}`}
      style={{ alignItems: "center" }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{ width: 300, padding: 20, background: "var(--bg-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ textAlign: "center", marginTop: 0 }}>Share Post</h3>
        <div className="share-grid">
          <div
            className="share-option"
            onClick={() => alert("Sharing to Facebook...")}
          >
            <span style={{ fontSize: 30, color: "#1877F2" }}>📘</span>{" "}
            <span>Meta</span>
          </div>
          <div
            className="share-option"
            onClick={() => alert("Sharing to X...")}
          >
            <span style={{ fontSize: 30 }}>✖️</span> <span>X</span>
          </div>
          <div
            className="share-option"
            onClick={() => alert("Sharing to WhatsApp...")}
          >
            <span style={{ fontSize: 30, color: "#25D366" }}>💬</span>{" "}
            <span>WhatsApp</span>
          </div>
          <div className="share-option" onClick={copyLink}>
            <span style={{ fontSize: 30 }}>🔗</span> <span>Copy Link</span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 20,
            background: "transparent",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* --- MOCK DATA --- */
const MOCK_POSTS = [
  {
    id: 1,
    author: "Dr. Physics",
    initials: "DP",
    time: "2h ago",
    content:
      "Understanding wave interference patterns through visual simulation.",
    type: "image",
    url: "https://picsum.photos/id/1002/800/600",
    likes: 120,
    comments: [{ user: "Student A", text: "This is so clear!", type: "other" }],
  },
  {
    id: 2,
    author: "Engineering Lab",
    initials: "EL",
    time: "4h ago",
    content: "Fluid dynamics test. Watch the flow velocity changes.",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    likes: 45,
    comments: [],
  },
];

export default EpicScholar;
