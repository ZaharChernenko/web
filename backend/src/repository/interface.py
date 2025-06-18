from abc import ABC, abstractmethod
from typing import List, Optional

from pydantic import BaseModel, Field


class TProductBaseModel(BaseModel):
    """Базовая модель товара (без ID, используется для создания/обновления)"""

    name: str = Field(..., min_length=1, max_length=100, example="Ноутбук")
    price: float = Field(..., gt=0, example=999.99)
    description: Optional[str] = Field(None, max_length=500, example="Мощный ноутбук")
    quantity: int = Field(..., ge=0, example=10)


class TProductModel(TProductBaseModel):
    id: int

    class Config:
        from_attributes = True


class IProductRepository(ABC):
    @abstractmethod
    def create(self, product: TProductBaseModel) -> TProductModel:
        raise NotImplementedError

    @abstractmethod
    def get(self, product_id: int) -> Optional[TProductModel]:
        raise NotImplementedError

    @abstractmethod
    def get_all(self) -> List[TProductModel]:
        raise NotImplementedError

    @abstractmethod
    def update(self, product_id: int, product: TProductBaseModel) -> Optional[TProductModel]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, product_id: int) -> bool:
        raise NotImplementedError
