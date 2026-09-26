'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartTotalUSD, 
    cartTotalVND, 
    cartCount,
    formatPrice 
  } = useCartWishlist();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerName, setCustomerName] = useState('Alex Rivers');
  const [customerAddress, setCustomerAddress] = useState('123 K-Pop Boulevard, District 1');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'vnpay'>('card');

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-800">
                Shopping Cart
              </h2>
              <span 
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
              >
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
            {orderComplete ? (
              <div className="text-center py-12 space-y-4">
                <div 
                  className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
                  style={{ width: '56px', height: '56px', borderRadius: '50%' }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Thank you for supporting your favorite idols! Your album count has been officially reported to Hanteo and Circle Charts.
                </p>
                <div 
                  className="p-3 border text-xs"
                  style={{ backgroundColor: '#fafafa', borderColor: '#d4d4d4', color: '#1c1c1c', borderRadius: '8px' }}
                >
                  ✨ Tracking Order ID: <strong>HANTEO-2026-KR-8839</strong>
                </div>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  className="px-6 py-2 text-white text-xs font-bold cursor-pointer"
                  style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                  type="button"
                >
                  Close
                </button>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase">Đăng Ký Giữ Chỗ Showcase (Pre-Order)</h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: '#000000' }}
                  >
                    ← Quay lại danh sách
                  </button>
                </div>

                {/* Important Showcase Disclaimer Badge */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 font-medium leading-relaxed">
                  <strong className="font-bold block text-amber-950 mb-0.5">Lưu Ý Hệ Thống Showcase &amp; Lịch Phát Hành:</strong>
                  Trang web hoạt động dưới mô hình <em>Trưng bày vật phẩm Fandom &amp; Lịch phát hành</em>. <strong>Không áp dụng thanh toán giao dịch ngân hàng / thu tiền trực tuyến</strong>. Việc gửi thông tin giúp bạn giữ chỗ và nhận thông báo ưu tiên khi sản phẩm mở bán chính thức.
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tên Người Hâm Mộ (Fan Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mai Anh (Bunnies VIP)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:outline-none"
                    style={{ borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Email Nhận Thông Báo Mở Bán *</label>
                  <input
                    type="email"
                    required
                    placeholder="fan@example.com"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:outline-none"
                    style={{ borderRadius: '8px' }}
                  />
                </div>

                <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Xác nhận thông tin chính ngạch • Không thu phí</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer mt-4 hover:bg-slate-800 transition-colors"
                  style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                >
                  Xác Nhận Giữ Chỗ &amp; Nhận Thông Báo (Miễn Phí)
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-xs">Your shopping cart is empty.</p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const verObj = item.album.versions.find((v) => v.name === item.selectedVersion);
                const extra = verObj ? verObj.extraPriceUSD : 0;
                const unitPriceUSD = item.album.priceUSD + extra;
                const unitPriceVND = item.album.priceVND + extra * 25000;

                return (
                  <div key={`${item.album.id}-${item.selectedVersion}-${idx}`} className="py-4 flex gap-3">
                    <img
                      src={item.album.coverImage}
                      alt={item.album.title}
                      className="object-cover border border-slate-200 shrink-0"
                      style={{ width: '64px', height: '64px', borderRadius: '8px' }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.album.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.album.id, item.selectedVersion)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                          type="button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] font-semibold" style={{ color: '#000000' }}>{item.album.artist}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Version: <span className="font-medium text-slate-700">{item.selectedVersion}</span>
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatPrice(unitPriceUSD * item.quantity, unitPriceVND * item.quantity)}
                        </span>

                        <div className="flex items-center border border-slate-200 bg-slate-50" style={{ borderRadius: '8px' }}>
                          <button
                            onClick={() => updateQuantity(item.album.id, item.selectedVersion, -1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 transition-colors"
                            type="button"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.album.id, item.selectedVersion, 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 transition-colors"
                            type="button"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {!orderComplete && !isCheckingOut && cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(cartTotalUSD, cartTotalVND)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">Free Worldwide</span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-base" style={{ color: '#000000' }}>
                  {formatPrice(cartTotalUSD, cartTotalVND)}
                </span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full text-white text-xs py-3 mt-2 flex items-center justify-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                type="button"
              >
                <span>Đăng Ký Giữ Chỗ / Pre-Order Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
