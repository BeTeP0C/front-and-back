import apiClient from './client';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  created_at: string;
}

export const adminApi = {
  async getUsers(): Promise<AdminUser[]> {
    const { data } = await apiClient.get<AdminUser[]>('/admin/users');
    return data;
  },

  async updateRole(
    id: string,
    role: 'user' | 'admin',
  ): Promise<AdminUser> {
    const { data } = await apiClient.patch<AdminUser>(
      `/admin/users/${id}/role`,
      { role },
    );
    return data;
  },
};
