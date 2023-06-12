from sqlalchemy import Column, Integer, ForeignKey, String, Double
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from ..classes.DatabaseConnection import Base


class QuarterlyData(Base):
    __tablename__ = "quarterlydata"

    id = Column(Integer,
                primary_key=True,
                autoincrement=True,
                nullable=False)
    notes = Column(String(1000),
                   nullable=True)
    stock_id = Column(Integer,
                      ForeignKey("stock.id"),
                      nullable=False)
    eps = Column(Double,
                 nullable=True)
    release_date = Column(TIMESTAMP(timezone=True),
                          nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False,
                        server_default=text('Now()'))
