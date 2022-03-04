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

    echo "$(bold 'Usage:') \n    yarn bump [$(green ${dirs// /|})] [$(yellow 'minor|major|patch|prerelease')]"
}


if [[ ! -z $2 ]] && [[ ! "$2" =~ ^(minor|major|patch)$ ]]; then

    red 'Error: invalid version'
    help
    exit 1
fi

if [[ ! $dirs == *$1*  ]] || [[ ! -d "types/$1" ]]; then

    red "Error: invalid folder specified"
    help
    exit 1
fi

VERSION=$2

if [[ -z $2 ]]; then

    PRE=

    read -p "$(green 'Prerelease [y/n]') " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]
    then

        options=("alpha" "beta" "other")
        select opt in "${options[@]}"
        do

            case $opt in
                "alpha")
                    PRE="alpha"
                    break
                    ;;
                "beta")
                    PRE="beta"
                    break
                    ;;
                "other")
                    read -p "name: " -r PRE
                    break
                    ;;
                *) echo "invalid option $REPLY";;
            esac
        done
    fi
fi


if [[ ! -z "$PRE" ]]; then

    VERSION="prerelease --preid $PRE"
fi


if [[ -z $VERSION ]]; then

    red 'Error: must pass a version or select a prelease';
    exit 1
fi;


cd types/$1; npm version $VERSION ${@:3}
