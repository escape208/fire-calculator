from sqlalchemy import Column, Integer, ForeignKey, Double
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from ..classes.DatabaseConnection import Base


class DividendHistory(Base):
    __tablename__ = "dividendhistory"

    id = Column(Integer,
                primary_key=True,
                autoincrement=True,
                nullable=False)
    stock_id = Column(Integer, ForeignKey("stock.id"),
                      nullable=False)
    amount_paid = Column(Double, nullable=False)
    pay_date = Column(TIMESTAMP(timezone=True),
                      nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False,
                        server_default=text('Now()'))
