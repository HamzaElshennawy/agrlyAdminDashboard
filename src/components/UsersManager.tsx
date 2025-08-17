/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { User } from "../types/api";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [_, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch {
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await apiService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch {
      setError("Failed to delete user");
    }
  };

  const handleEditIconClick = (user: User) => {
    setEditUser(user);
    setEditForm(user);
    setShowEditModal(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await apiService.editUser({ ...editUser, ...editForm });
      setShowEditModal(false);
      setEditUser(null);
      setEditForm({});
      loadUsers();
    } catch {
      setError("Failed to update user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName?.[0] || user.username?.[0] || "U"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {user.emailVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Email Verified
                        </span>
                      )}
                      {user.governmentIdVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ID Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin
                          ? "bg-purple-100 text-purple-800"
                          : user.isSuperhost
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isAdmin && <Shield className="h-3 w-3 mr-1" />}
                      {user.isAdmin
                        ? "Admin"
                        : user.isSuperhost
                        ? "Superhost"
                        : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Edit User"
                        className="text-blue-600 hover:text-blue-900 p-1"
                        onClick={() => handleEditIconClick(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {/* Edit User Modal */}
                      {showEditModal && editUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg text-left max-h-[95vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4 text-left">
                              Edit User
                            </h2>
                            <form
                              onSubmit={handleEditFormSubmit}
                              className="space-y-4 text-left"
                            >
                              <div>
                                <label
                                  htmlFor="firstName"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  id="firstName"
                                  name="firstName"
                                  value={editForm.firstName || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="lastName"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  id="lastName"
                                  name="lastName"
                                  value={editForm.lastName || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={editForm.email || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Username
                                </label>
                                <input
                                  type="text"
                                  id="username"
                                  name="username"
                                  value={editForm.username || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="nationalID"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  National ID
                                </label>
                                <input
                                  type="text"
                                  id="nationalID"
                                  name="nationalID"
                                  value={editForm.nationalID || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="phone"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Phone
                                </label>
                                <input
                                  type="text"
                                  id="phone"
                                  name="phone"
                                  value={editForm.phone || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="profilePictureUrl"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Profile Picture URL
                                </label>
                                <input
                                  type="text"
                                  id="profilePictureUrl"
                                  name="profilePictureUrl"
                                  value={editForm.profilePictureUrl || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="bio"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Bio
                                </label>
                                <input
                                  type="text"
                                  id="bio"
                                  name="bio"
                                  value={editForm.bio || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="dateOfBirth"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Date of Birth
                                </label>
                                <input
                                  type="date"
                                  id="dateOfBirth"
                                  name="dateOfBirth"
                                  value={editForm.dateOfBirth || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="hostSince"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Host Since
                                </label>
                                <input
                                  type="date"
                                  id="hostSince"
                                  name="hostSince"
                                  value={editForm.hostSince || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="preferredLanguage"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Preferred Language
                                </label>
                                <input
                                  type="text"
                                  id="preferredLanguage"
                                  name="preferredLanguage"
                                  value={editForm.preferredLanguage || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="timezone"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Timezone
                                </label>
                                <input
                                  type="text"
                                  id="timezone"
                                  name="timezone"
                                  value={editForm.timezone || ""}
                                  onChange={handleEditFormChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={!!editForm.isAdmin}
                                    onChange={handleEditFormChange}
                                  />
                                  <span>Admin</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="isSuperhost"
                                    checked={!!editForm.isSuperhost}
                                    onChange={handleEditFormChange}
                                  />
                                  <span>Superhost</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="governmentIdVerified"
                                    checked={!!editForm.governmentIdVerified}
                                    onChange={handleEditFormChange}
                                  />
                                  <span>Government ID Verified</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="emailVerified"
                                    checked={!!editForm.emailVerified}
                                    onChange={handleEditFormChange}
                                  />
                                  <span>Email Verified</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="phoneVerified"
                                    checked={!!editForm.phoneVerified}
                                    onChange={handleEditFormChange}
                                  />
                                  <span>Phone Verified</span>
                                </label>
                              </div>
                              <div className="flex justify-end gap-2 mt-6">
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-gray-200 rounded"
                                  onClick={() => {
                                    setShowEditModal(false);
                                    setEditUser(null);
                                    setEditForm({});
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      <button
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
