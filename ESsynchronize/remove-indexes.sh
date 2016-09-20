#! /bin/bash

# set environment
if [[ $# -gt 1 ]]; then
    echo "Illegal number of parameters";
    exit 1;
fi
if [[ $# -eq 1 ]]; then
    if [[ "$1" == "local" ]]; then
        INGREDIENT=ingredient
        RECIPE_INGREDIENT=recipe_ingredient
        SAFEWAY=safeway
        INSTACART=instacart
        FRESHDIRECT=freshdirect
        SHIPT=shipt
        PEAPOD=peapod
        WALMART=walmart

    elif [[ "$1" == "preprod" ]]; then
        INGREDIENT=ingredient_pre
        RECIPE_INGREDIENT=recipe_ingredient_pre
        SAFEWAY=safeway_pre
        INSTACART=instacart_pre
        FRESHDIRECT=freshdirect_pre
        SHIPT=shipt_pre
        PEAPOD=peapod_pre
        WALMART=walmart_pre

    elif [[ "$1" == "prod" ]]; then
        INGREDIENT=ingredient_prod
        RECIPE_INGREDIENT=recipe_ingredient_prod
        SAFEWAY=safeway_prod
        INSTACART=instacart_prod
        FRESHDIRECT=freshdirect_prod
        SHIPT=shipt_prod
        PEAPOD=peapod_prod
        WALMART=walmart_prod

    else
        echo "Bad parameter value"
        exit 1;
    fi

else
    echo "you need to specify environment : local, preprod, prod";
    exit 1;
fi

curl -XDELETE 'http://localhost:9200/'$INGREDIENT'/'
curl -XDELETE 'http://localhost:9200/'$RECIPE_INGREDIENT'/'
curl -XDELETE 'http://localhost:9200/'$SAFEWAY'/'
curl -XDELETE 'http://localhost:9200/'$INSTACART'/'
curl -XDELETE 'http://localhost:9200/'$FRESHDIRECT'/'
curl -XDELETE 'http://localhost:9200/'$SHIPT'/'
curl -XDELETE 'http://localhost:9200/'$PEAPOD'/'
curl -XDELETE 'http://localhost:9200/'$WALMART'/'
