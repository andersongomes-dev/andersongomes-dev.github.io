---
title: 'VulnHub dpwwn: 1'
excerpt: "Desafio CTF <strong><a href=''>VulnHub dpwwn: 1</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
date: 2019-08-30 17:08:42
tags:
cover: https://cdn-images-1.medium.com/max/800/1*jg2OQiueNIrgWfFH7l4dCw.png
cover_creditos:
default_cover:
---

Hello friends.

> Alvo: **dpwwn: 1 _(Linux)_**  
> Atacante: **_parrot_** _4.19_

### Informações sobre o Alvo.

A flag esta em /root/dpwwn-01-FLAG.txt .

### Reconhecimento / Enumeração.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*jg2OQiueNIrgWfFH7l4dCw.png" alt="">
      <figcaption></figcaption>
    </figure>

netdiscover.

O ip do alvo é o 192.168.1.8

Usando “nmap” para lista portas e serviços e verificar se há alguma vulnerabilidade.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*Uim4_nm6E7vctEA_YahyYw.png" alt="">
      <figcaption></figcaption>
    </figure>

sqlmap.

Há três serviços rodando no alvo, e dois deles parece interessante, o http e o MySQL.

**Analisando o serviço de HTTP.**

A página “info.php” contem bastante informação interessante como versão do php, apache, versão do SO, etc.

**Analisando o serviço de MySQL.**

A primeira coisa que fiz foi tentar logar com usuário “root” sem senha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*zTgz5LDn8B0-M2S_yAZDpw.png" alt="">
      <figcaption></figcaption>
    </figure>

MySQL sem senha configurada.

Conseguimos um usuário e senha para acessar o ssh.

**Escalando privilégios.**

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*aC61Y645Hi1fXWZ-sPfgbw.png" alt="">
      <figcaption></figcaption>
    </figure>

Depois de acessar o Shell da maquina encontro um arquivo chamado “**logrot.sh”**, olhei o conteúdo do arquivo ele não executa nada de útil para nos, resolvi verificar se ele estava em execução, o arquivo é executado a cada 3 minutos com “**root”**.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*pqg8h-6CJqLdrUITMH9dWg.png" alt="">
      <figcaption></figcaption>
    </figure>

Copiando o sudoers

Fiz uma pequena alteração no script para copiar o sudoers para a pasta “/tmp”, e logo depois adicionar algumas permissões para poder editar o arquivo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*cusul-IqbMM4n3nDrUjRhA.png" alt="">
      <figcaption></figcaption>
    </figure>

Depois de 3 minutos o arquivo estava na pasta “/tmp”, Editei o arquivo “logrot.sh” e comentei a linha que copiava o arquivo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*P1qI2AW25JAXjsfBTObQHQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Adicionei o nome do usuário no arquivo e com permissões igual a do “root”.  
Se observar logo acima do “root” esta escrito “permitir que o root execute qualquer comando em qualquer lugar” já que ele pode o “mistic” também poderá.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*orOBUqQMtLTBDZHiK-yZyw.png" alt="">
      <figcaption></figcaption>
    </figure>

Vamos editar o arquivo “logrot.sh” novamente e colocar o conteúdo do “/tmp/sudoers” no “/etc/sudoers”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*xSaVtMBQXZyZRhpbiDXujg.png" alt="">
      <figcaption></figcaption>
    </figure>

Depois de alguns minutos nos tornamos “root”.

Até a próxima