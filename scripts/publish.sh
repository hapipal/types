bold() {
    echo "\033[1m$1\033[0m"
}

red () {
    echo "\x1b[31m$1\x1b[0m"
}
green () {
    echo "\x1b[32m$1\x1b[0m"
}
yellow () {
    echo "\x1b[33m$1\x1b[0m"
}

shopt -s dotglob
shopt -s nullglob
_dirs=(types/*);

dirs=$(echo "${_dirs[@]}" | sed s/types\\///g)

help() {

    echo "$(bold 'Usage:') \n    yarn publish [$(green ${dirs// /|})]"
}

if [[ ! $dirs == *$1*  ]] || [[ ! -d "types/$1" ]]; then

    red "Error: invalid folder specified"
    help
    exit 1
fi

cd types/$1; npm publish
