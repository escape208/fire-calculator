from datetime import datetime
from pydantic import BaseModel
from typing import List


class CPIBase(BaseModel):
    id: int
    year: int
    percent_change: float

    class Config:
        orm_mode = True


class CPIOut(CPIBase):
    pass


class CPICreate(BaseModel):
    year: int
    percent_change: float

    class Config:
        orm_mode = True
