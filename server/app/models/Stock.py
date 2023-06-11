from sqlalchemy import Column, Integer, String, Double
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from ..classes.DatabaseConnection import Base


class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer,
                primary_key=True,
                autoincrement=True,
                nullable=False)
    symbol = Column(String(6),
                    nullable=False,
                    unique=True)
    name = Column(String(200),
                  nullable=True,
                  unique=True)
    description = Column(String(500),
                         nullable=True,
                         unique=True)
    sector = Column(String(100),
                    nullable=True,
                    unique=True)
    last_price = Column(Double, nullable=True)
    last_price_retrieved = Column(TIMESTAMP(timezone=True),
                                  nullable=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False,
                        server_default=text('Now()'))
