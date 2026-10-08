export interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  student_id: string;
  class: string;
  major: string;
  avatar?: string;
  github_url?: string;
  figma_url?: string;
  postman_url?: string;
  pdf_report_url?: string;
}
