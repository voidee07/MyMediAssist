"""
MediGenius — core/langgraph_workflow.py
LangGraph StateGraph definition and workflow factory for linear execution.
"""

# pyrefly: ignore [missing-import]
from langgraph.graph import END, StateGraph

from app.agents.executor import ExecutorAgent
from app.agents.explanation import ExplanationAgent
from app.agents.memory import MemoryAgent
from app.agents.planner import PlannerAgent
from app.agents.retriever import RetrieverAgent
from app.agents.evaluation import EvaluationAgent
from app.core.state import AgentState


def create_workflow():
    """Build and compile the linear LangGraph agentic workflow."""
    workflow = StateGraph(AgentState)

    # Register nodes
    workflow.add_node("planner", PlannerAgent)
    workflow.add_node("retriever", RetrieverAgent)
    workflow.add_node("evaluation", EvaluationAgent)
    workflow.add_node("explanation", ExplanationAgent)
    workflow.add_node("executor", ExecutorAgent)
    workflow.add_node("memory", MemoryAgent)

    # Entry point
    workflow.set_entry_point("planner")

    # Edges
    workflow.add_edge("planner", "retriever")
    workflow.add_edge("retriever", "evaluation")
    workflow.add_edge("evaluation", "explanation")
    workflow.add_edge("explanation", "executor")
    workflow.add_edge("executor", "memory")
    workflow.add_edge("memory", END)

    return workflow.compile()
