$ErrorActionPreference = 'Stop'
$page = Get-Content -Raw -Encoding UTF8 "$PSScriptRoot\..\..\src\pages\wx-bind\index.vue"
$app = Get-Content -Raw -Encoding UTF8 "$PSScriptRoot\..\..\src\App.vue"

function Assert-Contains($text, $pattern, $message) {
    if ($text -notmatch $pattern) {
        throw $message
    }
}

Assert-Contains $page 'window\.location\.search' 'wx-bind page must parse WeChat OAuth code from window.location.search'
Assert-Contains $page 'URLSearchParams' 'wx-bind page must use URLSearchParams for callback parsing'
Assert-Contains $page 'state' 'wx-bind page must use OAuth state as token fallback'
Assert-Contains $page 'expired' 'wx-bind page must render expired QR error from backend redirect'
Assert-Contains $app 'wx-bind' 'App H5 silent login must skip the wx-bind callback route'
