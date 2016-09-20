define({ "api": [
  {
    "type": "post",
    "url": "/api/ingredient/addAlias",
    "title": "Add alias from ingredient",
    "name": "Add_alias",
    "group": "Ingredients",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"errors\":[],\n    \"added\":\"9811\",\n    \"success\":true,\n    \"user_groups\":[\"admin\",\"customer\"],\n    \"is_logged_in\":true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\":false,\n    \"message\":\"Nothing added\",\n    \"user_groups\":[\"admin\",\"customer\"],\n    \"is_logged_in\":true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/aliasCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "post",
    "url": "/api/recipe/add",
    "title": "Add ingredient in recipe",
    "name": "Add_ingredient",
    "group": "Ingredients",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"message\":\"Done\"\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "delete",
    "url": "/api/recipe/destroy/:id",
    "title": "Destroy ingredient in recipe",
    "name": "Delete_ingredient",
    "group": "Ingredients",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"message\":\"Done\",\n    \"id\":\"14\",\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "post",
    "url": "/api/recipe/edit",
    "title": "Destroy ingredient in recipe",
    "name": "Delete_ingredient",
    "group": "Ingredients",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"message\":\"Done\",\n    \"id\":\"14\",\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "get",
    "url": "/api/ingredient/get",
    "title": "Get ingredients from id",
    "name": "Get_id_ingredients",
    "group": "Ingredients",
    "version": "0.0.0",
    "filename": "./backend/controllers/aliasCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "get",
    "url": "/api/recipe/parse/:id",
    "title": "Get recipe ingredients",
    "name": "Get_recipe_ingredients",
    "group": "Ingredients",
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "post",
    "url": "/api/recipe/reviewed",
    "title": "Review ingredients in recipe",
    "name": "Review_ingredients",
    "group": "Ingredients",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"message\":\"Done\"\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "post",
    "url": "/api/ingredientrecipe",
    "title": "Search for ingredients in ES",
    "name": "Search_for_ingredients",
    "group": "Ingredients",
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "post",
    "url": "/api/ingredient",
    "title": "Search for ingredients in ES",
    "name": "Search_for_ingredients",
    "group": "Ingredients",
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Ingredients"
  },
  {
    "type": "post",
    "url": "/api/items/addLink",
    "title": "Add items linked to ingredient",
    "name": "Add_linked_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/editLink",
    "title": "Edit items linked to ingredient",
    "name": "Edit_linked_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/link",
    "title": "Link items to ingredient",
    "name": "Link_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/freshdirect",
    "title": "Search for freshdirect items in ES",
    "name": "Search_for_freshdirect_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/instacart",
    "title": "Search for instacart items in ES",
    "name": "Search_for_instacart_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/item/search",
    "title": "Search for items with retailers",
    "name": "Search_for_items",
    "group": "Items",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": true,\n    \"items\":[{\"id\":\"85839\",\"name\":\"Sugar Snap Peas\",\"retailer\":\"freshdirect\"},{\"id\":\"89125\",\"name\":\"Sugar in the Raw Granulated Sugar\",\"retailer\":\"freshdirect\"}],\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\":\"No items found.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\":\"CDbCommand failed to execute the SQL statement: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'avocadoo.retailer_item_' doesn't exist. The SQL statement executed was: SELECT i.id, i.description as name, retailers.slug as retailer\\n            FROM item i\\n            INNER JOIN (SELECT item_id, '' as slug FROM retailer_item_ UNION ALL SELECT item_id, 'safeway' as slug FROM retailer_item_safeway UNION ALL SELECT item_id, '' as slug FROM retailer_item_ UNION ALL SELECT item_id, '' as slug FROM retailer_item_ UNION ALL SELECT item_id, 'peapod' as slug FROM retailer_item_peapod UNION ALL SELECT item_id, 'walmart' as slug FROM retailer_item_walmart UNION ALL SELECT item_id, 'freshdirect' as slug FROM retailer_item_fresh_direct UNION ALL SELECT item_id, 'instacart' as slug FROM retailer_item_instacart UNION ALL SELECT item_id, 'amazon_fresh' as slug FROM retailer_item_amazon_fresh UNION ALL SELECT item_id, 'shipt' as slug FROM retailer_item_shipt) retailers ON retailers.item_id = i.id WHERE i.description=:name. Bound with :name='sugar'\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/recipe/create",
    "title": "Search for items with retailers",
    "name": "Search_for_items",
    "group": "Items",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\":true,\n    \"message\":\"Done\",\n    \"id\":\"14\",\n    \"user_groups\":[\"admin\",\"widget\"],\n    \"is_logged_in\":true\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\":false,\n    \"message\":\"createItem :: Error : no widget found.\",\n    \"user_groups\":[\"admin\",\"widget\"],\n    \"is_logged_in\":true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/peapod",
    "title": "Search for peapod items in ES",
    "name": "Search_for_peapod_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/safeway",
    "title": "Search for safeway items in ES",
    "name": "Search_for_safeway_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/shipt",
    "title": "Search for shipt items in ES",
    "name": "Search_for_shipt_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/items/walmart",
    "title": "Search for walmart items in ES",
    "name": "Search_for_walmart_items",
    "group": "Items",
    "version": "0.0.0",
    "filename": "./backend/controllers/itemCtrl.js",
    "groupTitle": "Items"
  },
  {
    "type": "post",
    "url": "/api/parentfood/addItem",
    "title": "Add item",
    "name": "Add_item",
    "group": "Parent_food",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "item_id",
            "description": "<p>Id of item.</p>"
          },
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "parent_food_id",
            "description": "<p>Id of parent food.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "main_item",
            "description": "<p>Default to false (facultative)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": true,\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\": \"Already added to a parent food.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Parent_food"
  },
  {
    "type": "get",
    "url": "/api/parentfood/get",
    "title": "Parent food list",
    "name": "Parent_food_list",
    "group": "Parent_food",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "id",
            "description": "<p>Id of parent food.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": true,\n    \"parent_food\": {\"id\":\"245\",\"name\":\"Lentils\"},\n    \"items\": [{\"id\":\"165208\",\"name\":\"Goya Kidney Beans Red Dry\",\"is_main_item\":true},{\"id\":\"174826\",\"name\":\"Signature Kitchens Kidney Beans Red - 16 Oz\",\"is_main_item\":false}],\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\": \"One or more parameter is missing.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Parent_food"
  },
  {
    "type": "post",
    "url": "/api/parentfood/list",
    "title": "Get parent food with associate items",
    "name": "Parent_food_list",
    "group": "Parent_food",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": true,\n    \"parent_food\": \"parent_foods\":[{\"id\":\"353\",\"name\":\"Acai\"},{\"id\":\"368\",\"name\":\"Acorn Squash\"},{\"id\":\"527\",\"name\":\"almond milk\"},{\"id\":\"284\",\"name\":\"Almond pecan crunch\"},{\"id\":\"501\",\"name\":\"almond yogurt\"},{\"id\":\"404\",\"name\":\"Almonds\"},{\"id\":\"336\",\"name\":\"Apple\"},{\"id\":\"423\",\"name\":\"Apple Sauce\"},{\"id\":\"469\",\"name\":\"Apples\"},{\"id\":\"263\",\"name\":\"Apples Breaburn\"},{\"id\":\"262\",\"name\":\"Apples Honeycrisp\"},{\"id\":\"257\",\"name\":\"Apricot 5 Grain Oats Yogurt\"}],\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\": \"One or more parameter is missing.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Parent_food"
  },
  {
    "type": "post",
    "url": "/api/parentfood/removeItem",
    "title": "Remove item",
    "name": "Remove_item",
    "group": "Parent_food",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "item_id",
            "description": "<p>Id of item.</p>"
          },
          {
            "group": "Parameter",
            "type": "Id",
            "optional": false,
            "field": "parent_food_id",
            "description": "<p>Id of parent food.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": true,\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\": \"One or more parameter is missing.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\": \"Error while removing item from parent food.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Parent_food"
  },
  {
    "type": "delete",
    "url": "/api/recipe/delete/:id",
    "title": "Delete all the recipe",
    "name": "Delete_recipe",
    "group": "Recipe",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\":true,\n    \"message\":\"Done\",\n    \"user_groups\":[\"admin\",\"widget\"],\n    \"is_logged_in\":true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/recipeCtrl.js",
    "groupTitle": "Recipe"
  },
  {
    "type": "post",
    "url": "/api/retailer/linked",
    "title": "Check if a retailer has linked ingredients",
    "name": "Linked_ingredients",
    "group": "Retailers",
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Retailers"
  },
  {
    "type": "get",
    "url": "/api/retailer/list",
    "title": "Get all the retailers",
    "name": "Retailer_list",
    "group": "Retailers",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    { success: true,\n      retailers: \n       [ { id: 9, name: 'FreshDirect' },\n         { id: 207, name: 'Instacart' },\n         { id: 6, name: 'Peapod' },\n         { id: 2, name: 'Safeway' },\n         { id: 209, name: 'Shipt' },\n         { id: 8, name: 'Walmart' } ],\n      user_groups: [ 'admin', 'widget' ],\n      is_logged_in: true }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"success\": false,\n    \"message\": \"One or more parameter is missing.\",\n    \"user_groups\": [\"admin\", \"customer\"],\n    \"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/foodCtrl.js",
    "groupTitle": "Retailers"
  },
  {
    "type": "post",
    "url": "/api/user/login",
    "title": "Login",
    "name": "Login",
    "group": "User_session",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "login",
            "optional": false,
            "field": "Email.",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "password",
            "optional": false,
            "field": "Password",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"success\": true,\n\t\"message\": \"successfully logged in\",\n\t\"user_groups\": [\"admin\", \"customer\"],\n\t\"is_logged_in\": true \n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"success\": false,\n\t\"message\": \"Wrong login and / or password.\",\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"success\": false,\n\t\"message\": \"Already logged in.\",\n\t\"user_groups\": [\"admin\", \"customer\"],\n\t\"is_logged_in\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/userCtrl.js",
    "groupTitle": "User_session"
  },
  {
    "type": "post",
    "url": "/api/user/logout",
    "title": "Logout",
    "name": "Logout",
    "group": "User_session",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"success\": true,\n\t\"message\": \"Successfully logged out.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"success\": false,\n\t\"message\": \"Hybridauth Library needs the CURL PHP extension.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./backend/controllers/userCtrl.js",
    "groupTitle": "User_session"
  }
] });
