from datetime import date, datetime
from pydantic import BaseModel
from ..schemas.UTANSchemas import UTANOut
from ..schemas.ConfigurationItemSchemas import ConfigurationItemOut
from ..schemas.CategoriesSchemas import CategoryOut
from typing import List


class NPIDBase(BaseModel):
    name: str
    description: str

    class Config:
        orm_mode = True


class NPIDCreate(NPIDBase):
    owning_utan: int
    platform_id: int
    category_ids: List[int]
    created_at: date = None

    class Config:
        orm_mode = True


class NPIDUpdate(NPIDBase):
    owning_utan: int
    platform_id: int
    category_ids: List[int]
    created_at: date = None

    class Config:
        orm_mode = True


class NPIDOut(NPIDBase):
    id: int
    owning_utan_details: UTANOut
    platform_details: ConfigurationItemOut
    category_details: List[CategoryOut]
    created_at: date
    added_to_database_at: datetime
    updated_at: datetime = None

    class Config:
        orm_mode = True
