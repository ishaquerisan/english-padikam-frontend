import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/apiServices';
import { User, Level } from '../../types';
import { AdminNav } from './AdminNav';
import {
  Search,
  Shield,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  Flame,
  BookOpen,
  Edit,
  X,
  Target,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    englishLevel: string;
    dailyGoal: number;
  }>({
    role: 'USER',
    status: 'ACTIVE',
    englishLevel: 'Beginner',
    dailyGoal: 5,
  });

  const fetchLevels = async () => {
    try {
      const res = await adminService.getLevels();
      if (res.success) setLevels(res.data);
    } catch (err) {
      console.error('Failed to load levels:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        englishLevel: levelFilter || undefined,
      });
      if (res.success) {
        setUsers(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setTotalCount(res.meta.total);
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter, levelFilter]);

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminService.updateUser(user.id, { status: newStatus as any });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus as any } : u))
      );
      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      role: user.role,
      status: user.status,
      englishLevel: user.englishLevel || 'Beginner',
      dailyGoal: user.dailyGoal || 5,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await adminService.updateUser(editingUser.id, editFormData);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...editFormData } : u))
      );
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, ...editFormData } : null));
      }
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setLevelFilter('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || roleFilter || statusFilter || levelFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminNav
        title="Learners & Registered Users"
        subtitle="Search users by name/email, filter by level and role, track streak and learning metrics."
      />

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by name or email */}
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email address..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All English Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              {levels.map((l) => (
                <option key={l.id} value={l.code}>
                  {l.name} ({l.code})
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Roles</option>
              <option value="USER">Learner (User)</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Quick Result Summary and Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{users.length}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{totalCount}</strong> users
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                Filtered
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Users Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-700 tracking-wider">
              <tr>
                <th className="p-4">Learner Profile</th>
                <th className="p-4">Level</th>
                <th className="p-4">Streak</th>
                <th className="p-4">Sentences</th>
                <th className="p-4">Daily Goal</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading users list...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <UserIcon size={32} className="mx-auto mb-2 opacity-40" />
                    No learners found matching the search and filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* User Identity */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedUser(u)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors text-left"
                          >
                            {u.name}
                          </button>
                          <div className="text-[11px] text-slate-400 select-all">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                        {u.englishLevel || 'Beginner'}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="p-4 font-bold text-orange-500">
                      <span className="flex items-center gap-1">
                        <Flame size={14} className="text-orange-500" />
                        {u.currentStreak}d
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Max: {u.longestStreak}d
                      </span>
                    </td>

                    {/* Sentences Learned */}
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {u.totalSentencesLearned || 0}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {u.totalWordsLearned || 0} words
                      </div>
                    </td>

                    {/* Daily Goal */}
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <Target size={13} className="text-indigo-500" />
                        {u.dailyGoal || 5}/day
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {u.role === 'ADMIN' ? 'Admin' : 'Learner'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
                            : u.status === 'SUSPENDED'
                            ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? (
                          <CheckCircle size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(u)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                        title="Edit User"
                      >
                        <Edit size={13} className="inline mr-1" /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'bg-red-50 dark:bg-red-950/60 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-400">
              Page <strong className="text-slate-700 dark:text-slate-300">{page}</strong> of{' '}
              <strong className="text-slate-700 dark:text-slate-300">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Edit User: {editingUser.name}
                </h3>
                <p className="text-xs text-slate-400">{editingUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  User Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="USER">Learner (USER)</option>
                  <option value="ADMIN">Administrator (ADMIN)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Account Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {/* English Level */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  English Level
                </label>
                <select
                  value={editFormData.englishLevel}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, englishLevel: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.code}>
                      {l.name} ({l.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Daily Goal */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Daily Goal (Sentences / day)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={editFormData.dailyGoal}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dailyGoal: parseInt(e.target.value, 10) || 5 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Level</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  {selectedUser.englishLevel}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Streak</span>
                <span className="font-extrabold text-orange-500">
                  🔥 {selectedUser.currentStreak} days
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sentences</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {selectedUser.totalSentencesLearned} learned
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Goal</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300">
                  {selectedUser.dailyGoal} sentences / day
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Goal Focus</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                  {selectedUser.learningGoal || 'Daily Conversation'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Native Lang</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedUser.nativeLanguage || 'Malayalam'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  handleOpenEditModal(selectedUser);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
