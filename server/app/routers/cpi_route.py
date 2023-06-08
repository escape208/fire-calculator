from fastapi import status, HTTPException, Depends, APIRouter
from ..schemas.CPISchema import CPIOut, CPICreate
from ..models.ConsumerPriceIndex import ConsumerPriceIndex
from ..classes.DatabaseConnection import get_db
from sqlalchemy.orm import Session
from typing import List
import logging
from datetime import date, datetime

router = APIRouter(
    prefix="/cpi",
    tags=['CPI']
)


@router.get("/", response_model=List[CPIOut])
async def get_all_cpi(search: str = "", db: Session = Depends(get_db)):
    logging.debug('called')

    return db.query(ConsumerPriceIndex).all()


@router.get("/{id}", response_model=CPIOut)
async def get_cpi_by_id(id: int, db: Session = Depends(get_db)):
    logging.debug('called')
    return db.query(ConsumerPriceIndex).filter(ConsumerPriceIndex.id == id).one()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CPIOut)
async def add_cpi(data: CPICreate, db: Session = Depends(get_db)):
    logging.debug('called')

    new_entry = ConsumerPriceIndex(**dict(data))

    db.add(new_entry)
    db.commit()

    return new_entry


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_npid(id: int, db: Session = Depends(get_db)):
    logging.debug('called')

    del_query = db.query(ConsumerPriceIndex).filter(
        ConsumerPriceIndex.id == id)

    if del_query.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"ID {id} was not found")

    del_query.delete(synchronize_session=False)

    db.commit()

    return
