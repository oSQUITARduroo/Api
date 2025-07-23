from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from .extensions import db

retrieval_index_path = "/app/resources/chat_index"

async def build_vector_index_from_chat_history(api_key):
    docs = []
    async for chat in db.chat_sessions.find({}):
        session_id = chat.get("session_id", "unknown")
        messages = chat.get("messages", [])
        for msg in messages:
            role = msg.get("role")
            content = msg.get("content")
            if content:
                doc = Document(
                    page_content=content,
                    metadata={"session_id": session_id, "role": role}
                )
                docs.append(doc)

    embeddings = OpenAIEmbeddings(api_key=api_key)
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(retrieval_index_path)

async def update_vector_index(api_key, session_id, new_messages):
    docs = []
    for role, content in new_messages.items():
        if content:
            doc = Document(
                page_content=content,
                metadata={"session_id": session_id, "role": role}
            )
            docs.append(doc)

    if docs:
        embeddings = OpenAIEmbeddings(api_key=api_key)
        vectorstore = FAISS.load_local(
            retrieval_index_path,
            embeddings,
            allow_dangerous_deserialization=True,
        )
        vectorstore.add_documents(docs)
        vectorstore.save_local(retrieval_index_path)