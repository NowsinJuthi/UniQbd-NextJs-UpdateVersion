"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminMenuPage from "../Menu/page";

const API = "http://localhost:3001/api/v1";

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


  // FETCH NOTES
 const fetchNotes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/all-notes`, {
        withCredentials: true,
      });

      setNotes(res.data.notes || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ADD NOTE
 const addNote = async () => {
    try {
      if (!title.trim() || !text.trim()) return;

      setBtnLoading(true);

      await axios.post(
        `${API}/create-notes`,

        {
          title,
          text,
        },

        { withCredentials: true },
      );

      setTitle("");
      setText("");

      fetchNotes();
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };


  // DELETE NOTE
const deleteNote = async (id) => {
    try {
      await axios.delete(
        `${API}/delete-notes/${id}`,

        { withCredentials: true },
      );

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // START EDIT
 const startEdit = (note) => {
    setEditId(note._id);

    setEditTitle(note.title);
    setEditText(note.text);
  };


  // UPDATE NOTE
  const updateNote = async (id) => {
    try {
      if (!editTitle.trim() || !editText.trim()) return;

      await axios.put(
        `${API}/update-notes/${id}`,

        {
          title: editTitle,
          text: editText,
        },

        { withCredentials: true },
      );

      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  // AUTO SAVE
  useEffect(() => {
    if (!editId) return;

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      updateNote(editId);
    }, 1000);
  }, [editTitle, editText]);

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* SIDEBAR */}
      <div className="md:col-span-3 p-8 border-r bg-button/5">
        <AdminMenuPage />
      </div>

      {/* MAIN */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-bold mb-8">Notes Manager</h1>

        {/* ADD NOTE */}
        <div className="bg-button/5 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold mb-4">Add Note</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-4 py-2 rounded-xl bg-button/5"
          />

          <textarea
            placeholder="Write note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-28 px-4 py-2 rounded-xl bg-button/5"
          />

          <button
            onClick={addNote}
            disabled={btnLoading}
            className="mt-4 bg-button text-white px-6 py-2 rounded-xl"
          >
            {btnLoading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* NOTE LIST */}
        <div className="bg-button/5 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">All Notes</h3>

          {loading ? (
            <p>Loading...</p>
          ) : notes.length === 0 ? (
            <p>No notes</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className=" shadow rounded-xl p-4 mb-4"
              >
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

                    <p className="text-xs text-gray-400 mt-1">Auto saving...</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">{note.title}</h4>

                    <p className="text-gray-600 mt-1">{note.text}</p>

                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-blue-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-500"
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
      </div>
    </div>
  );
};

export default Note;
