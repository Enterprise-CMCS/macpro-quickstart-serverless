
set -e

help='This script is run with the format  ./output.sh <target service name> <serverless output variable name> <stage name (optional, default dev)>'
example='ex.  ./output.sh ui CloudFrontEndpointUrl'

: ${1?ERROR: 'You must specify the target service.'
$help
$example}
: ${2?ERROR: "You must specify the variable you want to fetch from serverless' output"
$help
$example}

service=${1}
output=${2}
stage=${3:-dev}

if [ $output == "url" ]; then
  output="CloudFrontEndpointUrl"
fi

cd $service && serverless info --stage $stage --verbose | sed -e '1,/^Stack Outputs/d' -e '$d' | sed -n -e "s/^.*$output: //p" && cd ..
