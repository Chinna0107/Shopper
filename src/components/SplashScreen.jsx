import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logoImg from '../assets/logo.png';

export function SplashScreen({ onComplete }) {
  const container = useRef(null);
  const logo = useRef(null);
  const textRef = useRef(null);
  const glowRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Phase 1: Reveal logo with a smooth scale and fade
    tl.from(logo.current, {
      y: 40,
      scale: 0.85,
      opacity: 0,
      duration: 1.6,
      ease: 'expo.out'
    })
    // Phase 1.5: Expand the ambient glow behind the logo
    .from(glowRef.current, {
      opacity: 0,
      scale: 0.2,
      duration: 2.5,
      ease: 'power3.out'
    }, "-=1.2")
    // Phase 2: Text gently fades and slides in
    .from(textRef.current, {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, "-=1.2")
    // Hold for a moment to let the user admire the screen
    .to({}, { duration: 1.5 })
    // Phase 3: Logo and elements smoothly scale up and fade out
    .to([logo.current, glowRef.current, textRef.current], {
      scale: 1.1,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: 0.1
    })
    // Phase 4: Container fades to transparent to reveal the app
    .to(container.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, "-=0.4");
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center w-full h-full overflow-hidden"
    >
      {/* Background Ambient Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />
      
      <div className="relative flex flex-col items-center justify-center gap-6 z-10 w-full px-4">
        {/* Dynamic Center Glow */}
        <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[400px] md:h-[400px] bg-brand-navy/15 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Logo */}
        <div ref={logo} className="relative w-full max-w-[240px] md:max-w-md flex justify-center z-10">
          <img
            src={logoImg}
            alt="Swabhivar Shopper"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
        
        {/* Subtitle */}
        <div className="overflow-hidden relative z-10 mt-2">
          <div ref={textRef}>
            <p className="text-[#0b162c] text-[11px] md:text-[14px] font-extrabold tracking-[0.25em] uppercase opacity-90 text-center">
              Your Choice, <span className="text-brand-navy">From Anywhere.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
