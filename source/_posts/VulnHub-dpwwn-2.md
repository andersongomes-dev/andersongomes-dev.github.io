---
title: 'VulnHub dpwwn: 2'
excerpt: "Desafio CTF <strong><a href=''>VulnHub dpwwn: 2</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
date: 2019-08-31 17:08:43
tags: 
  - Hacking
  - Tutorial
  - Segurança da informação
  - CTF
cover: https://cdn-images-1.medium.com/max/800/1*w9aO18UeJmecg-8BIXiFJw.png
cover_creditos:
default_cover:
---

Hello friends.

### Informações sobre o Alvo.

A flag esta em /root/dpwwn-02-FLAG.txt.

O ip do nosso alvo é dado no começo do desafio “10.10.10.10”.

### Reconhecimento / Enumeração.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*w9aO18UeJmecg-8BIXiFJw.png" alt="">
      <figcaption></figcaption>
    </figure>

nmap

Logo depois da execução do nmap, notamos dois serviços interessantes, o primeiro é o apache rodando na porta 80, e a outra é o NFS rodando na porta 2049.   
Vamos verificar a lista de diretórios no NFS.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*gU-Wb8l36_iyvkLGH1vQPA.png" alt="">
      <figcaption></figcaption>
    </figure>

showmount.

Há um diretório para que podemos montar, vamos para o próximo passo que é escanear a aplicação web.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*vwOg3BBi30FhZRSjaU8Zxw.png" alt="">
      <figcaption></figcaption>
    </figure>

wordpress

Encontramos um diretório “wordpress”, o próximo passo e usar o “wpscan” para verificar se existe alguma vulnerabilidade.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*7txpTdjqgQ5-cvKJOD9Wmw.png" alt="">
      <figcaption></figcaption>
    </figure>

Encontramos uma vulnerabilidade de LFI no wordpress, antes de de explorar a falha no wordpress vamos montar o NFS na nossa máquina.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*u5DoFkWGTYkjElBfUSzcig.png" alt="">
      <figcaption></figcaption>
    </figure>

Depois de montar o diretório vamos verificar se existe algum arquivo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/1200/1*X8yOucd3YWrYDjUkZEGvVw.png" alt="">
      <figcaption></figcaption>
    </figure>

Como não há nenhum arquivo no diretório, vamos criar um arquivo em php para executarmos alguns comandos.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/1200/1*sjDc5Q0arpJXiZuWBb7-jg.png" alt="">
      <figcaption></figcaption>
    </figure>

shell.php

Agora vamos explorar a falha LFI, para testar nosso arquivo php vamos enviar um comando “ls”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*ITMYYrtp0cooUh9dVAnfRw.png" alt="">
      <figcaption></figcaption>
    </figure>

O comando foi executado perfeitamente, agora vamos ler as configurações do NFS que esta localizada no “/etc/exports”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*H6u6HT1gcJpJXUMBAgAUIA.png" alt="">
      <figcaption></figcaption>
    </figure>

Tem uma configuração interessante, se no momento que eu montar o diretório na minha máquina meu ip for “10.10.10.100” eu vou conseguir criar e modificar arquivos como “root” pois o parâmetro “no\_root\_squash” esta ativo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*fxp_pRA4MD48wOFbP-qluA.png" alt="">
      <figcaption></figcaption>
    </figure>

Só para validar eu criei um arquivo “texte.txt” para verificar se realmente ele era criado como usuário, e grupo “root”.   
Logo depois criei um arquivo “shell.c” o código esta logo abaixo, tem outras formas de fazer isso mas eu já tinha este código na minha maquina para estudo e decidi usa-lo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*rm4Vq23MB_ZXQENW2oj1XA.png" alt="">
      <figcaption></figcaption>
    </figure>

shell.c

Depois de criar e compilar o arquivo, adicionei uma permissão especial, para que qualquer usuário que executar o arquivo tenha o mesmo privilégio do dono do arquivo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*oHhjqu-GPOOh-l_tc0pymg.png" alt="">
      <figcaption></figcaption>
    </figure>

Resolvi executar uma Shell reversa para te acesso ao servidor.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*bTpmhPPnYlVvPidfKroZTQ.png" alt="">
      <figcaption></figcaption>
    </figure>

shell reverso.

Depois de ter acesso ao servidor é só executar o arquivo “shell” que foi compilado antes, e ganhamos acesso com usuário “root”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*Ybqx3OtgZrJJT_MUrK-lCg.png" alt="">
      <figcaption></figcaption>
    </figure>

Agora é só manter o acesso.

Até a próxima 