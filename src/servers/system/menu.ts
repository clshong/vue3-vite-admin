import { FormData } from "#/form";
import type { PageServerResult, PaginationData, ServerResult } from "#/public";
import { http } from "@/utils/request";

enum API {
  URL = "/authority/menu",
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getSystemMenuPage(data: Partial<unknown> & PaginationData) {
  return http.get(`${API.URL}/index`, { params: data }) as Promise<
    PageServerResult<unknown[]>
  >;
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getSystemMenuById(id: string) {
  return http.get(`${API.URL}/${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createSystemMenu(data: FormData) {
  return http.post(API.URL, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateSystemMenu(id: string, data: object | undefined) {
  return http.put(`${API.URL}/${id}`, data);
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteSystemMenu(id: string) {
  return http.delete(`${API.URL}/${id}`);
}

/**
 * 获取权限列表
 * @param data - 搜索数据
 */
export function getPermission(data: unknown) {
  return http.get(`${API.URL}/tree`, { params: data });
}

/**
 * 保存权限列表
 * @param data - 权限数据
 */
export function savePermission(data: object | undefined) {
  return http.put(`${API.URL}/authorize/save`, data) as Promise<ServerResult>;
}
