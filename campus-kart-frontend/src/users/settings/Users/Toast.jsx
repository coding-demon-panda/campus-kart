import { useState, useEffect } from 'react';

const Toast = ({ type, message, title, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 h-[92px] p-[13px] bg-white rounded-xl shadow-[0px_4px_35px_0px_rgba(0,0,0,0.20)] flex justify-start items-center gap-5 z-50">
      <div className="h-[66px] flex items-start gap-1">
        <div className="relative">
          {type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3337 10C18.3337 5.39765 14.6027 1.66669 10.0003 1.66669C5.39795 1.66669 1.66699 5.39765 1.66699 10C1.66699 14.6024 5.39795 18.3334 10.0003 18.3334C14.6027 18.3334 18.3337 14.6024 18.3337 10Z" stroke="#6938EF" strokeWidth="1.2"/>
              <path opacity="0.4" d="M10.2015 14.1667V10C10.2015 9.60719 10.2015 9.41077 10.0794 9.28869C9.95741 9.16669 9.761 9.16669 9.36816 9.16669" stroke="#6938EF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M12.4995 12.5L7.5 7.5M7.50053 12.5L12.5 7.5" stroke="#F0272A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.3337 9.99996C18.3337 5.39758 14.6027 1.66663 10.0003 1.66663C5.39795 1.66663 1.66699 5.39758 1.66699 9.99996C1.66699 14.6023 5.39795 18.3333 10.0003 18.3333C14.6027 18.3333 18.3337 14.6023 18.3337 9.99996Z" stroke="#F0272A" strokeWidth="1.2"/>
            </svg>
          )}
        </div>
        <div className="h-[66px] flex flex-col justify-center items-start gap-[5px]">
          <div className={`text-base font-medium font-['Inter'] ${type === 'success' ? 'text-[#6938ef]' : 'text-[#f0272a]'}`}>{title}</div>
          <div className="text-[#494759] text-sm font-normal font-['Inter'] leading-[21px]">{message}</div>
        </div>
      </div>
      <button onClick={() => setVisible(false)}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M19 9L9.25 18.75" stroke="black" strokeWidth="1.21875" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 18.75L9.25 9" stroke="black" strokeWidth="1.21875" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default Toast;