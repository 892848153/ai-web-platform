-- 创建工作流表
CREATE TABLE public.workflows (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'running', 'completed', 'failed')),
  current_task_index INTEGER DEFAULT 0,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 创建工作流任务表
CREATE TABLE public.workflow_tasks (
  id TEXT PRIMARY KEY,
  workflow_id TEXT REFERENCES public.workflows(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  agent_type TEXT NOT NULL CHECK (agent_type IN ('analyzer', 'executor', 'summarizer')),
  result TEXT,
  error TEXT,
  task_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 开启行级安全策略 (RLS)
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_tasks ENABLE ROW LEVEL SECURITY;

-- 允许任何人读取和写入工作流
CREATE POLICY "Allow public access for workflows" ON public.workflows
  FOR ALL USING (true);

CREATE POLICY "Allow public access for workflow_tasks" ON public.workflow_tasks
  FOR ALL USING (true);

-- 创建触发器自动更新 completed_at
CREATE OR REPLACE FUNCTION update_workflow_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = timezone('utc'::text, now());
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workflow_completion_trigger
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_workflow_completion();

-- 创建触发器自动更新任务 completed_at
CREATE OR REPLACE FUNCTION update_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status = 'completed' OR NEW.status = 'failed') AND (OLD.status = 'pending' OR OLD.status = 'processing') THEN
    NEW.completed_at = timezone('utc'::text, now());
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_completion_trigger
  BEFORE UPDATE ON public.workflow_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_task_completion();

-- 创建索引以提高查询性能
CREATE INDEX idx_workflows_created_at ON public.workflows(created_at DESC);
CREATE INDEX idx_workflow_tasks_workflow_id ON public.workflow_tasks(workflow_id);
CREATE INDEX idx_workflow_tasks_status ON public.workflow_tasks(status);