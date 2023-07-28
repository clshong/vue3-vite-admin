import type { PageServerResult, PaginationData, ServerResult } from "#/public";
import { http } from "@/utils/request";

enum API {
  URL = "/content/article",
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getArticlePage(data: Partial<unknown> & PaginationData) {
  return http.get(`${API.URL}/index`, { params: data }) as Promise<
    PageServerResult<unknown[]>
  >;
}

/**
 * 根据ID获取数据
 * @param id - ID
 */
export function getArticleById(id: string) {
  return http.get(`${API.URL}/${id}`);
}

/**
 * 新增数据
 * @param data - 请求数据
 */
export function createArticle(data: {}) {
  return http.post(API.URL, data);
}

/**
 * 修改数据
 * @param id - 修改id值
 * @param data - 请求数据
 */
export function updateArticle(id: string, data: {}) {
  return http.put(`${API.URL}/${id}`, data);
}

/**
 * 删除
 * @param id - 删除id值
 */
export function deleteArticle(id: string) {
  return http.delete(`${API.URL}/${id}`) as Promise<ServerResult>;
}
