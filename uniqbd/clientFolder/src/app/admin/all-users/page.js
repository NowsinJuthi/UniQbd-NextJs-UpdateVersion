"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenuPage from "../Menu/page";
import api from "@/utils/api";


const Alluserspage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const roles = ["ADMIN", "USER", "AUTHOR", "EDITOR"];
  const [selectedRoles, setSelectedRoles] = useState({});


  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/users`, {
        withCredentials: true,
      });

      const data = res.data.data || [];

      setUsers(data);

      const roleMap = {};
      data.forEach((u) => {
        roleMap[u._id] = u.role;
      });

      setSelectedRoles(roleMap);
    } catch (error) {
      console.log("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- ROLE CHANGE ----------------
  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  // ---------------- UPDATE ROLE ----------------
  const updateRole = async (userId) => {
    try {
      await api.put(
        `/users/${userId}/role`,
        { role: selectedRoles[userId] },
        { withCredentials: true }
      );

      alert("Role updated ✅");
      fetchUsers(); 
    } catch (error) {
      console.log("Update role error:", error);
    }
  };

  // ---------------- DELETE USER ----------------
  const deleteUser = async (userId) => {
    try {
      const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
      );

      if (!confirmDelete) return;

      await api.delete(`/users/${userId}`, {
        withCredentials: true,
      });

      alert("User deleted ❌");
      fetchUsers();
    } catch (error) {
      console.log("Delete user error:", error);
    }
  };

  // ---------------- FILTER USERS ----------------
  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const q = search.toLowerCase();

    return name.includes(q) || email.includes(q);
  });

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-12 gap-6 p-6 min-h-screen bg-black/5">

      {/* SIDEBAR */}
      <aside className="md:col-span-3 p-6 border-r bg-button/5 rounded-2xl">
        <AdminMenuPage />
      </aside>

      {/* MAIN */}
      <main className="col-span-12 md:col-span-9 space-y-6">

        {/* HEADER */}
        <div className="bg-button/5 p-6 rounded-2xl">
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="text-gray-400 text-sm">
            Manage system users and roles
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />

        {/* CONTENT */}
        <div className="bg-button/5 rounded-2xl p-6">

          {loading ? (
            <p>Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-4 mb-4 rounded-xl bg-white/5"
              >

                {/* LEFT */}
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  <select
                    value={selectedRoles[user._id] || user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="px-3 py-2 border rounded-xl"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => updateRole(user._id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-xl"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-xl"
                  >
                    Delete
                  </button>

                  <span className="text-xs px-3 py-1 bg-gray-200 rounded-xl">
                    {user.role}
                  </span>

                </div>

              </div>
            ))
          )}

        </div>
      </main>
    </div>
  );
};

export default Alluserspage;