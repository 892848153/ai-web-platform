import { supabase } from './supabase';
import { Demand, CreateDemandRequest, DemandApplication, CreateApplicationRequest } from '../types/demands';

export const demandsApi = {
  // 获取所有需求
  async getDemands() {
    try {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Demand[];
    } catch (error) {
      console.error('获取需求列表失败:', error);
      throw error;
    }
  },

  // 根据ID获取单个需求
  async getDemandById(id: number) {
    try {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Demand;
    } catch (error) {
      console.error('获取需求详情失败:', error);
      throw error;
    }
  },

  // 创建新需求
  async createDemand(demandData: CreateDemandRequest) {
    try {
      const { data, error } = await supabase
        .from('demands')
        .insert([{
          ...demandData,
          tags: demandData.tags || []
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Demand;
    } catch (error) {
      console.error('创建需求失败:', error);
      throw error;
    }
  },

  // 申请需求
  async applyToDemand(applicationData: CreateApplicationRequest) {
    try {
      const { data, error } = await supabase
        .from('demand_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;
      return data as DemandApplication;
    } catch (error) {
      console.error('申请需求失败:', error);
      throw error;
    }
  },

  // 获取需求的申请列表
  async getDemandApplications(demandId: number) {
    try {
      const { data, error } = await supabase
        .from('demand_applications')
        .select('*')
        .eq('demand_id', demandId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DemandApplication[];
    } catch (error) {
      console.error('获取需求申请列表失败:', error);
      throw error;
    }
  }
};