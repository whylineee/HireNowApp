export type UserRole = 'worker' | 'employer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  // Поля резюме / профілю працівника
  headline?: string;
  about?: string;
  skills?: string[]; // масив навичок
  experience?: string;
  photoUri?: string;
}
