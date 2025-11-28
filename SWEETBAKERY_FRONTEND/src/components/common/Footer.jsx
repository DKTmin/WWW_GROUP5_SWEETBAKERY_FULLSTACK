// src/components/common/Footer.jsx
import footerBg from "../../assets/footer/footer.jpg";

// --- ICONS (Giữ nguyên) ---
const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.96 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" /></svg>
);
const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
);
const ClockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
);
const FacebookIcon = ({ className }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
);
const InstagramIcon = ({ className }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 3.053c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 w-full bg-[#FFFBF0] text-stone-600">
      
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-stretch shadow-xl rounded-t-[40px] md:rounded-none md:shadow-none overflow-hidden bg-white md:bg-transparent">
        
        {/* --- CỘT 1: ẢNH --- */}
        <div className="relative h-64 w-full md:h-96 md:w-5/12 overflow-hidden md:rounded-tr-[100px] shadow-sm z-10">
           <img 
            src={footerBg} 
            alt="Sweet Bakery Store" 
            className="h-full w-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
           />
           {/* Tag nhỏ trên ảnh */}
           <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-900 shadow-sm backdrop-blur-sm">
             Premium Taste
           </div>
        </div>

        {/* --- CỘT 2: NỘI DUNG --- */}
        <div className="flex w-full flex-col justify-center bg-[#FFFBF0] px-6 py-8 md:w-7/12 md:px-10 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* Brand */}
            <div className="max-w-xs">
                <h2 className="text-2xl font-bold text-amber-900 font-serif">Sweet Bakery</h2>
                <p className="mt-2 text-sm text-stone-500 italic leading-relaxed">
                "Hương vị ngọt ngào từ nguyên liệu tinh tuyển. Mỗi chiếc bánh là một tác phẩm nghệ thuật."
                </p>
            </div>

            {/* Social Icons (Đưa lên đây cho gọn) */}
            <div className="flex gap-3">
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-500 hover:bg-amber-600 hover:text-white transition-colors"><FacebookIcon className="h-4 w-4" /></a>
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-500 hover:bg-amber-600 hover:text-white transition-colors"><InstagramIcon className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="my-6 border-t border-amber-900/10"></div>

          {/* Grid thông tin nhỏ gọn hơn */}
          <div className="grid gap-6 sm:grid-cols-2 text-sm">
            <div>
              <div className="mb-2 flex items-center gap-2 text-amber-800 font-bold uppercase text-xs tracking-wide">
                <MapPinIcon className="h-4 w-4" /> Cửa hàng
              </div>
              <p className="text-stone-600">123 Đường Ngọt Ngào, Gò Vấp, TP.HCM</p>
              <p className="text-stone-600 mt-1">Lầu 1 Saigon Centre, Q.1, TP.HCM</p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-amber-800 font-bold uppercase text-xs tracking-wide">
                <ClockIcon className="h-4 w-4" /> Giờ mở cửa
              </div>
              <div className="flex justify-between text-stone-600 max-w-[200px]">
                 <span>T2 - T6:</span> <span>07:00 - 22:00</span>
              </div>
              <div className="flex justify-between text-stone-600 max-w-[200px] mt-1">
                 <span>T7 - CN:</span> <span>08:00 - 23:00</span>
              </div>
            </div>
          </div>

          {/* Footer Bottom: Hotline & Copyright */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
             <a 
                href="tel:0123456789"
                className="flex items-center gap-2 rounded-full bg-amber-900 px-5 py-2 text-white shadow-lg hover:bg-amber-800 hover:scale-105 transition-all text-sm font-semibold"
            >
                <PhoneIcon className="h-4 w-4" />
                0123 456 789
            </a>
            <div className="text-[11px] text-stone-400 text-center sm:text-right">
                © {currentYear} Sweet Bakery.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}