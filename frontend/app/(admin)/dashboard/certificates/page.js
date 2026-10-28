'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/services/api';
import {
  FiAward,
  FiUploadCloud,
  FiFileText,
  FiImage,
  FiTrash2,
  FiEdit3,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiCheckCircle,
  FiShield,
  FiCalendar,
  FiPlus,
  FiExternalLink,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function AdminOrganizationCertificatesPage() {
  const { currentUser, uploadFile } = useNGO();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVisibility, setActiveVisibility] = useState('all'); // 'all' | 'active' | 'hidden'
  const [copiedId, setCopiedId] = useState('');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    titleHi: '',
    category: '12A Registration',
    documentNumber: '',
    issuingAuthority: '',
    issueDate: new Date().toISOString().split('T')[0],
    validity: 'Perpetual / Ongoing',
    fileUrl: '',
    fileType: 'pdf',
    fileSize: '',
    description: '',
    status: 'Verified',
    isActive: true,
    order: 0
  });

  // Fetch all documents safely via api service
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/organization-certificates?status=all');
      if (res.data?.success && res.data?.documents) {
        setDocuments(res.data.documents);
      } else if (res.data?.data) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching organization documents:', err);
      try {
        const fallbackRes = await fetch('/api/organization-certificates?status=all', { credentials: 'include' });
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          if (fbData.success && (fbData.documents || fbData.data)) {
            setDocuments(fbData.documents || fbData.data);
          }
        }
      } catch (fbErr) {
        console.warn('Fallback fetch notice:', fbErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Visibility filter
      if (activeVisibility === 'active' && doc.isActive === false) return false;
      if (activeVisibility === 'hidden' && doc.isActive !== false) return false;

      if (activeCategory !== 'all' && doc.category !== activeCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        doc.title?.toLowerCase().includes(q) ||
        doc.documentNumber?.toLowerCase().includes(q) ||
        doc.issuingAuthority?.toLowerCase().includes(q) ||
        doc.category?.toLowerCase().includes(q)
      );
    });
  }, [documents, activeCategory, activeVisibility, searchQuery]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingDoc(null);
    setFormData({
      title: '',
      titleHi: '',
      category: '12A Registration',
      documentNumber: '',
      issuingAuthority: 'Income Tax Department, Govt. of India',
      issueDate: new Date().toISOString().split('T')[0],
      validity: 'Perpetual / Ongoing',
      fileUrl: '',
      fileType: 'pdf',
      fileSize: '',
      description: '',
      status: 'Verified',
      isActive: true,
      order: documents.length + 1
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title || '',
      titleHi: doc.titleHi || '',
      category: doc.category || 'Statutory / Legal',
      documentNumber: doc.documentNumber || '',
      issuingAuthority: doc.issuingAuthority || '',
      issueDate: doc.issueDate ? new Date(doc.issueDate).toISOString().split('T')[0] : '',
      validity: doc.validity || 'Perpetual / Ongoing',
      fileUrl: doc.fileUrl || '',
      fileType: doc.fileType || 'pdf',
      fileSize: doc.fileSize || '',
      description: doc.description || '',
      status: doc.status || 'Verified',
      isActive: doc.isActive !== false,
      order: doc.order || 0
    });
    setModalOpen(true);
  };

  // Quick toggle active / displayed status for public website
  const handleToggleVisibility = async (doc) => {
    const id = doc._id || doc.id;
    const currentActive = doc.isActive !== false;
    const newActive = !currentActive;

    // Optimistically update local state immediately
    setDocuments((prev) =>
      prev.map((d) => ((d._id === id || d.id === id) ? { ...d, isActive: newActive } : d))
    );

    try {
      const res = await api.patch(`/organization-certificates/${id}/toggle-visibility`, { isActive: newActive });
      if (res.data?.success) {
        const msg = res.data?.message || `Certificate "${doc.title}" is now ${newActive ? 'Displayed on public website' : 'Hidden from public website'}`;
        setActionSuccess(msg);
        toast.success(msg);
      } else {
        // Fallback to PUT
        const fallbackRes = await api.put(`/organization-certificates/${id}`, { isActive: newActive });
        if (fallbackRes.data?.success) {
          const msg = `Certificate "${doc.title}" is now ${newActive ? 'Displayed on public website' : 'Hidden from public website'}`;
          setActionSuccess(msg);
          toast.success(msg);
        } else {
          fetchDocuments();
          toast.error('Failed to update certificate visibility');
        }
      }
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      fetchDocuments();
      toast.error(err.response?.data?.message || 'Error updating certificate visibility');
    }
  };

  // Handle File Upload to backend
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      if (uploadFile) {
        const res = await uploadFile(file, 'documents');
        if (res.success && res.url) {
          setFormData((prev) => ({
            ...prev,
            fileUrl: res.url,
            fileType: isPdf ? 'pdf' : 'image',
            fileSize: sizeMb
          }));
          toast.success('Certificate file uploaded successfully!');
          return;
        }
      }

      // Direct api upload fallback
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'documents');
      const res = await api.post('/upload', fd, {
        headers: { 'x-upload-category': 'documents' }
      });
      if (res.data?.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          fileUrl: res.data.url,
          fileType: isPdf ? 'pdf' : 'image',
          fileSize: sizeMb
        }));
        toast.success('Certificate file uploaded successfully!');
      } else {
        toast.error(res.data?.message || 'File upload failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      toast.error('Please enter certificate document title.');
      return;
    }
    if (!formData.fileUrl || !formData.fileUrl.trim()) {
      toast.error('Please upload the certificate file (PDF or Image).');
      return;
    }

    try {
      if (editingDoc) {
        const docId = editingDoc._id || editingDoc.id;
        const res = await api.put(`/organization-certificates/${docId}`, formData);
        if (res.data?.success) {
          toast.success('Organization certificate updated successfully!');
          setActionSuccess('Organization certificate updated successfully!');
          await fetchDocuments();
          setModalOpen(false);
        } else {
          toast.error(res.data?.message || 'Failed to update certificate document');
        }
      } else {
        const res = await api.post('/organization-certificates', formData);
        if (res.data?.success) {
          toast.success('New verified organization certificate added successfully!');
          setActionSuccess('New verified organization certificate added!');
          await fetchDocuments();
          setModalOpen(false);
        } else {
          toast.error(res.data?.message || 'Failed to add certificate document');
        }
      }
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Save certificate error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save certificate document');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization certificate?')) {
      return;
    }

    try {
      const res = await api.delete(`/organization-certificates/${id}`);
      if (res.data?.success) {
        toast.success(res.data?.message || 'Organization certificate deleted successfully.');
        setActionSuccess('Organization certificate deleted successfully.');
        setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== id));
        fetchDocuments();
        setTimeout(() => setActionSuccess(''), 4000);
      } else {
        toast.error(res.data?.message || 'Failed to delete certificate');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  // Copy registration number
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const displayedCount = useMemo(() => documents.filter((d) => d.isActive !== false).length, [documents]);
  const hiddenCount = useMemo(() => documents.filter((d) => d.isActive === false).length, [documents]);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="w-full bg-linear-to-r from-amber-100/90 via-[#fefce8] to-amber-50 p-4 rounded-bl-3xl border-b border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-white text-amber-900 border border-amber-300 shadow-2xs shrink-0">
              <FiAward className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-stone-950 tracking-tight">
                Organization Statutory Certificates &amp; Legal Documents CMS
              </h1>
              <p className="text-xs text-amber-950/80 font-medium">
                Apna Parivar Vriddh Aashram Foundation • Verified Registrations &amp; Charters
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 text-xs font-black shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Upload New Certificate</span>
          </button>

          <Link
            href="/certificates"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-stone-800 border border-amber-200 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FiExternalLink className="w-3.5 h-3.5 text-amber-800" />
            <span>Public Showcase</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-stone-600 hover:text-amber-900 bg-white/80 hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition shadow-2xs"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="mx-3 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs animate-fadeIn">
          <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Unified Search & Filters Bar */}
      <div className="bg-white mx-3 p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by certificate title, reg no, or issuing authority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          {/* Visibility Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveVisibility('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${activeVisibility === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              All ({documents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveVisibility('active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${activeVisibility === 'active'
                ? 'bg-emerald-700 text-white shadow-2xs font-black'
                : 'text-emerald-800 hover:bg-emerald-50'
                }`}
            >
              <FiEye className="w-3.5 h-3.5" />
              <span>Displayed ({displayedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVisibility('hidden')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${activeVisibility === 'hidden'
                ? 'bg-amber-600 text-white shadow-2xs font-black'
                : 'text-amber-900 hover:bg-amber-50'
                }`}
            >
              <FiEyeOff className="w-3.5 h-3.5" />
              <span>Hidden ({hiddenCount})</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 w-full overflow-x-auto pb-1 text-xs font-bold border-t border-slate-100 pt-2">
          {[
            { key: 'all', label: 'All Categories' },
            { key: '12A Registration', label: '12A Order' },
            { key: '80G Exemption', label: '80G Tax Exemption' },
            { key: 'NITI Aayog Darpan', label: 'NITI Aayog' },
            { key: 'Trust Registration', label: 'Trust Deed' },
            { key: 'CSR-1 Filing', label: 'CSR-1' },
            { key: 'PAN Card', label: 'PAN Card' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${activeCategory === tab.key
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container (VolunteerManagement Standard with Sticky Actions) */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Certificate &amp; Category</th>
                <th className="py-3 px-3.5">Registration No. / Authority</th>
                <th className="py-3 px-3.5">File Format</th>
                <th className="py-3 px-3.5">Issue Date &amp; Validity</th>
                <th className="py-3 px-3.5 text-center">Display Status</th>
                <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FiRefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-700 mb-1" />
                    <span>Loading organization certificates...</span>
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No certificates found. Click &ldquo;Upload New Certificate&rdquo; above to add your 12A, 80G, or Darpan accreditation.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
                  const id = doc._id || doc.id;
                  const isPdf = doc.fileType === 'pdf' || /\.pdf(\?|$)/i.test(doc.fileUrl);
                  const issueDateFormatted = doc.issueDate
                    ? new Date(doc.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'N/A';

                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      {/* Title & Category */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPdf ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}>
                            {isPdf ? <FiFileText className="w-4 h-4" /> : <FiImage className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">
                              {doc.title}
                            </div>
                            <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {doc.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Reg No & Authority */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-700 text-xs">
                          <span>{doc.documentNumber || 'Pending Order No.'}</span>
                          {doc.documentNumber && (
                            <button
                              type="button"
                              onClick={() => handleCopy(doc.documentNumber)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                              title="Copy Registration Number"
                            >
                              {copiedId === doc.documentNumber ? (
                                <FiCheck className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <FiCopy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-50" title={doc.issuingAuthority}>
                          {doc.issuingAuthority || 'Govt. of India'}
                        </div>
                      </td>

                      {/* File format */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPdf ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {isPdf ? 'PDF Document' : 'Image Scan'}
                        </span>
                        {doc.fileSize && (
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {doc.fileSize}
                          </span>
                        )}
                      </td>

                      {/* Date & Validity */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <FiCalendar className="w-3 h-3 text-slate-400" />
                          <span>{issueDateFormatted}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                          {doc.validity || 'Perpetual'}
                        </span>
                      </td>

                      {/* Display / Visibility Status Toggle Button */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(doc)}
                          title={
                            doc.isActive !== false
                              ? "Certificate is PUBLIC on /certificates. Click to Hide."
                              : "Certificate is HIDDEN from /certificates. Click to Display."
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition cursor-pointer shadow-2xs ${doc.isActive !== false
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
                            : "bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300"
                            }`}
                        >
                          {doc.isActive !== false ? (
                            <>
                              <FiEye className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>Displayed</span>
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Sticky Right Actions Column */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Toggle Hide / Display Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(doc)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition border cursor-pointer ${doc.isActive !== false
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300"
                              }`}
                            title={
                              doc.isActive !== false
                                ? "Hide this certificate from public website (/certificates)"
                                : "Display this certificate on public website (/certificates)"
                            }
                          >
                            {doc.isActive !== false ? (
                              <>
                                <FiEyeOff className="w-3.5 h-3.5 text-amber-700" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <FiEye className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Display</span>
                              </>
                            )}
                          </button>

                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                            title="Inspect Certificate"
                          >
                            <FiEye className="w-3.5 h-3.5 text-slate-600" />
                            <span>Preview</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(doc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition border border-emerald-200 cursor-pointer"
                            title="Edit Certificate Details"
                          >
                            <FiEdit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Certificate"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload & Edit Document Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiAward className="text-emerald-700" />
                <span>{editingDoc ? 'Edit Organization Certificate' : 'Upload Verified Organization Certificate'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Document Title */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Certificate / Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Section 12A Tax Exemption Registration Certificate"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Category & Registration Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Statutory Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="12A Registration">12A Tax Exemption Registration</option>
                    <option value="80G Exemption">80G Donor Tax Deduction Approval</option>
                    <option value="NITI Aayog Darpan">NITI Aayog Darpan Unique ID</option>
                    <option value="Trust Registration">Trust Deed / Registration Charter</option>
                    <option value="CSR-1 Filing">MCA CSR-1 Registration</option>
                    <option value="PAN Card">PAN Card (Organization)</option>
                    <option value="Statutory / Legal">Statutory / Legal Order</option>
                    <option value="Audit Report">Annual Audit Report</option>
                    <option value="Other">Other Verified Document</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Document Order / Registration No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    placeholder="e.g. CIT(EXEMP)/12A/2021-22/A-492"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Issuing Authority & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                    placeholder="e.g. Income Tax Department, Govt. of India"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Validity Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.validity}
                    onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                    placeholder="e.g. Perpetual / AY 2022-23 Onwards"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Issue Date & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Format (PDF / Image)
                  </label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="image">Image Scan (.jpg, .png)</option>
                  </select>
                </div>
              </div>

              {/* Upload Certificate File */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 block">
                  Select Certificate File (PDF or Image) *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer text-xs flex items-center gap-1.5 transition">
                    <FiUploadCloud className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Choose File from Computer'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">Supports official PDF or High-Resolution Scans</span>
                </div>

                {formData.fileUrl && (
                  <div className="pt-2 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="truncate max-w-87.5 font-mono text-[11px]">
                      {formData.fileUrl}
                    </span>
                    <span className="font-bold uppercase text-[10px] bg-emerald-200 px-2 py-0.5 rounded">
                      Uploaded ({formData.fileType})
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Public Statutory Description / Details
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain donor tax exemption, government recognition, or legal significance..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Display on Public Website Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    Display on Public Website (/certificates)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    When enabled, this certificate is visible to all visitors. Turn off to hide.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-md shadow-emerald-700/20 cursor-pointer disabled:opacity-50"
                >
                  {editingDoc ? 'Update Certificate' : 'Save & Publish Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Fidelity Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-900 text-base">{previewDoc.title}</h3>
                <span className="text-xs text-emerald-700 font-mono font-bold">
                  Order No: {previewDoc.documentNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden p-2 flex items-center justify-center min-h-100">
              {previewDoc.fileType === 'pdf' || /\.pdf(\?|$)/i.test(previewDoc.fileUrl) ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.title}
                  className="w-full h-137.5 rounded-xl border border-slate-300"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-h-137.5 w-auto object-contain rounded-xl shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
