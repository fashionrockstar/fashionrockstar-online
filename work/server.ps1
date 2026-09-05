$ErrorActionPreference = 'Stop'
$siteRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 4173)
$listener.Start()
Write-Output 'Serving FASHIONROCKSTAR at http://127.0.0.1:4173/'

$contentTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'
  '.jpg' = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.png' = 'image/png'
  '.svg' = 'image/svg+xml'
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $requestLine = $reader.ReadLine()
    while (($line = $reader.ReadLine()) -ne '') { if ($null -eq $line) { break } }
    $requestPath = ($requestLine -split ' ')[1]
    $requestPath = ($requestPath -split '\?')[0]
    $relative = [Uri]::UnescapeDataString($requestPath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
    $candidate = [System.IO.Path]::GetFullPath((Join-Path $siteRoot $relative))
    $status = '200 OK'
    $body = $null
    $contentType = 'text/plain; charset=utf-8'
    if (-not $candidate.StartsWith($siteRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      $status = '403 Forbidden'
      $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
    }
    if ([System.IO.Directory]::Exists($candidate)) { $candidate = Join-Path $candidate 'index.html' }
    if ($null -eq $body -and -not [System.IO.File]::Exists($candidate)) {
      $status = '404 Not Found'
      $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
    }
    if ($null -eq $body) {
      $body = [System.IO.File]::ReadAllBytes($candidate)
      $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
      $contentType = $contentTypes[$extension]
      if (-not $contentType) { $contentType = 'application/octet-stream' }
    }
    $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($body, 0, $body.Length)
    $stream.Flush()
  } catch {
    Write-Warning $_
  } finally {
    if ($reader) { $reader.Dispose() }
    if ($stream) { $stream.Dispose() }
    $client.Dispose()
  }
}
