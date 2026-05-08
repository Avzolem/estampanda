"use client";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url).then(async (r) => {
    if (!r.ok) throw new Error("Cart fetch failed");
    return r.json();
  });

export function useCart() {
  const { data, mutate, isLoading, error } = useSWR("/api/cart", fetcher, {
    revalidateOnFocus: true,
  });

  const cart = data?.cart;
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;

  const addItem = async (item) => {
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Add failed");
    mutate();
  };

  const updateItem = async (itemId, patch) => {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Update failed");
    mutate();
  };

  const removeItem = async (itemId) => {
    const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error || "Remove failed");
    mutate();
  };

  return { cart, items, subtotal, isLoading, error, addItem, updateItem, removeItem, mutate };
}
