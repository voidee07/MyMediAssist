"""
MediGenius — tools/pdf_loader.py
PDF document loading and text splitting utilities.
"""

from typing import List

from langchain_core.documents import Document

from app.core.logging_config import logger


def load_pdf(pdf_path: str) -> List[Document]:
    """Load all pages from a PDF file using PyPDFLoader."""
    from langchain_community.document_loaders import PyPDFLoader

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()
    logger.info("Loaded %d pages from PDF: %s", len(docs), pdf_path)
    return docs


def split_documents(docs: List[Document]) -> List[Document]:
    """Split documents into overlapping chunks using a simple character splitter.
    This avoids heavy dependencies like sentence_transformers.
    """
    splits: List[Document] = []
    chunk_size = 512
    overlap = 128
    for doc in docs:
        text = doc.page_content
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]
            # Preserve original metadata
            splits.append(Document(page_content=chunk_text, metadata=doc.metadata))
            start += chunk_size - overlap
    logger.info("Split into %d chunks", len(splits))
    return splits


def process_pdf(pdf_path: str) -> List[Document]:
    """Load a PDF and split it into chunks. Convenience wrapper."""
    return split_documents(load_pdf(pdf_path))
