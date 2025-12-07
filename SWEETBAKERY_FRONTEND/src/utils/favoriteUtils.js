const FAVORITE_KEY = "favorites";

// Lấy danh sách
export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
}

// Kiểm tra sản phẩm đã yêu thích chưa
export function isFavorite(productId) {
  const list = getFavorites();
  return list.some((p) => p.id === productId);
}

// Thêm
export function addFavorite(product) {
  const list = getFavorites();
  const exists = list.some((p) => p.id === product.id);

  if (!exists) {
    const newList = [...list, product];
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(newList));
  }
}

// Xóa
export function removeFavorite(productId) {
  const list = getFavorites();
  const newList = list.filter((p) => p.id !== productId);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(newList));
}

// Toggle
export function toggleFavorite(product) {
  if (isFavorite(product.id)) {
    removeFavorite(product.id);
  } else {
    addFavorite(product);
  }

  // Thông báo cho ProfilePage cập nhật UI
  window.dispatchEvent(new Event("favorites_update"));
}
