# --- Configuration ---
$BACKEND_URL = "http://localhost:5000"
$SEARCH_URL = "$BACKEND_URL/api/products/compare/search"
$PRODUCT_NAME = "Burger"

Write-Host "--- Starting Compare Flow Test ---"
Write-Host "Calling GET /api/products/compare/search for '$PRODUCT_NAME'..."

try {
    $SEARCH_RESPONSE = Invoke-RestMethod -Uri "$SEARCH_URL?product=$([System.Uri]::EscapeDataString($PRODUCT_NAME))" -Method Get -ErrorAction Stop
} catch {
    Write-Host "ERROR: Failed to connect to compare endpoint or received an error response."
    Write-Host "Error details: $($_.Exception.Message)"
    exit 1
}

Write-Host "--- Compare Response ---"
Write-Host "$($SEARCH_RESPONSE | ConvertTo-Json -Depth 100)"
Write-Host "--- End Compare Flow Test ---"
