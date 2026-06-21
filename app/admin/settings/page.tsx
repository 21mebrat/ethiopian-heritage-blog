"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Camera,
  Mail,
  Type,
  FileText
} from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

export default function AdminSettings() {
  const { user, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: ""
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/auth/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Immediately update the profile in the DB so it persists on refresh
        const updateRes = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...profileData, avatar: data.url }),
        });

        const updateData = await updateRes.json();
        if (updateData.success) {
          setProfileData(prev => ({ ...prev, avatar: data.url }));
          refresh();
          setUpdateStatus({ type: 'success', msg: "Avatar updated and synced!" });
          setTimeout(() => setUpdateStatus(null), 3000);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setUpdateStatus({ type: 'error', msg: err.message || "Upload failed" });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setUpdateStatus(null);
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (data.success) {
        setUpdateStatus({ type: 'success', msg: "Profile updated successfully" });
        refresh();
        setTimeout(() => setUpdateStatus(null), 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setUpdateStatus({ type: 'error', msg: err.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setUpdateStatus({ type: 'error', msg: "New passwords do not match" });
      return;
    }

    try {
      setIsSaving(true);
      setUpdateStatus(null);
      const response = await fetch("/api/auth/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUpdateStatus({ type: 'success', msg: "Password changed successfully" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setUpdateStatus(null), 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setUpdateStatus({ type: 'error', msg: err.message || "Failed to change password" });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Security & Password", icon: Lock },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-[10px]">
          <Shield size={14} />
          <span>Account Settings</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Identity <span className="text-primary italic font-normal">& Protection</span></h1>
        <p className="text-white/40 font-medium leading-relaxed">
          Manage your personal presence and secure your ethereal credentials.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        {/* Sidebar Tabs */}
        <aside className="md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setUpdateStatus(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
                    ? "bg-primary text-black"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Form Content */}
        <div className="flex-1">
          {activeTab === "profile" ? (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {isUploadingAvatar ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-white/10" />
                      )}
                    </div>
                    <label
                      className={`absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl cursor-pointer transition-opacity ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <Camera size={24} className="text-white/60" />
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                      />
                    </label>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white">Profile Photo</h3>
                    <p className="text-[11px] text-white/30 font-medium">Click on the image to upload.</p>
                    <p className="text-[10px] text-primary/60 font-medium italic">Supports JPG, PNG, WEBP</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Type size={12} /> Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Mail size={12} /> Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
                    <FileText size={12} className="w-3 h-3" /> Short Bio
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell your ethereal story..."
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-medium resize-none"
                  />
                </div>

                {updateStatus && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in zoom-in duration-300 ${updateStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-destructive/10 border-destructive/20 text-destructive'
                    }`}>
                    {updateStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold">{updateStatus.msg}</p>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-3 px-8 py-3 bg-primary text-black rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>UPDATE IDENTITY</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSave} className="space-y-6">
              <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Lock size={12} /> Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-medium"
                  />
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Shield size={12} /> New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Shield size={12} /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/40 transition-all font-medium"
                  />
                </div>

                {updateStatus && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in zoom-in duration-300 ${updateStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-destructive/10 border-destructive/20 text-destructive'
                    }`}>
                    {updateStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold">{updateStatus.msg}</p>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-3 px-8 py-3 bg-primary text-black rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span>CHANGE PASSWORD</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
