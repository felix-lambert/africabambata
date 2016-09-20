
curl -XDELETE 'http://localhost:9200/instacart_pre/'
curl -XDELETE 'http://localhost:9200/ingredient_pre/'
curl -XDELETE 'http://localhost:9200/recipe_ingredient_pre/'
curl -XDELETE 'http://localhost:9200/safeway_pre/'
curl -XDELETE 'http://localhost:9200/freshdirect_pre/'
curl -XDELETE 'http://localhost:9200/shipt_pre/'
curl -XDELETE 'http://localhost:9200/peapod_pre/'
curl -XDELETE 'http://localhost:9200/walmart_pre/'

node index.js;


# count instacart files number
INSTACART_FILES="$(ls instacart*)"

for index in $INSTACART_FILES
do
   echo "Processing file $index"
   cat "$index" | jq -c '.[] | {"index": {"_index": "instacart_pre", "_type": "ins"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
   rm "$index"
done

cat ingredients.json | jq -c '.[] | {"index": {"_index": "ingredient_pre", "_type": "ing"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm ingredients.json;


cat recipe_ingredients.json | jq -c '.[] | {"index": {"_index": "recipe_ingredient_pre", "_type": "rin"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm recipe_ingredients.json;


cat safeway.json | jq -c '.[] | {"index": {"_index": "safeway_pre", "_type": "saf"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm safeway.json;


cat freshdirect.json | jq -c '.[] | {"index": {"_index": "freshdirect_pre", "_type": "fre"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm freshdirect.json;


cat shipt.json | jq -c '.[] | {"index": {"_index": "shipt_pre", "_type": "shi"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm shipt.json;


cat peapod.json | jq -c '.[] | {"index": {"_index": "peapod_pre", "_type": "pea"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm peapod.json;


cat walmart.json | jq -c '.[] | {"index": {"_index": "walmart_pre", "_type": "wal"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm walmart.json;

