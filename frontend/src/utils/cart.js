const CART_STORAGE_KEY = 'cart';

const readCart = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeCart = (items) => {
  if (typeof window === 'undefined') {
    return items;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cartUpdated'));

  return items;
};

const normalizeProduct = (product) => {
  const attributes = product?.attributes ?? product ?? {};

  return {
    id: product?.id ?? attributes.id,
    name: attributes.name ?? product?.name ?? '',
    price: Number(attributes.price ?? product?.price ?? 0),
    image: attributes.image ?? product?.image ?? '',
    category: attributes.category ?? product?.category ?? '',
    description: attributes.description ?? product?.description ?? '',
    qty: Number(product?.qty ?? 1),
    seller: attributes.seller ?? product?.seller ?? 'Unknown seller',
    stock: Number(attributes.stock ?? product?.stock ?? 0),
  };
};

export const getCartItems = () => readCart();

export const getCartCount = () => readCart().reduce((total, item) => total + Number(item.qty || 0), 0);

export const addToCart = (product, quantity = 1) => {
  const nextItem = normalizeProduct(product);
  nextItem.qty = Number(quantity) || 1;
  
  // Guarantee an ID exists
  if (nextItem.id === undefined || nextItem.id === null) {
    nextItem.id = Date.now().toString();
  }

  const currentCart = readCart();
  const existingItems = currentCart.filter((item) => String(item.id) === String(nextItem.id));
  const otherItems = currentCart.filter((item) => String(item.id) !== String(nextItem.id));

  if (existingItems.length > 0) {
    const totalQty = existingItems.reduce((sum, item) => sum + (Number(item.qty) || 1), 0) + nextItem.qty;
    const combinedItem = { ...existingItems[0], qty: totalQty };
    return writeCart([...otherItems, combinedItem]);
  }

  return writeCart([...currentCart, nextItem]);
};

export const updateCartItemQuantity = (productId, qty) => {
  const nextQty = Number(qty);
  const currentCart = readCart();
  const nextCart = currentCart
    .map((item) => (String(item.id) === String(productId) ? { ...item, qty: Number.isFinite(nextQty) && nextQty > 0 ? nextQty : 1 } : item))
    .filter((item) => Number(item.qty) > 0);

  return writeCart(nextCart);
};

export const removeFromCart = (productId) => {
  const nextCart = readCart().filter((item) => String(item.id) !== String(productId));
  return writeCart(nextCart);
};

export const clearCart = () => writeCart([]);
