param(
	[switch] $Deploy
)

. "$PSScriptRoot\Backend.ps1"

$ProjectName = 'Linespace.csproj'
$PublishDir = 'Build\Output'
$DeploymentConfigPath = 'Build\deploy.ini.user'

$SourceFiles = @(
	'index.html'
)

Invoke-MSBuild $ProjectName
Publish-Files $SourceFiles $PublishDir

if ($Deploy) {
	Invoke-MSDeploy $PublishDir -ConfigurationPath:$DeploymentConfigPath
}