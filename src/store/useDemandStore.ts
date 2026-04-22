import { create } from 'zustand';
import { Demand, CreateDemandRequest, DemandApplication, CreateApplicationRequest } from '../types/demands';
import { demandsApi } from '../lib/demands';

interface DemandStore {
  demands: Demand[];
  currentDemand: Demand | null;
  applications: DemandApplication[];
  loading: boolean;
  error: string | null;

  // 获取所有需求
  fetchDemands: () => Promise<void>;

  // 获取单个需求详情
  fetchDemandById: (id: number) => Promise<void>;

  // 创建新需求
  createDemand: (demandData: CreateDemandRequest) => Promise<Demand>;

  // 申请需求
  applyToDemand: (applicationData: CreateApplicationRequest) => Promise<DemandApplication>;

  // 获取需求的申请列表
  fetchApplications: (demandId: number) => Promise<void>;

  // 清除当前需求
  clearCurrentDemand: () => void;

  // 清除错误
  clearError: () => void;
}

export const useDemandStore = create<DemandStore>((set, get) => ({
  demands: [],
  currentDemand: null,
  applications: [],
  loading: false,
  error: null,

  fetchDemands: async () => {
    set({ loading: true, error: null });
    try {
      const demands = await demandsApi.getDemands();
      set({ demands, loading: false });
    } catch (error) {
      set({ error: '获取需求列表失败', loading: false });
    }
  },

  fetchDemandById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const demand = await demandsApi.getDemandById(id);
      set({ currentDemand: demand, loading: false });
    } catch (error) {
      set({ error: '获取需求详情失败', loading: false });
    }
  },

  createDemand: async (demandData: CreateDemandRequest) => {
    set({ loading: true, error: null });
    try {
      const newDemand = await demandsApi.createDemand(demandData);
      const { demands } = get();
      set({ demands: [newDemand, ...demands], loading: false });
      return newDemand;
    } catch (error) {
      set({ error: '创建需求失败', loading: false });
      throw error;
    }
  },

  applyToDemand: async (applicationData: CreateApplicationRequest) => {
    set({ loading: true, error: null });
    try {
      const newApplication = await demandsApi.applyToDemand(applicationData);
      const { applications } = get();
      set({ applications: [newApplication, ...applications], loading: false });
      return newApplication;
    } catch (error) {
      set({ error: '申请需求失败', loading: false });
      throw error;
    }
  },

  fetchApplications: async (demandId: number) => {
    set({ loading: true, error: null });
    try {
      const applications = await demandsApi.getDemandApplications(demandId);
      set({ applications, loading: false });
    } catch (error) {
      set({ error: '获取申请列表失败', loading: false });
    }
  },

  clearCurrentDemand: () => {
    set({ currentDemand: null });
  },

  clearError: () => {
    set({ error: null });
  }
}));