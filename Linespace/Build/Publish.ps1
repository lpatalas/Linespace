param(
	[String] $UserName,
	[String] $Password)

$MsBuildExe = 'C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe';
$MsDeployExe = 'C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe'
$ProjectName = 'Linespace.csproj'
$PublishDir = 'Build\Output'

$sourceFiles = @(
	'index.html'
)

$MsBuildProperties = @(
	"Configuration=Debug"
	"Platform=AnyCPU"
	"VisualStudioVersion=14.0"
) -join ';'

$MsDeployDest = @(
	'contentPath=linespace'
	'ComputerName=https://waws-prod-am2-057.publish.azurewebsites.windows.net/MsDeploy.axd?site=linespace'
	"UserName=$UserName"
	"Password=$Password"
	'AuthType=Basic'
) -join ','

function BeginSection($title) {
	Write-Host
	Write-Host $title -ForegroundColor Blue
}

try {
	BeginSection 'Building project'

	& $MsBuildExe /property:$MsBuildProperties /verbosity:minimal /nologo $ProjectName
	if ($LASTEXITCODE -ne 0) {
		throw 'Build failed'
	}

	$outputs = @()

	function AddOutput($path) {
		if (-not (Test-Path $path)) {
			throw "Referenced file $path does not exist"
		}

		$script:outputs += @( $path );
	}

	function AddReferencedScripts($htmlPath) {
		$basePath = [IO.Path]::GetDirectoryName($htmlPath)
		$references = Select-String '<script src="([^`"]+)"' index.html -AllMatches `
			| %{ $basePath + $_.matches.Groups[1].Value }

		foreach ($reference in $references) {
			AddOutput $reference
		}
	}

	BeginSection 'Publishing files:'

	foreach ($pattern in $sourceFiles) {
		$items = Get-ChildItem $pattern -Name
		foreach ($item in $items) {
			AddOutput $item
			if ($item -like '*.htm?') {
				AddReferencedScripts $item
			}
		}
	}

	if (Test-Path $PublishDir) {
		Remove-Item $PublishDir -Force -Recurse
	}

	foreach ($sourcePath in $outputs) {
		$targetPath = Join-Path $PublishDir $sourcePath
		$targetDir = Split-Path $targetPath

		if (-not (Test-Path $targetDir)) {
			New-Item $targetDir -ItemType Directory | Out-Null
		}

		Write-Host "$sourcePath => $targetPath"
		Copy-Item $sourcePath $targetPath -Force
	}

	BeginSection 'Deploying files'

	$FullPublishDir = Join-Path (pwd) $PublishDir
	& $MsDeployExe -verb:sync -source:contentPath=$FullPublishDir -dest:$MsDeployDest
		
}
catch {
	Write-Host $_.Exception.Message -ForegroundColor Red
}