import type { ServerResult } from "#/public";
import { http } from "@/utils/request";

enum API {
  URL = "/platform/partner",
}

interface ResultData {
  id: string;
  name: string;
}

/**
 * 获取公司数据
 * @param data - 请求数据
 */
export function getPartner(data?: unknown) {
  return http.get(`${API.URL}`, { params: data }) as Promise<
    ServerResult<ResultData[]>
  >;
}
