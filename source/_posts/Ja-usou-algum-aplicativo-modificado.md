---
title: Já usou algum aplicativo modificado?
excerpt: Primeira parte do artigo, como criar um aplicativo modificado para fins de estudo.
date: 2020-02-25 00:00:00
tags: 
  - Hacking
  - Tutorial
  - Segurança da informação
  - CTF
cover: https://cdn-images-1.medium.com/max/800/1*6DFc5bbE7cL5uQpzk_nvog.png
cover_creditos:
default_cover:
---

Hello friends.

Você pode esta sendo espionado 😂.

Passei o final de semana realizando engenharia reversa em alguns aplicativos e games voltados para android.

Realizando uma busca no Google por “apk mod” obtemos vários resultados entre games e aplicativos. É seguro instalar alguns destes aplicativos de procedência duvidosa? não, ás vezes mesmo instalando aplicativos da plataforma oficial é inseguro.

Irei demonstrar como fazer um apk modificado e no final adicionar uma shell de conexão reversa, o aplicativo que escolhi foi o [Pou](https://play.google.com/store/apps/details?id=me.pou.app).

Para quem não sabe Pou é este joguinho aqui.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*6DFc5bbE7cL5uQpzk_nvog.png" alt="">
      <figcaption></figcaption>
    </figure>

O jogo começa com 200 moedas, a cada tarefa realiza você ganha um pouco de moedas. Meu objetivo inicial o jogo e ter o máximo de moedas possível.

Antes de começar precisamos do apk basta instalar ele no Smartphone e usar o [app backup](https://play.google.com/store/apps/details?id=mobi.usage.appbackup&hl=pt_BR) para fazer o backup do apk.

Precisamos de algumas ferramentas:

*   [Apktool](https://ibotpeaches.github.io/Apktool/)
*   [Bytecode Viewer](https://github.com/konloch/bytecode-viewer/releases)
*   [Java Decompiler (jd-gui)](http://java-decompiler.github.io/)
*   [Uber Apk Signer](https://github.com/patrickfav/uber-apk-signer)
*   [Visual Studio Code](https://code.visualstudio.com/) (ou qualquer outro editor de texto)

Depois de baixar/instalar os aplicativos, a lista ficara parecida com esta.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*xQ0HKMuiqZ0Og-tD1Er-TA.png" alt="">
      <figcaption></figcaption>
    </figure>

Lista de arquivos.

O primeiro passo é decodificar o apk.

> Se você nunca viu um arquivo “.smali” de uma linda nesta [página](https://source.android.com/devices/tech/dalvik/dalvik-bytecode) que ira ajudar a entender como é a Sintaxe.

> java -jar apktool\_2.4.1.jar d pou.apk

Apos executar o comando uma nova pasta sera gerada com o aplicativo decodificado.

precisamos encontrar a classe principal do app, para isso devemos ir no arquivo “AndroidManifest.xml” e procurar a “activity main”, no caso do Pou é “me.pou.app.App”.

Vamos usar o Bytecode Viewer para ver o source code da aplicação e descobrir onde devemos alterar. Olhando o código fonte achei uma referencia “coin/coin\_add.png” que é a imagem do topo onde mostra a quantidade moedas e também tem varias referência a “StringBuilder” concatenando numero com texto, vamos editar o arquivo “smali\\me\\pou\\app\\AppView.smali”.

Tudo que estiver assim.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*Wrz4XPyBXrqXK7N6p698gA.png" alt="">
      <figcaption></figcaption>
    </figure>

Devera mudar para algum texto que de para identificar na tela do aplicativo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*2yu45lxW36Ga1F__FOGGYA.png" alt="">
      <figcaption></figcaption>
    </figure>

Eu irei ir modificando na sequencia X1,X2 etc.

Agora vamos recompilar o aplicativo.

> java -jar apktool\_2.4.1.jar b pou -o pou\_mod.apk

Agora temos que assinar o aplicativo, **“ O Android exige que todos os APKs sejam assinados digitalmente com um certificado antes de serem instalados em um dispositivo ou atualizados”.**

> java -jar uber-apk-signer-1.1.0.jar -a pou\_mod.apk

Foi gerado um novo apk assinado “pou\_mod-aligned-debugSigned.apk”, basta instalar e ver o resultado.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*mZ2VDeDKJbMw9n9nXDSUZQ.png" alt="">
      <figcaption></figcaption>
    </figure>

A nossa modificação esta presente na tela, vamos achar a função que altera os pontos.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*CpcvDAqtiO-lNDGcXPGClw.png" alt="">
      <figcaption></figcaption>
    </figure>

O método “h()” parece um bom lugar já que ele nos retorna um numero inteiro como sei disso é simples “->h()” indica o método e o “I” no final é o tipo de retorno.

Vamos editar a classe “smali\\me\\pou\\app\\g\\c\\a.smali” procure pelo método “h”.

> .method public h()I

Modifique “.locals 2” para “.locals 3” que indica 3 variáveis locais, e no final do método declare uma variável e mude a variável de retorno, ficara parecido com o exemplo abaixo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*jB6Ug6w2ByOVpU713-nzEw.png" alt="">
      <figcaption></figcaption>
    </figure>

> 0x7fffffff (2147483647) é o valor máximo de um numero inteiro em JAVA, se o valor ultrapassar o aplicativo vai apresentar um erro e fechar.

Vamos compilar e instalar novamente e ver o que acontece.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*czhr7qWAr-uHTYSNoSY4VQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Já temos moedas infinitas, o level vou deixar vocês modificarem.

No próximo post irei colocar a shell reversa no jogo modificado.
