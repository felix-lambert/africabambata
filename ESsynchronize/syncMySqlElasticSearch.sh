curl -XDELETE 'http://localhost:9200/ingredient/'
curl -XDELETE 'http://localhost:9200/recipe_ingredient/'
curl -XDELETE 'http://localhost:9200/safeway/'
curl -XDELETE 'http://localhost:9200/instacart/'
curl -XDELETE 'http://localhost:9200/freshdirect/'
curl -XDELETE 'http://localhost:9200/shipt/'
curl -XDELETE 'http://localhost:9200/peapod/'
curl -XDELETE 'http://localhost:9200/walmart/'

node index.js;
# count instacart files number
INSTACART_FILES="$(ls instacart*)"

for index in $INSTACART_FILES
do
   echo "Processing file $index"
   cat "$index" | jq -c '.[] | {"index": {"_index": "instacart", "_type": "ing"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
   rm "$index";
done

cat ingredients.json | jq -c '.[] | {"index": {"_index": "ingredient", "_type": "ing"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm ingredients.json;

cat recipe_ingredients.json | jq -c '.[] | {"index": {"_index": "recipe_ingredient", "_type": "rin"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm recipe_ingredients.json;

cat safeway.json | jq -c '.[] | {"index": {"_index": "safeway", "_type": "saf"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm safeway.json;

cat freshdirect.json | jq -c '.[] | {"index": {"_index": "freshdirect", "_type": "fre"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm freshdirect.json;

cat shipt.json | jq -c '.[] | {"index": {"_index": "shipt", "_type": "shi"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm shipt.json;

cat peapod.json | jq -c '.[] | {"index": {"_index": "peapod", "_type": "pea"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm peapod.json;

cat walmart.json | jq -c '.[] | {"index": {"_index": "walmart", "_type": "wal"}}, .' | curl -XPOST localhost:9200/_bulk --data-binary @-;
rm walmart.json;
