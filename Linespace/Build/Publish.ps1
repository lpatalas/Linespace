. "$PSScriptRoot\Backend.ps1"

$ProjectName = 'Linespace.csproj'
$PublishDir = 'Build\Output'
$DeploymentConfigPath = 'Build\deploy.ini.user'

$sourceFiles = @(
	'index.html'
)

try {
	Invoke-MSBuild $ProjectName
	Publish-Files $sourceFiles $PublishDir
	Invoke-MSDeploy $PublishDir -ConfigurationPath:$DeploymentConfigPath
}
catch {
	Write-Host $_.Exception -ForegroundColor Red
}