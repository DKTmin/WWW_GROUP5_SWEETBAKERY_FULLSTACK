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
            Nếu bạn có bất kỳ câu hỏi nào, hãy gửi tin nhắn cho chúng tôi.
            Sweet Bakery luôn sẵn sàng hỗ trợ bạn 24/7.
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

            {/* highlight card */}
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

          {/* Right: Form */}
          <form className="p-6 rounded-3xl bg-white shadow space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Họ và tên
              </label>
              <input
                className="mt-1 w-full p-3 border-none rounded-xl bg-[#FFF3D9] focus:outline-none"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full p-3 border-none rounded-xl bg-[#FFF3D9] focus:outline-none"
                placeholder="sweetbakery@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Tin nhắn
              </label>
              <textarea
                className="mt-1 w-full p-3 border-none rounded-xl bg-[#FFF3D9] focus:outline-none h-32"
                placeholder="Nội dung cần hỗ trợ..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-amber-50 shadow hover:bg-amber-800 transition"
            >
              Gửi liên hệ
            </button>
          </form>

        </section>
      </div>
    </main>
  );
}
