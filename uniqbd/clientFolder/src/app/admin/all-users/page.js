"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenuPage from "../Menu/page";

const API = "http://localhost:3001/api/v1";

const Alluserspage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const roles = ["ADMIN", "USER", "AUTHOR", "EDITOR"];

  const [selectedRoles, setSelectedRoles] = useState({});

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/users`, {
        withCredentials: true,
      });

      setUsers(res.data.data || []);

      const roleMap = {};
      res.data.data.forEach((u) => {
        roleMap[u._id] = u.role;
      });

      setSelectedRoles(roleMap);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ROLE CHANGE
  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  // UPDATE ROLE
  const updateRole = async (userId) => {
    try {
      await axios.put(
        `${API}/users/${userId}/role`,
        { role: selectedRoles[userId] },
        { withCredentials: true }
      );

      alert("Role updated ✅");
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE USER
  const deleteUser = async (userId) => {
    try {
      const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await axios.delete(`${API}/users/${userId}`, {
        withCredentials: true,
      });

      alert("User deleted ❌");
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER USERS (SEARCH)
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-12 gap-6 p-6">

      {/* SIDEBAR */}
      <div className="md:col-span-3 p-8 border-r bg-button/5">
        <AdminMenuPage />
      </div>

      {/* MAIN */}
      <div className="col-span-12 md:col-span-9">

        <h1 className="text-3xl font-bold mb-6">All Users</h1>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-xl"
        />

        <div className="bg-button/5 rounded-2xl p-6">

          <h3 className="font-semibold mb-4">User Management</h3>

          {loading ? (
            <p>Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="shadow rounded-xl p-4 mb-4 flex justify-between items-center"
              >

                {/* LEFT */}
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-gray-600 text-sm">{user.email}</p>
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

                  {/* UPDATE */}
                  <button
                    onClick={() => updateRole(user._id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Update
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
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
      </div>
    </div>
  );
};

export default Alluserspage;