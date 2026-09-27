'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Trash2, Plus, Minus, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

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
  const [customerAddress, setCustomerAddress] = useState('fan@fanhubplus.com');

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div 
          style={{ borderRadius: '0px' }}
          className="w-screen max-w-md bg-[#fdfbf7] shadow-[10px_0px_0px_#000] flex flex-col justify-between border-l-4 border-black"
        >
          
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b-3 border-black flex items-center justify-between bg-[#ffd60a] select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ff2e93] border border-black" />
              <h2 className="text-sm font-black text-black uppercase tracking-wider">
                ★ FANDOM SHOWCASE BAG
              </h2>
              <span className="text-[11px] font-black px-2 py-0.5 bg-[#ff2e93] text-white border border-black shadow-[1px_1px_0px_#000]">
                {cartCount} ITEMS
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              style={{ borderRadius: '0px' }}
              className="px-2 py-0.5 bg-white text-black hover:bg-[#ff2e93] hover:text-white border-2 border-black text-xs font-black cursor-pointer shadow-[1px_1px_0px_#000] transition-colors"
              type="button"
            >
              [✕]
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto flex-1 divide-y-2 divide-black/20">
            {orderComplete ? (
              <div className="text-center py-10 space-y-4">
                <div 
                  style={{ borderRadius: '0px' }}
                  className="w-14 h-14 bg-[#ccff00] text-black border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-base font-black uppercase text-black">
                  ★ PRE-ORDER RESERVED SUCCESSFULLY! ★
                </h3>
                <p className="text-xs font-sans font-semibold text-neutral-700 leading-relaxed max-w-xs mx-auto">
                  Thank you for supporting your favorite idols! Your album count has been officially reported to Hanteo and Circle Charts.
                </p>
                <div 
                  style={{ borderRadius: '0px' }}
                  className="p-3 bg-[#ffd60a] border-2 border-black text-xs font-black text-black shadow-[3px_3px_0px_#000]"
                >
                  ⚡ TRACKING ID: <strong>HANTEO-2026-KR-8839</strong>
                </div>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsCartOpen(false);
                  }}
                  style={{ borderRadius: '0px' }}
                  className="mt-3 px-6 py-2.5 bg-[#ff2e93] text-white text-xs font-black uppercase cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#e11d48]"
                  type="button"
                >
                  [CONTINUE BROWSING]
                </button>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                  <h3 className="text-xs font-black text-black uppercase">
                    ★ SHOWCASE PRE-ORDER &amp; ALERT REGISTRATION
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs font-black text-[#ff2e93] hover:underline cursor-pointer"
                  >
                    ← BACK
                  </button>
                </div>

                {/* Important Showcase Disclaimer Badge */}
                <div 
                  style={{ borderRadius: '0px' }}
                  className="p-3 bg-[#ecfeff] border-2 border-black text-[11px] text-black font-sans font-medium leading-relaxed shadow-[2px_2px_0px_#000]"
                >
                  <strong className="font-black block uppercase font-mono text-black mb-1">
                    ⚡ SYSTEM NOTICE &amp; RELEASE SCHEDULE:
                  </strong>
                  This platform operates as an Official Fandom Showcase &amp; Drop Schedule discovery catalog. Direct monetary transactions are not processed online. Submitting your details registers an alert and reserves priority notification when official releases drop.
                </div>

                <div>
                  <label className="text-xs font-black text-black block mb-1">FAN NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex (Bunnies VIP)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-black block mb-1">NOTIFICATION EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="fan@example.com"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={{ borderRadius: '0px' }}
                    className="w-full text-xs p-2.5 bg-white border-2 border-black focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>

                <div className="pt-2 text-xs text-black font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                  <span>Verified Official Channel • No Transaction Fee</span>
                </div>

                <button
                  type="submit"
                  style={{ borderRadius: '0px' }}
                  className="w-full py-3 text-white text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] cursor-pointer mt-4 bg-[#ff2e93] hover:bg-[#e11d48] active:translate-y-0.5 border-2 border-black transition-all"
                >
                  [CONFIRM RESERVATION &amp; RECEIVE ALERTS]
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 text-neutral-500 space-y-3 font-mono">
                <div className="text-4xl">🛍️</div>
                <p className="text-xs font-bold uppercase">YOUR SHOWCASE BAG IS EMPTY.</p>
                <p className="text-[11px] text-neutral-400">Add albums or collector boxsets from the catalog above!</p>
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
                      style={{ borderRadius: '0px', width: '68px', height: '68px' }}
                      className="object-cover border-2 border-black shrink-0 shadow-[2px_2px_0px_#000]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-black text-black truncate uppercase font-sans">
                          {item.album.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.album.id, item.selectedVersion)}
                          className="text-neutral-500 hover:text-[#ff2e93] transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                          type="button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] font-bold text-black">{item.album.artist}</p>
                      <p className="text-[10px] text-neutral-600 mt-0.5">
                        VER: <span className="font-bold text-black uppercase bg-[#ffd60a] px-1 border border-black">{item.selectedVersion}</span>
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-black text-[#ff2e93]">
                          {formatPrice(unitPriceUSD * item.quantity, unitPriceVND * item.quantity)}
                        </span>

                        <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                          <button
                            onClick={() => updateQuantity(item.album.id, item.selectedVersion, -1)}
                            className="px-2 py-0.5 text-black hover:bg-[#ffd60a] transition-colors font-bold cursor-pointer"
                            type="button"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.album.id, item.selectedVersion, 1)}
                            className="px-2 py-0.5 text-black hover:bg-[#ffd60a] transition-colors font-bold cursor-pointer"
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
            <div className="p-5 border-t-3 border-black bg-white space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                <span>SUBTOTAL:</span>
                <span className="font-black text-black">
                  {formatPrice(cartTotalUSD, cartTotalVND)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                <span>DISPATCH:</span>
                <span className="font-black text-black bg-[#ccff00] px-1 border border-black">FREE WORLDWIDE</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-black pt-2 border-t-2 border-black">
                <span>TOTAL ESTIMATE:</span>
                <span className="text-base text-[#ff2e93]">
                  {formatPrice(cartTotalUSD, cartTotalVND)}
                </span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                style={{ borderRadius: '0px' }}
                className="w-full text-white text-xs py-3 mt-2 flex items-center justify-center gap-2 cursor-pointer font-black uppercase tracking-wider bg-[#ff2e93] hover:bg-[#e11d48] border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all"
                type="button"
              >
                <span>[REGISTER PRE-ORDER ALERT / RESERVE SLOT]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

