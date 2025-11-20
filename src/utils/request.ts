export interface ApiResponse<T = any> {
  code?: number
  data?: T
  msg?: string
}

async function parseJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  const res = await fetch(`/api${path}`, { ...options, headers })
  const body = await parseJson(res)

  if (!res.ok) {
    const message = (body && (body.msg || body.message)) || `请求失败（${res.status}）`
    throw new Error(message)
  }

  // 某些接口以 { code, data, msg } 作为规范
  if (body && typeof body === 'object' && 'code' in body) {
    const api = body as ApiResponse<T>
    if (api.code !== 200) {
      throw new Error(api.msg || '请求失败')
    }
    return api.data as T
  }

  // 其他情况直接返回解析后的 body
  return body as T
}

export function apiGet<T = any>(path: string) {
  return apiRequest<T>(path, { method: 'GET' })
}

export function apiPost<T = any>(path: string, data: any) {
  return apiRequest<T>(path, { method: 'POST', body: JSON.stringify(data) })
}