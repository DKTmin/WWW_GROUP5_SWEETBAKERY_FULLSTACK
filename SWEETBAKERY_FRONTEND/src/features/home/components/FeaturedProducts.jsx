// src/features/home/components/FeaturedProducts.jsx
import { useEffect, useState } from "react";
import pastryApi from "../api/pastryApi";
import PastryCard from "../components/PastryCard";

export default function FeaturedProducts({ size = 8, categoryId = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (categoryId) {
          // get by category and take first `size`
          const res = await pastryApi.findByCategory(categoryId);
          const arr = res.data?.data || [];
          setItems(arr.slice(0, size));
        } else {
          const res = await pastryApi.findAllTask();
          // previous API returned List -> res.data?.data is array in your project
          const arr = res.data?.data || [];
          setItems(arr.slice(0, size));
        }
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [size, categoryId]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: size }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-3xl bg-amber-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => (
        <PastryCard key={p.id || p.name} pastry={p} />
      ))}
    </div>
  );
}
