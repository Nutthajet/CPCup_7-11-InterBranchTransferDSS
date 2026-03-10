import React from 'react';

interface HeaderProps {
    user: {
        name: string;
        role: string;
        initial: string;
    }
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 border-b-4 border-green-500">
          <div className="flex items-center">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/208px-7-eleven_logo.svg.png" alt="7-Eleven Logo" className="h-10" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 ml-4">
              ระบบสนับสนุนการตัดสินใจโอนย้ายสินค้าระหว่างสาขา
            </h1>
          </div>
          <div className="flex items-center">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <div className="ml-4 h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
              {user.initial}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;