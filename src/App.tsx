import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import ToolsSquare from "@/pages/Tools";
import QAAssistant from "@/pages/QA";
import BestPractices from "@/pages/BestPractices";
import LearningCenter from "@/pages/Learning";
import RewardsSquare from "@/pages/Rewards";
import DemandDetails from "@/pages/Rewards/Details";
import AgentWorkflow from "@/pages/AgentWorkflow";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<ToolsSquare />} />
          <Route path="/qa" element={<QAAssistant />} />
          <Route path="/practices" element={<BestPractices />} />
          <Route path="/learning" element={<LearningCenter />} />
          <Route path="/rewards" element={<RewardsSquare />} />
          <Route path="/rewards/:id" element={<DemandDetails />} />
          <Route path="/workflow" element={<AgentWorkflow />} />
        </Route>
      </Routes>
    </Router>
  );
}
