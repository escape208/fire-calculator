from fastapi import status, HTTPException, Depends, APIRouter
from ..schemas.NPIDSchemas import NPIDCreate, NPIDOut, NPIDUpdate
from ..models.NPIDModels import NPID
from ..models.UTANModels import UTAN
from ..models.ConfigurationItemModels import ConfigurationItem
from ..models.CategoryMapModels import CategoryMap
from ..models.CategoryModels import Category
from ..classes.DatabaseConnection import get_db
from sqlalchemy.orm import Session
from typing import List
import logging
from datetime import date, datetime

router = APIRouter(
    prefix="/npids",
    tags=['NPID']
)


@router.get("/", response_model=List[NPIDOut])
async def get_all_npids(search: str = "", db: Session = Depends(get_db)):
    logging.debug('called')

    results = None

    if len(search) > 0:
        logging.debug(f"search filter = '{search}'")
        results = db.query(NPID).filter(
            NPID.name.like('%' + search + '%')).all()
    else:
        logging.debug("No search criteria specified, getting all npids..")
        results = db.query(NPID).all()
        logging.debug("Search for all completed...")

    formatted_results = []

    for result in results:
        formatted_results.append(get_npid_common(result, db))

    return formatted_results


def get_npid_common(npid_result, db: Session = Depends(get_db)):
    logging.debug("called")

    npids_category_list = db.query(CategoryMap).filter(
        CategoryMap.npid_id == npid_result.id).all()

    result_temp = npid_result

    if not npid_result:
        logging.debug("npid_result was empty. Returning...")
        return

    result_temp.owning_utan_details = db.query(UTAN).filter(
        UTAN.id == result_temp.owning_utan).one()
    result_temp.platform_details = db.query(ConfigurationItem).filter(
        ConfigurationItem.id == result_temp.platform_id).one()
    result_temp.category_details = []
    for category in npids_category_list:
        category_details = db.query(Category).filter(
            Category.id == category.category_id).one()
        result_temp.category_details.append(category_details)

    return result_temp


@router.get("/{id}", response_model=NPIDOut)
async def get_npid_by_id(id: int, db: Session = Depends(get_db)):
    logging.debug('called')
    results = db.query(NPID).filter(NPID.id == id).one()

    formatted_results = get_npid_common(results, db)

    return formatted_results


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=NPIDOut)
async def add_npid(data: NPIDCreate, db: Session = Depends(get_db)):
    logging.debug('called')

    myDate = date.today()

    if data.created_at:
        myDate = data.created_at

    new_entry = NPID(name=data.name,
                     description=data.description,
                     owning_utan=data.owning_utan,
                     platform_id=data.platform_id,
                     created_at=myDate)

    db.add(new_entry)
    db.commit()

    # Add categories
    for category_id in data.category_ids:
        category = CategoryMap(npid_id=new_entry.id, category_id=category_id)
        db.add(category)
        db.commit()

    formatted_response = get_npid_common(new_entry, db)

    return formatted_response


@router.put("/{id}", status_code=status.HTTP_200_OK, response_model=NPIDOut)
async def update_npid(id: int, dataToUpdate: NPIDUpdate, db: Session = Depends(get_db)):
    logging.debug('called')

    existing_entry = db.query(NPID).filter(
        NPID.id == id).one()

    mydict = dataToUpdate.dict()

    for key, value in mydict.items():
        setattr(existing_entry, key, value)

    # Set the update timestamp
    setattr(existing_entry, "updated_at", datetime.today())

    db.commit()

    # update category map
    current_npid_category_map = db.query(
        CategoryMap).filter(CategoryMap.npid_id == id).all()

    # Find maps not present, and add them.
    for new_category_id in dataToUpdate.category_ids:
        if any(obj.category_id == new_category_id for obj in current_npid_category_map):
            pass
        else:
            new_entry = CategoryMap(npid_id=id,
                                    category_id=new_category_id)
            db.add(new_entry)
            db.commit()

    # any maps not in the new data, remove them
    for current_map in current_npid_category_map:
        if current_map.category_id not in dataToUpdate.category_ids:
            db.delete(current_map)
            db.commit()

    result = get_npid_common(existing_entry, db)

    return result


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_npid(id: int, db: Session = Depends(get_db)):
    logging.debug('called')

    del_query = db.query(NPID).filter(NPID.id == id)

    if del_query.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"ID {id} was not found")

    del_query.delete(synchronize_session=False)

    db.commit()

    return
