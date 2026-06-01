"""
MediGenius — agents/memory.py
MemoryAgent: trims conversation history to the last 20 turns.
"""

from app.core.logging_config import logger
from app.core.state import AgentState
from app.services.database_service import db_service


def MemoryAgent(state: AgentState) -> AgentState:
    """Trim conversation history to the last 20 turns to avoid context overflow, and save response to SQLite."""
    history = state.get("conversation_history", [])
    if len(history) > 20:
        history = history[-20:]
    state["conversation_history"] = history

    session_id = state.get("session_id")
    generation = state.get("generation")
    source = state.get("source", "Unknown")

    if session_id and generation:
        db_service.save_message(session_id, "assistant", generation, source)
        logger.info("Memory Agent: Persisted assistant response to database for session %s", session_id[:8])
    else:
        logger.warning("Memory Agent: Missing session_id or generation. Database persistence skipped.")

    return state
