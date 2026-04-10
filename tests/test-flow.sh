#!/bin/bash

BACKEND_URL="http://localhost:5000"
SEARCH_URL="$BACKEND_URL/api/products/compare/search"
PRODUCT_NAME="Burger"

echo "--- Starting Compare Flow Test ---"
echo "Calling GET /api/products/compare/search for '$PRODUCT_NAME'..."

SEARCH_RESPONSE=$(curl -sG --data-urlencode "product=$PRODUCT_NAME" "$SEARCH_URL")

echo "--- Compare Response ---"
echo "$SEARCH_RESPONSE"
echo "--- End Compare Flow Test ---"
