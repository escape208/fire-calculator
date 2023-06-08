from sqlalchemy import Column, Integer, String, Double
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from ..classes.DatabaseConnection import Base


class ConsumerPriceIndex(Base):
    __tablename__ = "consumerpriceindex"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    year = Column(Integer, nullable=False, unique=True)
    percent_change = Column(Double, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text('Now()'))
