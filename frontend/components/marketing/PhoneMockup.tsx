'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Phone, 
  Video, 
  Camera, 
  Mic, 
  Image as ImageIcon, 
  Smile, 
  Send, 
  Wifi, 
  Battery, 
  CheckCheck
} from 'lucide-react';

const messages = [
  { id: 1, type: 'received', text: 'Bhai courses ka price kitna hai?', delay: 1200 },
  { id: 2, type: 'sent', text: 'Hi! Humare courses free se shuru hote hain. Growth aur Agency plans ki details ye hain:', isLinkCard: true, delay: 3000 },
  { id: 3, type: 'received', text: 'Wow, instant auto-reply aa gaya! 😍', delay: 6000 },
  { id: 4, type: 'sent', text: 'Ji haan! Ye AutoFlow ka automated Comment-to-DM response system hai ⚡ 24/7 active.', delay: 7800 },
];

export default function PhoneMockup() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [commentTriggerVisible, setCommentTriggerVisible] = useState(false);

  const startAnimation = () => {
    setVisibleMessages([]);
    setCommentTriggerVisible(false);

    // 1. Comment trigger notification appears at 400ms
    setTimeout(() => {
      setCommentTriggerVisible(true);
    }, 400);

    // 2. Chat messages load staggered
    messages.forEach((msg) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg.id]);
      }, msg.delay);
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      startAnimation();
    }, 13000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative mx-auto bg-[#090909] rounded-[48px] p-3.5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] select-none border-[1.8px] border-[rgba(255,255,255,0.12)] flex flex-col justify-between"
      style={{ width: '290px', height: '540px', overflow: 'hidden' }}
    >
      
      {/* INNER SCREEN — 100% Authentic Instagram Dark Mode DM */}
      <div className="bg-[#000000] rounded-[38px] overflow-hidden w-full h-full flex flex-col justify-between border border-[rgba(255,255,255,0.04)] relative">
        
        {/* iOS TOP STATUS BAR & DYNAMIC ISLAND */}
        <div className="bg-[#000000] h-[44px] px-5 flex flex-col justify-between shrink-0 select-none pt-1">
          {/* Status Bar Indicators */}
          <div className="flex justify-between items-center w-full text-[10px] text-white/90 font-medium">
            <span>9:41</span>
            {/* Dynamic Island Notch */}
            <div className="w-18 h-4 bg-black rounded-full border border-white/5 flex items-center justify-center shrink-0 -mt-0.5" />
            <div className="flex items-center gap-1.5 opacity-80">
              <Wifi size={10} />
              <Battery size={12} className="rotate-0" />
            </div>
          </div>
        </div>

        {/* REEL COMMENT TRIGGER BANNER */}
        <AnimatePresence>
          {commentTriggerVisible && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[44px] left-3 right-3 z-20 bg-white text-black rounded-xl p-2.5 shadow-lg flex items-center gap-2.5 border border-white/10"
            >
              <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-inner">
                R
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold leading-none mb-0.5 text-neutral-800">
                  @rahul.cooks commented
                </span>
                <span className="text-[11px] font-medium leading-none text-black">
                  "PRICE" on your Reel
                </span>
              </div>
              <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AUTHENTIC INSTAGRAM DM HEADER */}
        <div className="bg-[#000000] border-b border-[#121212] px-3.5 h-[52px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Instagram Back Arrow */}
            <ChevronLeft size={20} className="text-white cursor-pointer" />
            
            {/* Brand Avatar with Instagram Active Status Ring */}
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3797F0] to-[#9B30FF] flex items-center justify-center font-bold text-white text-[9px] uppercase shadow-md">
                AF
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#22C55E] rounded-full border border-black" />
            </div>
            
            {/* Name & Active status */}
            <div className="flex flex-col text-left">
              <span className="text-white text-[11px] font-semibold leading-none mb-0.5 tracking-wide">
                autoflow.ai
              </span>
              <span className="text-[8.5px] text-[#A0A0A0] leading-none">
                autoflow • active
              </span>
            </div>
          </div>

          {/* Action icons on right: Phone & Video Call */}
          <div className="flex items-center gap-4 text-white">
            <Phone size={16} className="cursor-pointer hover:opacity-80" />
            <Video size={17} className="cursor-pointer hover:opacity-80" />
          </div>
        </div>

        {/* MESSAGES CONVERSATION CANVAS */}
        <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3 bg-[#000000] scrollbar-none pt-4">
          {messages.map((msg) => {
            const isVisible = visibleMessages.includes(msg.id);
            if (!isVisible) return null;

            const isReceived = msg.type === 'received';
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isReceived ? 'justify-start' : 'justify-end'} animate-text-reveal`}
              >
                <div 
                  className={`max-w-[82%] px-3.5 py-2.5 text-[12px] leading-relaxed transition-all duration-200 select-text ${
                    isReceived 
                      ? 'bg-[#262626] text-white rounded-[18px] rounded-bl-[4px]' 
                      : 'bg-gradient-to-r from-[#3797F0] to-[#9B30FF] text-white font-medium rounded-[18px] rounded-br-[4px]'
                  }`}
                >
                  {msg.text}

                  {msg.isLinkCard && (
                    <div className="mt-2.5 bg-[#121212] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5 text-[10px] leading-snug text-left select-none">
                      <div className="font-semibold text-white">AutoFlow Pricing Plans</div>
                      <div className="text-[#3797F0] truncate mt-0.5 text-[9px] font-medium">autoflow.io/pricing</div>
                      <div className="text-[#606060] text-[8.5px] mt-0.5 font-light">Free plan: 500 DMs/month</div>
                    </div>
                  )}

                  {!isReceived && (
                    <div className="flex justify-end mt-1 opacity-60">
                      <CheckCheck size={10} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Bubble indicator */}
          {visibleMessages.length > 0 &&
            visibleMessages.length < messages.length &&
            visibleMessages.length % 2 === 1 && (
              <div className="flex justify-end animate-text-reveal">
                <div className="bg-gradient-to-r from-[#3797F0] to-[#9B30FF] text-white rounded-[18px] rounded-br-[4px] px-3.5 py-2.5 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* AUTHENTIC INSTAGRAM DM FOOTER & INPUT BOX */}
        <div className="bg-[#000000] h-[58px] px-3.5 flex items-center gap-3 shrink-0 pb-3">
          {/* Camera Icon on Left */}
          <div className="w-8 h-8 rounded-full bg-[#3797F0] flex items-center justify-center text-white shrink-0 cursor-pointer hover:opacity-90">
            <Camera size={14} className="fill-white stroke-none" />
          </div>

          {/* Input pill containing text and icons */}
          <div className="flex-1 bg-[#121212] border border-[#262626] rounded-full h-[36px] px-3.5 flex items-center justify-between gap-2">
            <span className="text-[#606060] text-[11px] font-normal leading-none truncate">
              Message...
            </span>
            
            {/* Instagram Input Action Icons inside the pill */}
            <div className="flex items-center gap-2.5 text-[#A0A0A0]">
              <Mic size={14} className="cursor-pointer hover:text-white" />
              <ImageIcon size={14} className="cursor-pointer hover:text-white" />
              <Smile size={14} className="cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>

        {/* iOS BOTTOM HOME BAR INDICATOR */}
        <div className="bg-[#000000] h-[8px] shrink-0 flex items-center justify-center pb-2 select-none">
          <div className="w-20 h-0.5 bg-white/20 rounded-full" />
        </div>

      </div>

    </div>
  );
}
