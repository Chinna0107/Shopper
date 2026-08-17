import React from 'react';
import { Header } from '../components/Header';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export function ShippingPolicyPage() {
  return (
    <div className="bg-[#f9f9f9] min-h-screen pb-24 md:pb-16 font-sans">
      <Header title="Shipping Policy" />
      
      {/* Top Banner */}
      <div className="bg-[#022A21] text-white py-10 md:py-14 px-4 shadow-md">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif">Shipping Policy</h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
            Everything you need to know about how we deliver your orders safely and on time.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 space-y-8">
          
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-bold text-[#022A21] font-serif">Processing Time</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. 
              In the event of a high volume of orders, processing times may be slightly delayed. Please allow additional days in transit for delivery.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-bold text-[#022A21] font-serif">Shipping Rates & Estimates</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Shipping charges for your order will be calculated and displayed at checkout. We offer the following shipping options within India:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li><strong className="text-gray-800">Standard Shipping:</strong> 5-7 business days (Free for orders over ₹999)</li>
              <li><strong className="text-gray-800">Express Shipping:</strong> 2-3 business days (Flat rate of ₹149)</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-bold text-[#022A21] font-serif">Order Tracking</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.
              You can also track your order directly from your <a href="/my-orders" className="text-brand-orange font-semibold hover:underline">My Orders</a> dashboard.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-brand-orange" />
              <h2 className="text-xl font-bold text-[#022A21] font-serif">Damages</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              SWABHIVAR SHOPPER takes utmost care with packaging but is not directly liable for products damaged or lost during shipping. If you received your order damaged, please contact our support team immediately so we can assist you with a replacement or claim.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
