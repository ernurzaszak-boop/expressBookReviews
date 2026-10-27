$ErrorActionPreference = 'Stop'
$base = 'http://localhost:5000'
$evidenceDirectory = Join-Path $PSScriptRoot 'evidence'
New-Item -ItemType Directory -Path $evidenceDirectory -Force | Out-Null

function Save-Evidence([string]$name, [string]$command, [string]$response) {
    $content = @(
        "cURL command:",
        $command,
        "",
        "Output:",
        $response
    ) -join "`r`n"
    Set-Content -LiteralPath (Join-Path $evidenceDirectory $name) -Value $content -Encoding utf8
}

$getAll = (& curl.exe -sS "$base/") -join "`n"
Save-Evidence 'getallbooks' 'curl -sS http://localhost:5000/' $getAll

$byISBN = (& curl.exe -sS "$base/isbn/1") -join "`n"
Save-Evidence 'getbooksbyISBN' 'curl -sS http://localhost:5000/isbn/1' $byISBN

$byAuthor = (& curl.exe -sS "$base/author/Chinua%20Achebe") -join "`n"
Save-Evidence 'getbooksbyauthor' 'curl -sS "http://localhost:5000/author/Chinua%20Achebe"' $byAuthor

$byTitle = (& curl.exe -sS "$base/title/Pride%20and%20Prejudice") -join "`n"
Save-Evidence 'getbooksbytitle' 'curl -sS "http://localhost:5000/title/Pride%20and%20Prejudice"' $byTitle

$initialReviews = (& curl.exe -sS "$base/review/1") -join "`n"
Save-Evidence 'getbookreview' 'curl -sS http://localhost:5000/review/1' $initialReviews

$username = 'skills_network_demo'
$password = 'demo-only-password'
$registerCommand = 'curl -sS -X POST http://localhost:5000/register -H "Content-Type: application/json" -d ''{"username":"skills_network_demo","password":"<TEST_PASSWORD>"}''' 
$register = (& curl.exe -sS -X POST "$base/register" -H 'Content-Type: application/json' --data-raw "{`"username`":`"$username`",`"password`":`"$password`"}") -join "`n"
Save-Evidence 'register' $registerCommand $register

$loginCommand = 'curl -sS -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d ''{"username":"skills_network_demo","password":"<TEST_PASSWORD>"}''' 
$loginResponse = ((& curl.exe -sS -X POST "$base/customer/login" -H 'Content-Type: application/json' --data-raw "{`"username`":`"$username`",`"password`":`"$password`"}") -join "`n") | ConvertFrom-Json
if (-not $loginResponse.token) { throw 'Login did not return a token.' }
$token = $loginResponse.token
Save-Evidence 'login' $loginCommand '{"message":"Login successful","token":"[redacted]"}'

$reviewBody = '{"review":"A thoughtful, well-written book."}'
$putCommand = 'curl -sS -X PUT http://localhost:5000/customer/auth/review/1 -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d ''{"review":"A thoughtful, well-written book."}''' 
$addedReview = (& curl.exe -sS -X PUT "$base/customer/auth/review/1" -H "Authorization: Bearer $token" -H 'Content-Type: application/json' --data-raw $reviewBody) -join "`n"
Save-Evidence 'reviewadded' $putCommand $addedReview

$deleteCommand = 'curl -sS -X DELETE http://localhost:5000/customer/auth/review/1 -H "Authorization: Bearer <TOKEN>"'
$deletedReview = (& curl.exe -sS -X DELETE "$base/customer/auth/review/1" -H "Authorization: Bearer $token") -join "`n"
Save-Evidence 'deletereview' $deleteCommand $deletedReview

Write-Output "Evidence saved to $evidenceDirectory"
