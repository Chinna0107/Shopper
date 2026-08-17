import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { ShieldCheck, Truck, Headphones, Package, Target, HeartHandshake } from 'lucide-react';

const values = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: 'Authenticity Guaranteed',
    desc: 'Every product is sourced directly from trusted artisans and traditional manufacturers.',
    color: 'from-brand-orange to-yellow-500'
  },
  {
    icon: <Truck className="w-8 h-8 text-white" />,
    title: 'Careful Delivery',
    desc: 'Our optimized logistics network ensures your sacred items reach you safely.',
    color: 'from-[#022A21] to-[#054335]'
  },
  {
    icon: <Headphones className="w-8 h-8 text-white" />,
    title: 'Dedicated Support',
    desc: 'Our team is always available to help you with any queries or concerns.',
    color: 'from-brand-orange to-yellow-500'
  }
];

export function AboutPage() {
  return (
    <div className="bg-[#f9f9f9] min-h-screen pb-20 md:pb-0 font-sans">
      <Header variant="back" title="About Us" />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80" 
          alt="About Us Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#022A21]/90 via-[#022A21]/70 to-transparent flex items-center">
          <div className="max-w-[1400px] w-full mx-auto px-6 md:px-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight font-serif">
                Redefining Your <br/><span className="text-brand-orange">Spiritual Journey</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium">
                Discover a world of premium traditional products and sacred essentials. Welcome to SWABHIVAR.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-16 md:py-24">
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange font-bold text-sm tracking-wider uppercase mb-2">
              <Target className="w-4 h-4" /> Our Vision
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#022A21] leading-tight tracking-tight font-serif">
              Purity & Trust <br/>at our core.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to <strong className="text-[#022A21] font-extrabold">SWABHIVAR SHOPPER</strong>. Our journey began with a simple yet powerful vision: to bridge the gap between authentic traditional products and seamless convenience.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We understand that trust is the foundation of a great spiritual experience. That's why we meticulously source our products from top artisans. Whether it's puja essentials, festive decor, or traditional wear, we ensure that every item meets the highest standards of purity.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
              <div>
                <h4 className="text-4xl font-extrabold text-brand-orange mb-2">100k+</h4>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Happy Devotees</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-brand-orange mb-2">1,000+</h4>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sacred Items</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-white rounded-3xl overflow-hidden shadow-xl h-[400px] lg:h-[600px] p-3 border border-gray-100"
          >
            <div className="w-full h-full relative rounded-2xl overflow-hidden border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1604928148962-e64e5317b2b8?w=800&q=80" 
                alt="Our Story" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022A21] via-[#022A21]/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <HeartHandshake className="w-12 h-12 mb-4 text-brand-orange" />
                <h3 className="text-2xl font-bold mb-2 font-serif">Built for you</h3>
                <p className="text-gray-200">We are not just selling products; we are building lasting spiritual connections.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Our Core Values */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#022A21] mb-4 font-serif">The SWABHIVAR Promise</h2>
          <p className="text-lg text-gray-600">We hold ourselves to the highest standards of purity to ensure your complete satisfaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-brand-orange hover:shadow-xl shadow-md transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${val.color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-[#022A21] mb-3 font-serif">{val.title}</h3>
              <p className="text-gray-600 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
