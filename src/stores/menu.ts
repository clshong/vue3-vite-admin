import type { SideMenu } from '#/public';
import { defineStore } from 'pinia';

// 菜单项
export interface MenuItem {
  key: string;
  path: string;
  top: string;
  topTitle: string;
  title: string;
  rule?: string;
  icon?: string;
}

interface StateData {
  isPhone: boolean;
  firstMenu: MenuItem;
  openKeys: string[];
  selectedKeys: string[];
  menuList: SideMenu[],
}

export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    isPhone: false,
    firstMenu: {
      key: '',
      path: '',
      top: '',
      topTitle: '',
      rule: '',
      title: ''
    },
    openKeys: [],
    selectedKeys: [],
    menuList: []
  } as StateData),
  actions: {
    /**
     * 设置菜单
     * @param menus - 菜单值
     */
    setMenus(menus: SideMenu[]) {
      this.menuList = menus;
    },
    /**
     * 设置是否是手机
     * @param isPhone - 是否是手机打开
     */
    setPhone(isPhone: boolean) {
      this.isPhone = isPhone;
    },
    /**
     * 设置展开值
     * @param arr - 展开值
     */
     setOpenKeys(arr: string[]) {
      this.openKeys = arr;
    },
    /**
     * 设置选中的值
     * @param arr - 选中的值
     */
     setSelectedKeys(arr: string[]) {
      this.selectedKeys = arr;
    },
    /**
     * 设置第一个菜单
     * @param obj - 菜单值
     */
    setFirstMenu(obj: MenuItem) {
      this.firstMenu = obj;
    }
  }
});