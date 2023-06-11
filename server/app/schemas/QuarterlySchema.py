from datetime import datetime, date
from pydantic import BaseModel
from typing import List


class QuarterlyDataBase(BaseModel):
    id: int
    symbol: str
    name: str | None
    description: str | None
    sector: str | None
    last_price: float | None
    last_price_retrieved: date | None
    created_at: datetime

    class Config:
        orm_mode = True


class QuarterlyDataOut(QuarterlyDataBase):
    pass


class QuarterlyDataCreate(BaseModel):
    symbol: str

    class Config:
        orm_mode = True
