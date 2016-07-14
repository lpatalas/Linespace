################################
# MISC

function Write-Header($text) {
	Write-Host
	Write-Host $text -ForegroundColor Blue
}

function Join-Hashtable([Hashtable] $table) {
	return ($table.Keys | %{ $_ + '=' + $table.Item($_) }) -join ','
}

function Read-IniFile($path) {
	if (-not (Test-Path $path)) {
		throw "Can't find configuration file '$path'"
	}

	$data = @{}

	Get-Content $path | %{
		$isMatch = $_ -match '^\s*([^#][^\s]+)\s*=\s*(.+)$'
		if ($isMatch) {
			$data.Add($matches[1], $matches[2])
		}
	}

	return $data
}

function Find-ExecutablePath {
	foreach ($path in $args) {
		$command = Get-Command $path -ErrorAction SilentlyContinue
		if ($command) {
			return $command.Source
		}
	}

	throw "Can't find required executable in any of paths: $args"
}

function Get-FullPath {
	param(
		[Parameter(Position = 0, Mandatory = $true)]
		[String] $InputPath,

		[Parameter(Position = 1)]
		[String] $ParentPath = (pwd).Path
	)

	if (-not [IO.Path]::IsPathRooted($InputPath)) {
		$ParentPath = Get-FullPath $ParentPath
		$fullPath = Join-Path $ParentPath $InputPath
		return [IO.Path]::GetFullPath($fullPath)
	}
	else {
		return [IO.Path]::GetFullPath($InputPath)
	}
}

function Get-RelativePath {
	param(
		[Parameter(Position = 0, Mandatory = $true)]
		[String] $InputPath,

		[Parameter(Position = 1, Mandatory = $true)]
		[String] $ParentPath
	)

	$fullInputPath = Get-FullPath $InputPath
	$fullParentPath = Get-FullPath $ParentPath

	if ($fullInputPath.StartsWith($fullParentPath)) {
		return $fullInputPath.Substring($fullParentPath.Length + 1)
	}
	else {
		return $fullInputPath
	}
}


################################
# MS BUILD

$MsBuildExe = Find-ExecutablePath 'msbuild.exe' 'C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe'

function Invoke-MSBuild {
	param(
		[Parameter(Position = 0, Mandatory = $true)] $ProjectPath,
		$Configuration = 'Debug',
		$Platform = 'AnyCPU'
	)

	Write-Header "Building $ProjectPath ($Configuration|$Platform)"

	$MsBuildProperties = @(
		"Configuration=$Configuration"
		"Platform=$Platform"
		"VisualStudioVersion=14.0"
	) -join ';'

	& $MsBuildExe /property:$MsBuildProperties /verbosity:minimal /nologo $ProjectPath
	if ($LASTEXITCODE -ne 0) {
		throw "Build of '$ProjectPath' failed"
	}
}


################################
# PUBLISHING

function Publish-Files {
	param(
		[Parameter(Position = 0, Mandatory = $true)]
		[String[]] $InputPatterns,

		[Parameter(Position = 1, Mandatory = $true)]
		[String] $PublishDir,

		[String] $WorkingDir = (pwd).Path
	)

	Write-Header "Publishing files from '$WorkingDir' to '$PublishDir'"

	$WorkingDir = Get-FullPath $WorkingDir

	function GetReferencedResources($parentPath) {
		$basePath = [IO.Path]::GetDirectoryName($parentPath)
		$patterns = @(
			'<script src="([^`"]+)"'
			'<link href="([^`"]+)"'
		)

		$references = @()

		foreach ($pattern in $patterns) {
			$references += Select-String $pattern $parentPath -AllMatches `
				| %{ Get-FullPath $_.matches.Groups[1].Value $basePath }
		}

		return $references
	}
	
	function GetPublishedFiles($inputPatterns) {
		$publishedFiles = @()

		foreach ($pattern in $InputPatterns) {
			$items = Get-ChildItem $pattern | % FullName
			foreach ($item in $items) {
				$publishedFiles += @( $item )
				if ($item -like '*.htm?') {
					$publishedFiles += @( GetReferencedResources $item )
				}
			}
		}

		return $publishedFiles
	}

	$outputs = GetPublishedFiles $InputPatterns | Sort-Object | Get-Unique

	foreach ($path in $outputs) {
		if (-not (Test-Path (Get-FullPath $path))) {
			throw "Referenced file '$path' does not exist"
		}
	}

	$fullPublishDir = Get-FullPath $PublishDir $WorkingDir

	if (Test-Path $fullPublishDir) {
		Remove-Item $fullPublishDir -Force -Recurse
	}

	foreach ($sourcePath in $outputs) {
		$relativeSourcePath = Get-RelativePath $sourcePath $WorkingDir
		$targetPath = Get-FullPath $relativeSourcePath $fullPublishDir
		$targetDir = Split-Path $targetPath

		if (-not (Test-Path $targetDir)) {
			New-Item $targetDir -ItemType Directory | Out-Null
		}

		$relativeTargetPath = Get-RelativePath $targetPath $WorkingDir
		Write-Host "$relativeSourcePath => $relativeTargetPath"
		Copy-Item $sourcePath $targetPath -Force
	}
}


################################
# MS DEPLOY

$MsDeployExe = Find-ExecutablePath 'msdeploy.exe' 'C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe'

function Invoke-MSDeploy {
	param(
		[Parameter(Position = 0, Mandatory = $true)] $SourceDir,
		$ConfigurationPath = $null
	)

	if (-not $ConfigurationPath) {
		$ConfigurationPath = 'deploy.ini.user'
	}

	$deployParams = Read-IniFile $ConfigurationPath
	$target = $deployParams['ComputerName']
	Write-Header "Deploying from '$SourceDir' to '$target'"

	if (-not [IO.Path]::IsPathRooted($SourceDir)) {
		$SourceDir = Join-Path (pwd) $SourceDir
	}

	$msDeployDest = Join-Hashtable $deployParams
	& $MsDeployExe -verb:sync -source:contentPath=$SourceDir -dest:$msDeployDest
}