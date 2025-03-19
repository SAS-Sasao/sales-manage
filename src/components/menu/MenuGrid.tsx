import React from 'react';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  isLogout?: boolean;
}

const MenuGrid: React.FC = () => {
  const menuItems: MenuItem[] = [
    { id: 'function-select', title: '機能選択', icon: '📋' },
    { id: 'receive-manage', title: '受注管理', icon: '📥' },
    { id: 'shipping-manage', title: '出荷管理', icon: '📤' },
    { id: 'purchase-manage', title: '請求管理', icon: '💰' },
    { id: 'inventory-manage', title: '入荷管理', icon: '📦' },
    { id: 'payment-manage', title: '支払管理', icon: '💳' },
    { id: 'master-maintenance', title: 'マスタメンテ', icon: '🔧' },
    { id: 'common-manage', title: '共通管理', icon: '🔄' },
    { id: 'sales-manage', title: '売上管理', icon: '📊' },
    { id: 'inventory-control', title: '在庫管理', icon: '📝' },
    { id: 'accounting-manage', title: '問合せ管理', icon: '❓' },
    { id: 'system-manage', title: 'システム管理', icon: '⚙️' },
    { id: 'logout', title: 'ログアウト', icon: '🚪', isLogout: true }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-4xl mx-auto">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`border rounded-md p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
            item.isLogout ? 'border-red-300' : 'border-blue-300'
          }`}
        >
          {item.isLogout ? (
            <div className="flex items-center w-full">
              <span className="mr-3 text-red-500">🚪</span>
              <span>ログアウト</span>
            </div>
          ) : (
            <div className="flex items-center w-full">
              <span className="mr-3 text-blue-500">{item.icon}</span>
              <span>{item.title}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
