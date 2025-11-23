import { useState } from "react";
import authApi from "../api/authApi";

export default function LoginForm() {
  const [identifier, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.login({ identifier, password });
      console.log(res.data);
      localStorage.setItem("access_token", res.data.data.token);
      window.location.href = "/tasks";
    } catch (err) {
      console.error(err);
      setError("Sai username hoặc mật khẩu");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full mb-3 p-2 border rounded-lg"
        value={identifier}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="w-full mb-3 p-2 border rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 hover:bg-blue-700"
      >
        Đăng nhập
      </button>
    </form>
  );
}
