import type { LoginResult } from "@/pages/login/model";
import type { ServerResult } from "#/public";
import { http } from "@/utils/request";

/**
 * 权限
 * @param data - 请求数据
 */
export function getPermissions(data: unknown) {
  return http.get("/authority/user/refresh-permissions", {
    params: data,
  }) as Promise<ServerResult<LoginResult>>;
}
