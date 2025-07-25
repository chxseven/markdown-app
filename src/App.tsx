import { useState } from "react";
import "./App.css";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Sample Note",
      content:
        "# Hello World\n\nStart typing your **markdown** here!\n\n- Item 1\n- Item 2\n- Item 3",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Another Note",
      content:
        "# Another Note\n\nThis is another sample note with some content.",
      createdAt: new Date(),
    },
  ]);
  const [activeNoteId, setActiveNoteId] = useState<number>(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState("editor"); // 'editor', 'preview', 'sidebar'
  const [draggedNoteId, setDraggedNoteId] = useState<number | null>(null);
  const [dragOverNoteId, setDragOverNoteId] = useState<number | null>(null);

  const activeNote = notes.find((note) => note.id === activeNoteId);
  const markdown = activeNote?.content || "";

  // Update note content
  const updateNoteContent = (content: string) => {
    setNotes(
      notes.map((note) =>
        note.id === activeNoteId
          ? { ...note, content, title: extractTitle(content) }
          : note
      )
    );
  };

  // Extract title from content
  const extractTitle = (content: string): string => {
    const firstLine = content.split("\n")[0];
    if (firstLine.startsWith("#")) {
      return firstLine.replace(/^#+\s*/, "").trim() || "Untitled";
    }
    return firstLine.trim().substring(0, 30) || "Untitled";
  };

  // Format datetime for display
  const formatDateTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Create new note
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "# New Note\n\nStart writing...",
      createdAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setMobileView("editor");
  };

  // Select note
  const selectNote = (noteId: number) => {
    setActiveNoteId(noteId);
    setMobileView("editor");
  };

  // Move note to new position
  const moveNote = (draggedId: number, targetId: number) => {
    const draggedIndex = notes.findIndex(note => note.id === draggedId);
    const targetIndex = notes.findIndex(note => note.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newNotes = [...notes];
    const [draggedNote] = newNotes.splice(draggedIndex, 1);
    newNotes.splice(targetIndex, 0, draggedNote);
    
    setNotes(newNotes);
  };

  // Drag event handlers
  const handleDragStart = (e: React.DragEvent, noteId: number) => {
    setDraggedNoteId(noteId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, noteId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverNoteId(noteId);
  };

  const handleDragLeave = () => {
    setDragOverNoteId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedNoteId && draggedNoteId !== targetId) {
      moveNote(draggedNoteId, targetId);
    }
    setDraggedNoteId(null);
    setDragOverNoteId(null);
  };

  const handleDragEnd = () => {
    setDraggedNoteId(null);
    setDragOverNoteId(null);
  };

  // Format text functions
  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector(
      ".markdown-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    updateNoteContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const makeBold = () => insertMarkdown("**", "**");
  const makeItalic = () => insertMarkdown("*", "*");
  const makeHeading = () => insertMarkdown("# ");

  // Basic markdown to HTML converter
  const parseMarkdown = (text: string): string => {
    return (
      text
        // Headers
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        // Bold
        .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*)\*/gim, "<em>$1</em>")
        // Code (inline)
        .replace(/`(.*?)`/gim, "<code>$1</code>")
        // Lists
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        // Line breaks
        .replace(/\n/gim, "<br>")
        // Wrap lists
        .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>
          <h1>Markdown Note App</h1>
        </div>

        {/* Mobile navigation */}
        <div className="mobile-nav">
          <button
            className={`mobile-nav-btn ${
              mobileView === "sidebar" ? "active" : ""
            }`}
            onClick={() => setMobileView("sidebar")}
          >
            Notes
          </button>
          <button
            className={`mobile-nav-btn ${
              mobileView === "editor" ? "active" : ""
            }`}
            onClick={() => setMobileView("editor")}
          >
            Edit
          </button>
          <button
            className={`mobile-nav-btn ${
              mobileView === "preview" ? "active" : ""
            }`}
            onClick={() => setMobileView("preview")}
          >
            Preview
          </button>
        </div>
      </header>

      <main className="app-main">
        <div
          className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${
            mobileView === "sidebar" ? "mobile-visible" : ""
          }`}
        >
          <div className="sidebar-header">
            <button className="new-note-btn" onClick={createNewNote}>
              + New Note
            </button>
          </div>
          <div className="note-list">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${
                  note.id === activeNoteId ? "active" : ""
                } ${note.id === draggedNoteId ? "dragging" : ""} ${
                  note.id === dragOverNoteId ? "drag-over" : ""
                }`}
                onClick={() => selectNote(note.id)}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragOver={(e) => handleDragOver(e, note.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, note.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <span className="note-date">{formatDateTime(note.createdAt)}</span>
                </div>
                <p>{note.content.replace(/[#*`-]/g, "").substring(0, 50)}...</p>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-container">
          <div
            className={`editor-pane ${
              mobileView === "editor" ? "mobile-visible" : ""
            }`}
          >
            <div className="pane-header">
              <h3>Editor</h3>
              <div className="toolbar">
                <button className="toolbar-btn" onClick={makeBold} title="Bold">
                  B
                </button>
                <button
                  className="toolbar-btn"
                  onClick={makeItalic}
                  title="Italic"
                >
                  I
                </button>
                <button
                  className="toolbar-btn"
                  onClick={makeHeading}
                  title="Heading"
                >
                  H
                </button>
              </div>
            </div>
            <textarea
              className="markdown-editor"
              value={markdown}
              onChange={(e) => updateNoteContent(e.target.value)}
              placeholder="Start typing your markdown here..."
            />
          </div>

          <div
            className={`preview-pane ${
              mobileView === "preview" ? "mobile-visible" : ""
            }`}
          >
            <div className="pane-header">
              <h3>Preview</h3>
            </div>
            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
