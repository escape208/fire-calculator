from datetime import datetime, date
from pydantic import BaseModel
from typing import List


class QuarterlyDataBase(BaseModel):
    id: int
    symbol: str
    notes: str | None
    release_date: date | None
    created_at: datetime

    class Config:
        orm_mode = True


class QuarterlyDataOut(QuarterlyDataBase):
    pass


class QuarterlyDataCreate(BaseModel):
    symbol: str
    notes: str | None
    release_date: date | None
    created_at: datetime

    class Config:
        orm_mode = True
