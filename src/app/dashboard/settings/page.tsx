"use client";

import { useState } from "react";
import {
  Shield,
  FileText,
  Server,
  Database,
  Building,
  CheckCircle2,
} from "lucide-react";

const tabs = [
  { id: "document", label: "Dokumen", icon: FileText },
  { id: "org", label: "Organisasi", icon: Building },
  { id: "infra", label: "Infrastruktur", icon: Server },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("document");

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h2 className="text-[16px] font-semibold text-zinc-900">Pengaturan Sistem</h2>
        <p className="text-[12px] text-zinc-500 mt-0.5">
          Konfigurasi aplikasi SI-PKP dan parameter dokumen standar PT KAI
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Document Template Tab */}
      {activeTab === "document" && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-[13px]">
                Standar Dokumen Formulir PT KAI
              </h3>
              <p className="text-[11px] text-zinc-400">
                Parameter template formulir laporan keluhan resmi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
              <span className="text-zinc-400 font-medium text-[11px]">Nomor Dokumen Standar</span>
              <p className="font-mono font-bold text-zinc-900 text-[13px]">FR.SM/TI/033.001</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
              <span className="text-zinc-400 font-medium text-[11px]">Versi Template</span>
              <p className="font-mono font-bold text-zinc-900 text-[13px]">002-2020</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
              <span className="text-zinc-400 font-medium text-[11px]">Format Nomor Keluhan</span>
              <p className="font-mono font-bold text-blue-700 text-[13px]">KAI-YYYYMM-XXXXX (5 Digit)</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
              <span className="text-zinc-400 font-medium text-[11px]">Satuan Kerja Penerbit</span>
              <p className="font-medium text-zinc-900 text-[13px]">Sistem Informasi (TI)</p>
            </div>
          </div>
        </div>
      )}

      {/* Organization Tab */}
      {activeTab === "org" && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-[13px]">Identitas Perusahaan</h3>
              <p className="text-[11px] text-zinc-400">Metadata institusi pada header PDF</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="form-label text-[12px]">Nama Perusahaan</label>
              <input
                type="text"
                defaultValue="PT KERETA API INDONESIA (PERSERO)"
                className="form-input text-[12px] bg-zinc-50"
                readOnly
              />
            </div>
            <div>
              <label className="form-label text-[12px]">Divisi Penanggung Jawab</label>
              <input
                type="text"
                defaultValue="SISTEM INFORMASI"
                className="form-input text-[12px] bg-zinc-50"
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Infrastructure Tab */}
      {activeTab === "infra" && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-[13px]">
                Status Infrastruktur & Engine
              </h3>
              <p className="text-[11px] text-zinc-400">Pemeriksaan komponen aktif</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-zinc-700 text-[12px]">Database PostgreSQL 15</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                Terkoneksi (Port 5432)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-medium text-zinc-700 text-[12px]">Engine PDF Puppeteer</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                Siap (Headless Chromium)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-medium text-zinc-700 text-[12px]">Autentikasi & Audit Trail</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                Aktif (RBAC & Event Logger)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
