import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

interface MasterMenuItem {
  id: string;
  title: string;
  icon: string;
  path: string;
}

const MasterMenu: React.FC = () => {
  const masterMenuItems: MasterMenuItem[] = [
    { id: 'staff', title: '担当者マスタ', icon: '👤', path: '/master/staff' },
    { id: 'location', title: '拠点マスタ', icon: '🏢', path: '/master/location' },
    { id: 'tax', title: '税率マスタ', icon: '💹', path: '/master/tax' },
    { id: 'product', title: '商品マスタ', icon: '📦', path: '/master/product' },
    { id: 'supplier', title: '仕入先マスタ', icon: '🏭', path: '/master/supplier' },
    { id: 'customer', title: '得意先マスタ', icon: '🏪', path: '/master/customer' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header parentPage="マスタメンテ" />
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto py-4">
          <div className="grid grid-cols-2 gap-4 p-4 max-w-4xl mx-auto">
            {masterMenuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="border border-blue-300 rounded-md p-4 flex items-center cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center w-full">
                  <span className="mr-3 text-blue-500">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MasterMenu;
