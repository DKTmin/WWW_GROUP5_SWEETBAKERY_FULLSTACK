import React, { useEffect, useState } from "react";
// Đảm bảo đường dẫn api của bạn đúng
import adminApi from "../../apis/adminApi"; 
// Cài đặt: npm install lucide-react
import { 
  Search, Plus, Edit, Trash2, X, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Filter 
} from "lucide-react";

// --- CẤU HÌNH UI ---
const ITEMS_PER_PAGE = 8; 

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Nháp", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { value: "ACTIVE", label: "Đang bán", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "OUT_OF_STOCK", label: "Hết hàng", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "DISCONTINUED", label: "Ngừng KD", color: "bg-red-50 text-red-700 border-red-200" },
];

export default function PastriesManagement() {
  // --- 1. STATE & DATA (GIỮ NGUYÊN LOGIC CŨ) ---
  const [pastries, setPastries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", categoryId: "", price: "", stockQuantity: "",
    status: "DRAFT", description: "", imageUrl: "",
  });

  // --- 2. API CALLS (KHÔNG ĐỔI) ---
  const loadData = async () => {
    try {
      setLoading(true);
      const [resCat, resPas] = await Promise.all([
        adminApi.getAdminCategories(),
        adminApi.getAdminPastries()
      ]);
      setCategories(resCat.data.data || []);
      setPastries(resPas.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- 3. HANDLERS (LOGIC NGHIỆP VỤ GIỮ NGUYÊN) ---
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", categoryId: "", price: "", stockQuantity: "",
      status: "DRAFT", description: "", imageUrl: "",
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || "",
        categoryId: product.categoryId || "",
        price: product.price ?? 0,
        stockQuantity: product.stockQuantity ?? 0,
        status: product.status || "DRAFT",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        categoryId: formData.categoryId || null,
      };

      if (editingId) await adminApi.updatePastry(editingId, payload);
      else await adminApi.createPastry(payload);

      await loadData(); // Reload lại list
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa bánh này?")) return;
    try {
      await adminApi.deletePastry(id);
      setPastries(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  // --- 4. FRONTEND LOGIC: SEARCH & PAGING (MỚI THÊM) ---
  
  // Lọc dữ liệu
  const filteredData = pastries.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory ? p.categoryId === filterCategory : true;
    return matchName && matchCat;
  });

  // Tính toán Paging
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset trang về 1 khi search
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterCategory]);

  // Format tiền
  const formatVND = (v) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6 font-sans text-slate-800">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Bánh ngọt</h1>
          <p className="text-sm text-slate-500 mt-1">Tổng cộng {pastries.length} sản phẩm trong hệ thống</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
        >
          <Plus size={18} /> Thêm bánh mới
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên bánh..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
          />
        </div>
        <div className="md:col-span-3 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none appearance-none bg-white"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Sản phẩm</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Danh mục</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Giá bán</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">Tồn kho</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Không tìm thấy sản phẩm nào.</td></tr>
              ) : (
                currentData.map(p => {
                  const statusInfo = STATUS_OPTIONS.find(s => s.value === p.status) || STATUS_OPTIONS[0];
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={20}/></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 line-clamp-1">{p.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1 max-w-[150px]">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {p.categoryName || categories.find(c => c.id === p.categoryId)?.name || "---"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-amber-600">
                        {formatVND(p.price)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${p.stockQuantity > 0 ? 'bg-slate-100 text-slate-700' : 'bg-red-50 text-red-600'}`}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
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

        {/* --- PAGINATION --- */}
        {!loading && filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-sm text-slate-500">
              Trang <b>{currentPage}</b> / <b>{totalPages}</b>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL FORM (POPUP) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form id="pastryForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên bánh <span className="text-red-500">*</span></label>
                    <input required name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none" placeholder="Nhập tên bánh" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                    <select name="categoryId" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none">
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Giá</label>
                      <input type="number" min="0" name="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tồn kho</label>
                      <input type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} 
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                    <select name="status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none">
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Link Ảnh</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                       className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none text-sm" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                    <textarea rows={3} name="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-amber-500 outline-none" placeholder="Mô tả ngắn..." />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Hủy</button>
              <button form="pastryForm" type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm">
                {editingId ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}