from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, default="default")
    role = Column(String) # 'user' or 'model'
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
