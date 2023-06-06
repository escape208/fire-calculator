from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.sqltypes import TIMESTAMP, BOOLEAN
from sqlalchemy.sql.expression import text
from ..classes.DatabaseConnection import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(1500), nullable=False)
    enabled = Column(BOOLEAN, nullable=False, server_default=text('1'))
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text('Now()'))
