$ErrorActionPreference = 'Stop'

$root = Resolve-Path "$PSScriptRoot\..\.."
$pagesJson = Get-Content -Raw -Encoding UTF8 "$root\src\pages.json"
$app = Get-Content -Raw -Encoding UTF8 "$root\src\App.vue"
$api = Get-Content -Raw -Encoding UTF8 "$root\src\api\wx.ts"
$pagePath = "$root\src\pages\notify\detail.vue"

function Assert-Contains($Text, $Pattern, $Message) {
  if ($Text -notmatch $Pattern) {
    throw $Message
  }
}

if (-not (Test-Path $pagePath)) {
  throw 'wx notification detail page must exist at src/pages/notify/detail.vue'
}

$page = Get-Content -Raw -Encoding UTF8 $pagePath

Assert-Contains $pagesJson 'pages/notify/detail' 'pages.json must register pages/notify/detail'
Assert-Contains $app 'pages/notify/detail' 'App H5 silent login must skip notification detail OAuth callback'
Assert-Contains $api 'getWxNotificationDetail' 'wx api must export getWxNotificationDetail'
Assert-Contains $api '/wx/mp/notification/detail' 'wx api must call backend notification detail endpoint'
Assert-Contains $page '/wx/mp/oauth/notification-authorize' 'notification detail page must start WeChat OAuth through backend authorize endpoint'
Assert-Contains $page 'getWxNotificationDetail' 'notification detail page must load detail through api wrapper'
Assert-Contains $page 'window\.location\.search' 'notification detail page must parse WeChat OAuth code from window.location.search'
Assert-Contains $page 'URLSearchParams' 'notification detail page must use URLSearchParams for OAuth callback parsing'
Assert-Contains $page 'window\.location\.hash' 'notification detail page must preserve id and redirect from hash query'
Assert-Contains $page 'previewImage' 'notification detail page must support image preview'
Assert-Contains $page 'attachments' 'notification detail page must render attachment section'
Assert-Contains $page 'redirectUrl' 'notification detail page must preserve backend jump url'

Write-Host 'wx notification detail static checks passed'
