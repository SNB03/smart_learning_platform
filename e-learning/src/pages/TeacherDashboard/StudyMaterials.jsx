import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText, Search, Plus, Filter, File, Link as LinkIcon,
  Trash2, Download, ExternalLink, X, UploadCloud,
  CheckCircle2, XCircle, Loader2, Play,Video,FolderPlus
} from 'lucide-react';

const StudyMaterials = () => {
  // Grab the mock user from the Teacher Dashboard context
  const context = useOutletContext();
  const user = context?.user || { fullName: 'Teacher' };
  const isClassTeacher = context?.isClassTeacher || false;

  // App State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Upload Flow State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [uploadData, setUploadData] = useState({ title: '', classLevel: '5', subject: '', file: null, url: '' });

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });



  const myClasses = ['5', '6', '7', '8', '9', '10']; // Mock available classes

  // Add this inside your component, replacing the mock state
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. FETCH MATERIALS ON LOAD
    useEffect(() => {
      const fetchMaterials = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/materials`);
          if (response.ok) {
            const data = await response.json();
            // Format the date strings coming from Spring Boot
            const formattedData = data.map(m => ({
              ...m,
              date: new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            }));
            setMaterials(formattedData);
          }
        } catch (error) {
          showToast("Failed to connect to server.", "error");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMaterials();
    }, []);

    // 2. HANDLE UPLOAD SUBMIT
    const handleUploadSubmit = async (e) => {
      e.preventDefault();
      setIsUploading(true);

      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('type', uploadType);
      formData.append('classLevel', uploadData.classLevel);
      formData.append('subject', uploadData.subject);
      formData.append('authorId', user.id);

      if (uploadType === 'link') {
        formData.append('url', uploadData.url);
      } else if (uploadType === 'file' && uploadData.file) {
        formData.append('file', uploadData.file);
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/materials`, {
          method: 'POST',
          body: formData // Browser automatically sets correct Content-Type for FormData
        });

        if (response.ok) {
          const newMaterial = await response.json();
          newMaterial.date = 'Just now'; // Instant UI feedback

          setMaterials([newMaterial, ...materials]);
          setIsUploading(false);
          setIsUploadModalOpen(false);
          showToast("Material published successfully!", "success");

          // Reset form
          setUploadData({ title: '', classLevel: '5', subject: '', file: null, url: '' });
          setUploadType('file');
        } else {
          showToast("Failed to upload material.", "error");
        }
      } catch (error) {
        showToast("Network error.", "error");
      } finally {
        setIsUploading(false);
      }
    };

    // 3. HANDLE DELETE
    const handleDelete = async (id) => {
      if (window.confirm("Delete this material? Students will lose access immediately.")) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/materials/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            setMaterials(materials.filter(m => m.id !== id));
            showToast("Material removed.", "success");
          }
        } catch (error) {
          showToast("Failed to delete.", "error");
        }
      }
    };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || m.classLevel === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="animate-fade-in pb-24 sm:pb-10 relative">

      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* --- MOBILE FLOATING ACTION BUTTON (FAB) --- */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* --- UPLOAD MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isUploading && setIsUploadModalOpen(false)}></div>

          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up sm:animate-fade-in flex flex-col max-h-[90vh]">

            <div className="p-5 sm:p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FolderPlus className="w-6 h-6 text-blue-600" /> Add Material
              </h3>
              <button onClick={() => !isUploading && setIsUploadModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto">

              {/* Type Toggle Switch */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${uploadType === 'file' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText className="w-4 h-4" /> Document / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('link')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${uploadType === 'link' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Play className="w-4 h-4" /> Video / Web Link
                </button>
              </div>

              {/* Title & Subject */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Material Title</label>
                  <input type="text" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-800 transition-all" placeholder="e.g. Newton's Laws Notes" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Target Class</label>
                    <select value={uploadData.classLevel} onChange={e => setUploadData({...uploadData, classLevel: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 cursor-pointer transition-all">
                      {myClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <input type="text" required value={uploadData.subject} onChange={e => setUploadData({...uploadData, subject: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-800 transition-all" placeholder="e.g. Science" />
                  </div>
                </div>
              </div>

              {/* Dynamic Input based on Type */}
              <div className="pt-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  {uploadType === 'file' ? 'Upload Document' : 'Paste URL'}
                </label>

                {uploadType === 'file' ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 rounded-xl cursor-pointer transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                      <p className="text-sm font-bold text-gray-600 group-hover:text-blue-700">Click to browse or drag file</p>
                      <p className="text-xs font-medium text-gray-400 mt-1">PDF, DOC, JPG (Max 10MB)</p>
                    </div>
                    <input type="file" required className="hidden" />
                  </label>
                ) : (
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="url" required value={uploadData.url} onChange={e => setUploadData({...uploadData, url: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-indigo-900 transition-all" placeholder="https://youtube.com/..." />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button type="submit" disabled={isUploading} className={`w-full py-3.5 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-md ${uploadType === 'file' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}>
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                  {isUploading ? 'Publishing...' : `Publish ${uploadType === 'file' ? 'Document' : 'Link'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TOP HEADER & CONTROLS --- */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 hidden sm:block" /> Study Materials
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage and share resources with your classes</p>
        </div>

        <button onClick={() => setIsUploadModalOpen(true)} className="hidden sm:flex w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 active:scale-95 transition-all items-center justify-center gap-2 shadow-sm shadow-blue-200">
          <Plus className="w-5 h-5" /> Add Material
        </button>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search resources by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-700"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3.5 sm:py-3 rounded-xl shadow-sm sm:w-48 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full cursor-pointer"
          >
            <option value="all">All Classes</option>
            {myClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
      </div>

      {/* --- RESOURCE CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-gray-200 border-dashed">
            <FolderPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 text-lg">No materials found</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">You haven't uploaded any resources for this filter.</p>
            <button onClick={() => setIsUploadModalOpen(true)} className="sm:hidden inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> Add Material Now
            </button>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full overflow-hidden relative">

              {/* Type Indicator Banner */}
              <div className={`h-1.5 w-full ${material.type === 'file' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${material.type === 'file' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                    {material.type === 'file' ? <FileText className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </div>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2 pr-4">
                  {material.title}
                </h4>

                <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                    Class {material.classLevel}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    • {material.subject}
                  </span>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-400">
                    {material.date} {material.type === 'file' && `• ${material.fileSize}`}
                  </span>

                  <button
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors active:scale-95 ${
                      material.type === 'file'
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {material.type === 'file' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    <span className="hidden sm:inline">{material.type === 'file' ? 'Download' : 'Open Link'}</span>
                    <span className="sm:hidden">{material.type === 'file' ? 'Get' : 'View'}</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default StudyMaterials;