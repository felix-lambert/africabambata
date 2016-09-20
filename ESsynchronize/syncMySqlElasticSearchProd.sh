curl -XDELETE 'http://localhost:9200/instacart_prod/'
curl -XDELETE 'http://localhost:9200/ingredient_prod/'
curl -XDELETE 'http://localhost:9200/recipe_ingredient_prod/'
curl -XDELETE 'http://localhost:9200/safeway_prod/'
curl -XDELETE 'http://localhost:9200/freshdirect_prod/'
curl -XDELETE 'http://localhost:9200/shipt_prod/'
curl -XDELETE 'http://localhost:9200/peapod_prod/'
curl -XDELETE 'http://localhost:9200/walmart_prod/'

node index.js;

count instacart files number
INSTACART_FILES="$(ls instacart*)"

for index in $INSTACART_FILES
do
   echo "Processing file $index"
   cat "$index" | jq -c '.[] | {"index": {"_index": "instacart_prod", "_type": "ins"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
   rm "$index"
done


cat ingredients.json | jq -c '.[] | {"index": {"_index": "ingredient_prod", "_type": "ing"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm ingredients.json;


cat recipe_ingredients.json | jq -c '.[] | {"index": {"_index": "recipe_ingredient_prod", "_type": "rin"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm recipe_ingredients.json;


cat safeway.json | jq -c '.[] | {"index": {"_index": "safeway_prod", "_type": "saf"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm safeway.json;


cat freshdirect.json | jq -c '.[] | {"index": {"_index": "freshdirect_prod", "_type": "fre"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm freshdirect.json;


cat shipt.json | jq -c '.[] | {"index": {"_index": "shipt_prod", "_type": "shi"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm shipt.json;


cat peapod.json | jq -c '.[] | {"index": {"_index": "peapod_prod", "_type": "pea"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm peapod.json;


cat walmart.json | jq -c '.[] | {"index": {"_index": "walmart_prod", "_type": "wal"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm walmart.json;
