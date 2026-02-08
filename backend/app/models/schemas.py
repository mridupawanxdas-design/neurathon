from pydantic import BaseModel, Field

class RecordCreate(BaseModel):
    category: str = Field(..., min_length=2)
    customer_name: str = Field(..., min_length=2)
    base_amount: float = Field(..., ge=0)
    tax_amount: float = Field(..., ge=0)
    notes: str = ""
