from typing import List, Optional

from fastapi import HTTPException, status

from src.repository.interface import (
    IProductRepository,
    TProductBaseModel,
    TProductModel,
)


class TProductHandlers:
    def __init__(self, repository: IProductRepository):
        self._repository = repository

    def create_product(self, product: TProductBaseModel) -> TProductModel:
        return self._repository.create(product)

    def get_product(self, product_id: int) -> Optional[TProductModel]:
        product = self._repository.get(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product

    def get_all_products(self) -> List[TProductModel]:
        return self._repository.get_all()

    def update_product(self, product_id: int, product: TProductBaseModel) -> Optional[TProductModel]:
        updated = self._repository.update(product_id, product)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return updated

    def delete_product(self, product_id: int):
        if not self._repository.delete(product_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return {"message": "Product deleted"}
