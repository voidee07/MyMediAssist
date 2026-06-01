"""
MediGenius — agents/evaluation.py
EvaluationAgent: evaluates the relevance of retrieved context documents.
"""

from app.core.logging_config import logger
from app.core.state import AgentState
from app.tools.llm_client import get_llm


def EvaluationAgent(state: AgentState) -> AgentState:
    """Evaluate the relevance of retrieved documents for answering the patient's question."""
    llm = get_llm()
    question = state.get("question", "")
    docs = state.get("documents", [])

    if not llm:
        logger.warning("Evaluation Agent: LLM client not initialized.")
        state["evaluation_success"] = False
        return state

    if not docs:
        logger.info("Evaluation Agent: No documents found to evaluate.")
        state["evaluation_success"] = False
        return state

    # Compile the content of the top documents
    context = "\n\n".join(
        [f"Doc {i+1}:\n{doc.page_content[:500]}" for i, doc in enumerate(docs[:3])]
    )

    prompt = (
        "You are an expert medical consultation evaluator.\n"
        "Analyze whether the retrieved medical literature context contains information "
        "relevant to answering the patient's question. Your response must be objective.\n\n"
        f"Patient Question: {question}\n\n"
        f"Retrieved Medical Context:\n{context}\n\n"
        "Does the retrieved context contain any details relevant to the question? "
        "Answer strictly in the following format:\n"
        "RELEVANT: Yes/No\n"
        "Reasoning: <one short sentence explaining why>"
    )

    try:
        response = llm.invoke(prompt)
        content = (
            response.content.strip()
            if hasattr(response, "content")
            else str(response).strip()
        )
        logger.info("Evaluation Agent feedback:\n%s", content)
        
        # Check if the evaluation deemed the content relevant
        is_relevant = "RELEVANT: Yes" in content or "yes" in content.split("\n")[0].lower()
        state["evaluation_success"] = is_relevant
    except Exception as e:
        logger.error("Evaluation Agent failed: %s", str(e))
        state["evaluation_success"] = True  # Fallback to true to assume success in MVP pipeline

    return state
