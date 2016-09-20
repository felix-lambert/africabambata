# Installation environnement Avocadoo marketplace

## install environment

### Install NodeJs

https://nodejs.org/en/

### Install bower

```
npm install -g bower

```

### Install nodemon

```
npm install -g nodemon
```
Clone and start the repository

```
git clone marketplace
cd marketplace
npm install
nodemon server.js
```

Choose environment>

Local:
```
sudo npm run local
```

Install ESSynchronized modules:

```
cd ESsynnchronize
npm install
```



Preprod:
```
npm run pre
```

Prod:
```
npm run prod
```

After go to: 

```
localhost:3000 or https://marketplace.avocadoo.dev/
```

### Install brunch

Open an other terminal and go inside `frontend` then:

```
npm install -g brunch
npm install
brunch w
```

### Install mongodb:

https://docs.mongodb.org/manual/installation/

You can start coding!

### Install elasticsearch and launch elasticsearch:

https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html

```
export PATH=/home/yourname/elasticsearch/bin/:$PATH
elasticsearch
```

#### Add `ElasticSearch head`

This plugin will have a general presentation of your `elasticsearch` documents (a bit like phpmyadmin).

```
    elasticsearch/bin/plugin -install mobz/elasticsearch-head
    open http://localhost:9200/_plugin/head/
```

If you've installed elasticsearch globally in your machine, the root folder is probably in: 

```
    /usr/share/elasticsearch
```

##### On ubuntu

`https://www.unixmen.com/install-elasticsearch-ubuntu-14-04/`

Add `http.max_content_length: 300M` in `elasticsearch.yml`

Keep elasticsearch running!

#### Install `jq`

##### On linux

To be able to synchronize `mysql` and `elasticsearch`:

```
    sudo apt-get install jq
```

#### Synchronize elasticsearch

Local:
npm run syncLocal
Prod:
npm run syncProd
PreProd:
npm run syncPre

Create 4 files (host.txt, username.txt, password.txt, database.txt) and put your identifications in it.

./syncMysqlElasticsearch.sh

### Testing

```
npm run test
```

Will test the back and the front

#### Test coverage

Install live-server:
```
npm install -g live-server
```

Inspect test coverage:

```
npm run coverage
``` 

Got to localhost:8080 (http://127.0.0.1:8080)!

### Commit

If there is errors in your test, the commit will not work.

Don't forget to leave the server running while tests are made.

#### Commit message

Proposition d'un commit message conventionnel obligatoire sous cette forme :
<type>(<scope>): <subject>
Exemple : "chore(server): #35recette delete console.log"

Les différents types :

feat: A new feature
fix: A bug fix
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

Le scope : zone où le commit a été fait

<subject> : Le sujet du commit avec le numéro du ticket trello (#35 par exemple)

### Git flow

```
sudo apt-get install git-flow
```

### Apidoc

Generate documentation: 

```
sudo apidoc -f "backend/controllers/.*\\.js$" -i ./  -o apidoc/
```

## outils

```
apt-get install -y zsh git-core
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## Virtual Host

Il faut ajouter un virtual host à la configuration d'Apache, en modifiant le paramètre `DocumentRoot` en fonction de sa propre configuration, idem pour les path vers `SSLCertificateFile`, `SSLCertificateKeyFile` et les fichiers de log (créer les répertoires si besoin) :

```
<VirtualHost *:443>
    ServerName marketplace.avocadoo.dev
    DocumentRoot "/var/www/avocadoo/marketplace/frontend/public"
    ProxyRequests off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    <Location />
        ProxyPass http://127.0.0.1:8080/
        ProxyPassReverse http://127.0.0.1:8080/
    </Location>

    ErrorLog /www/sites/logs/avocadoo/marketplace/error.log
    LogLevel warn
    CustomLog /www/sites/logs/avocadoo/marketplace/access.log combined

    SetEnv ENV local
    SSLEngine on
    SSLCipherSuite ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP:+eNULL
    SSLCertificateFile /etc/apache2/ssl/crt/server.crt
    SSLCertificateKeyFile /etc/apache2/ssl/key/server.key
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Headers "X-Requested-With"
</VirtualHost>
```

### Si pas déjà fait, activer les modules proxy et proxy_http

```
sudo a2enmod proxy_http
sudo a2enmod proxy
```
