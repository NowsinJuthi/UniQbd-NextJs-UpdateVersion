"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import api from "@/utils/api";
import AdminMenuPage from "../Menu/page";

const Note = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  const typingTimeout = useRef(null);



  // ---------------- FETCH NOTES ----------------
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/all-notes`, {
        withCredentials: true,
      });

      setNotes(res.data.notes || []);
    } catch (error) {
      console.log("Fetch notes error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []); 

  // ---------------- ADD NOTE ----------------
  const addNote = async () => {
    try {
      if (!title.trim() || !text.trim()) return;

      setBtnLoading(true);

      await api.post(
        `/create-notes`,
        { title, text },
        { withCredentials: true }
      );

      setTitle("");
      setText("");

      fetchNotes();
    } catch (error) {
      console.log("Add note error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  // ---------------- DELETE NOTE ----------------
  const deleteNote = async (id) => {
    try {
      await api.delete(`/delete-notes/${id}`, {
        withCredentials: true,
      });

      fetchNotes();
    } catch (error) {
      console.log("Delete note error:", error);
    }
  };

  // ---------------- START EDIT ----------------
  const startEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditText(note.text);
  };

  // ---------------- UPDATE NOTE ----------------
  const updateNote = async (id) => {
    try { 
      if (!editTitle.trim() || !editText.trim()) return;

      await api.put(
        `/update-notes/${id}`,
        {
          title: editTitle,
          text: editText,
        },
        { withCredentials: true }
      );

      fetchNotes();
    } catch (error) {
      console.log("Update note error:", error);
    }
  };

  // ---------------- AUTO SAVE ----------------
  useEffect(() => {
    if (!editId) return;

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      updateNote(editId);
    }, 1000);
  }, [editTitle, editText]);

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen bg-black/5">

      {/* SIDEBAR */}
      <aside className="md:col-span-3 p-6 border-r bg-button/5 rounded-2xl">
        <AdminMenuPage />
      </aside>

      {/* MAIN */}
      <main className="col-span-12 md:col-span-9 space-y-6">

        {/* TITLE */}
        <h1 className="text-3xl font-bold">Notes Manager</h1>

        {/* ADD NOTE */}
        <div className="bg-button/5 rounded-2xl p-6">

          <h3 className="font-semibold mb-4">Add Note</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-4 py-2 rounded-xl bg-white/5"
          />

          <textarea
            placeholder="Write note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-28 px-4 py-2 rounded-xl bg-white/5"
          />

          <button
            onClick={addNote}
            disabled={btnLoading}
            className="mt-4 bg-button text-white px-6 py-2 rounded-xl"
          >
            {btnLoading ? "Saving..." : "Save"}
          </button>

        </div>

        {/* NOTES LIST */}
        <div className="bg-button/5 rounded-2xl p-6">

          <h3 className="font-semibold mb-4">All Notes</h3>

          {loading ? (
            <p>Loading...</p>
          ) : notes.length === 0 ? (
            <p>No notes</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="p-4 mb-4 rounded-xl bg-white/5">

                {editId === note._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full mb-2 px-3 py-2 border rounded"
                    />

                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full h-24 px-3 py-2 border rounded"
                    />

                    <p className="text-xs text-gray-400 mt-1">
                      Auto saving...
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">{note.title}</h4>
                    <p className="text-gray-400 mt-1">{note.text}</p>

                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-blue-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))
          )}

        </div>

      </main>
    </div>
  );
};

export default Note;