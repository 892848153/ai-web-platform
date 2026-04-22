export interface Demand {
  id: number;
  title: string;
  description?: string;
  requester: string;
  department?: string;
  budget: string;
  deadline: string;
  tags: string[];
  status: '招募中' | '进行中' | '已完成' | '已取消';
  applicants_count: number;
  created_at: string;
  updated_at: string;
}

export interface DemandApplication {
  id: number;
  demand_id: number;
  applicant_name: string;
  applicant_email?: string;
  proposal?: string;
  status: '待审核' | '已通过' | '已拒绝';
  created_at: string;
}

export interface CreateDemandRequest {
  title: string;
  description?: string;
  requester: string;
  department?: string;
  budget: string;
  deadline: string;
  tags?: string[];
}

export interface CreateApplicationRequest {
  demand_id: number;
  applicant_name: string;
  applicant_email?: string;
  proposal?: string;
}