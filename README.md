# Portal Client

Servidor cliente para o Portal de Laudos e Exames. 

## Instalação

Requer o **npm** (https://www.npmjs.com/).

> Uso de Profiles:
> Basta incluir a tag **--profile** seguido do profile desejado
> **dev** - Desenvolvimneto (default caso a tag seja omitida)
> **hmg** - Homologação


Baixe os arquivos do repositório (https://bitbucket.org/rededorcorp/portal-client).

```sh
$ cd <portal-client_path>
$ npm install
$ npm install -g bower
$ npm install -g gulp
$ npm install gulp-ng-config
$ npm install get-gulp-args
$ bower install
```

Problemas ao rodar o npm install? http://acdcjunior.github.io/node-gyp-windows.html

## Rodar

Ambiente desenvolvimento
```sh
$ gulp serve
```

Ambiente homologação
```sh
$ gulp serve --profile hmg
```

## Geração de pacote
```sh
$ gulp war --profile hmg
```