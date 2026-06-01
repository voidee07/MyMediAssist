import sqlite3, json, os

db_path = r"C:/Users/skris/Desktop/dev/MYMediGenius/backend/storage/chat_db/medigenius.db"
if not os.path.isfile(db_path):
    print('Database file not found at', db_path)
    exit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
print('Tables:', cur.fetchall())
# Check recent messages if table exists
cur.execute("SELECT * FROM messages ORDER BY id DESC LIMIT 5;")
rows = cur.fetchall()
print('Recent messages:', rows)
conn.close()
