
$MsBuildExe = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe";
$ProjectName = 'Linespace.csproj'

$MsBuildProperties = @(
	"Configuration=Debug"
	"Platform=AnyCPU"
	"VisualStudioVersion=14.0"
) -join ';'

$sourceFiles = @(
	'index.html'
)

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
		Write-Host $path
	}

	function AddReferencedScripts($htmlPath) {
		$basePath = [IO.Path]::GetDirectoryName($htmlPath)
		$references = Select-String '<script src="([^`"]+)"' index.html -AllMatches `
			| %{ $basePath + $_.matches.Groups[1].Value }

		foreach ($reference in $references) {
			AddOutput $reference
		}
	}

	BeginSection 'Getting list of published files:'

	foreach ($pattern in $sourceFiles) {
		$items = Get-ChildItem $pattern -Name
		foreach ($item in $items) {
			AddOutput $item
			if ($item -like '*.htm?') {
				AddReferencedScripts $item
			}
		}
	}


}
catch {
	Write-Host $_.Exception.Message -ForegroundColor Red
}