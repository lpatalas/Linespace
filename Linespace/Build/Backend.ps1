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


################################
# MS BUILD

$MsBuildExe = 'C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe';

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
		[String] $PublishDir
	)

	Write-Header "Publishing files to '$PublishDir'"

	function GetReferencedScripts($htmlPath) {
		$basePath = [IO.Path]::GetDirectoryName($htmlPath)
		$references = Select-String '<script src="([^`"]+)"' $htmlPath -AllMatches `
			| %{ $basePath + $_.matches.Groups[1].Value }

		return $references
	}
	
	$outputs = @()

	foreach ($pattern in $InputPatterns) {
		$items = Get-ChildItem $pattern -Name
		foreach ($item in $items) {
			$outputs += @( $item )
			if ($item -like '*.htm?') {
				$outputs += @( GetReferencedScripts $item )
			}
		}
	}

	$outputs = $outputs | Get-Unique

	foreach ($path in $outputs) {
		if (-not (Test-Path $path)) {
			throw "Referenced file '$path' does not exist"
		}
	}

	if (Test-Path $PublishDir) {
		Remove-Item $PublishDir -Force -Recurse
	}

	foreach ($sourcePath in $outputs) {
		# TODO: build target correctly even for absolute source path
		$targetPath = Join-Path $PublishDir $sourcePath
		$targetDir = Split-Path $targetPath

		if (-not (Test-Path $targetDir)) {
			New-Item $targetDir -ItemType Directory | Out-Null
		}

		Write-Host "$sourcePath => $targetPath"
		Copy-Item $sourcePath $targetPath -Force
	}
}


################################
# MS DEPLOY

$MsDeployExe = 'C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe'

function Invoke-MSDeploy {
	param(
		[Parameter(Position = 0, Mandatory = $true)] $SourceDir,
		$ConfigurationPath = $null
	)

	if (-not $ConfigurationPath) {
		$ConfigrationPath = 'deploy.ini.user'
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