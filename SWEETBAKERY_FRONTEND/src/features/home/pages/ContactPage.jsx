export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E9] pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4">

        {/* Title */}
        <section className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Sweet Bakery
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-2 text-sm text-stone-600 max-w-xl mx-auto">
            Nếu bạn có bất kỳ câu hỏi nào, Sweet Bakery luôn sẵn sàng hỗ trợ bạn.
          </p>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left: Contact info + Map */}
          <div className="space-y-6">

            <div className="p-6 rounded-3xl bg-white shadow">
              <h3 className="text-lg font-semibold text-stone-900">
                📍 Địa chỉ cửa hàng
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                123 Đường Ngọt Ngào, Quận Gò Vấp, TP. HCM
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow">
              <h3 className="text-lg font-semibold text-stone-900">📞 Hotline</h3>
              <p className="mt-1 text-sm text-stone-600">0123 456 789</p>
            </div>

            <div className="p-6 rounded-3xl bg-white shadow">
              <h3 className="text-lg font-semibold text-stone-900">📧 Email hỗ trợ</h3>
              <p className="mt-1 text-sm text-stone-600">sweetbakery@gmail.com</p>
            </div>

            {/* Highlight card */}
            <div className="w-full max-w-sm rounded-3xl bg-linear-to-br from-amber-500 via-amber-600 to-stone-900 p-px shadow-lg">
              <div className="rounded-3xl bg-[#FFF8E9] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Special support
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  Hỗ trợ đặt bánh theo yêu cầu
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  Thiết kế bánh theo ý tưởng riêng của bạn, tư vấn miễn phí.
                </p>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <iframe
                title="Sweet Bakery Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.040879859593!2d106.67797027594462!3d10.806975189341364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529297c1e9f21%3A0x50f01f7af5120a06!2zR8OyIFbhuq9wLCBI4buTIENow60sIEhvIENoaSBNaW5oIENpdHk!5e0!3m2!1svi!2s!4v1708928849000!5m2!1svi!2s"
                width="100%"
                height="250"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* Right: Introduction Section */}
<div className="p-8 rounded-3xl bg-gradient-to-br from-white via-[#FFF7E1] to-[#FFECC7] shadow-xl border border-amber-100">

  {/* Title */}
  <div className="mb-5">
    <h2 className="text-2xl font-bold text-stone-900">Về SweetBakery</h2>
    <div className="w-16 h-1 rounded-full bg-amber-500 mt-2"></div>
  </div>

  {/* Content */}
  <div className="space-y-4 text-stone-700 leading-relaxed text-[15px]">

    <p>
      Những ai yêu thích bánh ngọt, đặc biệt là các dòng bánh mang phong cách Pháp,
      chắc hẳn sẽ cảm nhận được sự tinh tế khi thưởng thức các sản phẩm của
      <span className="font-semibold text-stone-900"> SweetBakery</span>.
    </p>

    <p>
      Chúng tôi chọn phong cách tối giản: không phô trương, không rực rỡ, nhưng chú trọng vào
      <span className="font-semibold text-stone-900"> chất lượng thật</span>.
      Vị ngọt nhẹ, độ béo thanh và hương thơm tự nhiên giúp bạn thưởng thức nhiều mà không ngán.
    </p>

    <p>
      Tất cả sản phẩm đều được làm
      <span className="font-semibold text-stone-900"> 100% thủ công (handmade)</span>,
      từ bánh mì, bánh ngọt đến bánh quy — mỗi chiếc bánh đều mang dấu ấn riêng,
      không theo lối “công nghiệp”.
    </p>

    <p>
      SweetBakery luôn ưu tiên nguyên liệu tươi mới, rõ nguồn gốc. Quy trình làm bánh được thực hiện
      tỉ mỉ trong từng bước để mang đến sự hài hòa giữa hương vị và thẩm mỹ.
    </p>

    <p>
      Chúng tôi hoạt động dưới mô hình tiệm bánh sinh viên tại TP. Hồ Chí Minh, mang phong cách trẻ trung,
      tinh tế và luôn giữ trọn tâm huyết trong từng sản phẩm gửi đến bạn.
    </p>

    {/* Highlight paragraph styled differently */}
    <div className="mt-6 p-5 rounded-2xl bg-amber-100/60 border border-amber-300 
                text-amber-900 text-[15px] leading-relaxed font-medium shadow-sm">
      Hiện SweetBakery phát triển dưới mô hình tiệm bánh sinh viên tại TP. Hồ Chí Minh, mang phong cách trẻ trung nhưng vẫn giữ tinh thần trang nhã, tinh tế và chú trọng chất lượng trong từng sản phẩm.
    </div>

  </div>

</div>


        </section>
      </div>
    </main>
  );
}
