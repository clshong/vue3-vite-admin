import type { LoginData, LoginResult } from "@/pages/login/model";
import type { ServerResult } from "#/public";
import { http } from "@/utils/request";

/**
 * 登录
 * @param data - 请求数据
 */
export function login(data: LoginData) {
  return http.post("/login", data) as Promise<ServerResult<LoginResult>>;
}

/**
 * 修改密码
 * @param data - 请求数据
 */

export function updatePassword(data: any) {
  return http.post("/update-password", data) as Promise<ServerResult>;
}
