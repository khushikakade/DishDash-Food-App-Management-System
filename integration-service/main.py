from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class CompareRequest(BaseModel):
    product_name: str


@app.post("/compare")
async def compare_prices(request: CompareRequest):
    return {
        "product": request.product_name,
        "results": [
            {
                "platform": "Zomato",
                "price": "Rs. 299",
                "status": "Mocked",
                "etaMinutes": 32,
                "redirectUrl": "https://www.zomato.com/",
            },
            {
                "platform": "Swiggy",
                "price": "Rs. 310",
                "status": "Mocked",
                "etaMinutes": 28,
                "redirectUrl": "https://www.swiggy.com/",
            },
        ],
    }
