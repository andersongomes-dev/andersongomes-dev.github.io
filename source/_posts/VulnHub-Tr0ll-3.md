---
title: 'VulnHub Tr0ll: 3'
date: 2019-08-10 16:30:58
tags:
cover: https://cdn-images-1.medium.com/max/800/1*nw1NlT8J4dpZuTwD2bYh5Q.png
cover_creditos: 
default_cover:
excerpt: "Desafio CTF <strong><a href='https://www.vulnhub.com/entry/tr0ll-3,340/'>VulnHub Tr0ll: 3</a></strong> Realizado para aprendizado sobre conceitos de segurança da informação."
---

> Alvo: **Tr0ll: 3 _(Linux)_**  
> Atacante: **_parrot_** _4.19_

### Informações sobre o Alvo.

Ao iniciar a maquina alvo já temos um usuário e senha “start:here” para começar.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*ig8GTuPcF7dWygjDqq0dvw.png" alt="Primeiro usuário.">
  <figcaption>Primeiro usuário.</figcaption>
</figure>

Primeiro usuário.

### Reconhecimento / Enumeração.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*W_SPImwuB-SE-N4rkAXa8g.png" alt="netdiscover">
  <figcaption>netdiscover</figcaption>
</figure>


O ip do alvo é 192.168.1.10

Usando “nmap” para lista portas e serviços e verificar se há alguma vulnerabilidade.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*nw1NlT8J4dpZuTwD2bYh5Q.png" alt="nmap">
  <figcaption>nmap</figcaption>
</figure>



Só temos o “ssh” rodando na porta 22, a única opção e utilizar o usuário e senha que temos.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*oMMyeZGl0JIXw46FnYjJnw.png" alt="Dados do usuário start.">
  <figcaption>Dados do usuário start.</figcaption>
</figure>


Há duas pasta “**bluepill”** e “**redpill”** cada uma possui um arquivo, um arquivo nos da um _link_ não há absolutamente nada de interessante nele, o outro arquivo nos da um possível usuário e senha.

Testando o “step2” não temos acesso a nada ou a senha esta errada.

Não custa nada tentar procurar arquivos com permissão de leitura escrita e execução.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*4-J9ApRFZ8d0SdFwbxp-rw.png" alt="Arquivos com permissão total.">
  <figcaption>Arquivos com permissão total.</figcaption>
</figure>


Verifiquei no wireshark o arquivo “wytshadow.cap” a procura de algo interessante, mas só há capturas de pacotes de uma rede wifi.  
Verificando o arquivo “gold\_star.txt” ele parece muito com uma wordlist.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*iZd9S3rh9_CBuS3go0pwFw.png" alt="gold_star.txt">
  <figcaption>gold_star.txt</figcaption>
</figure>

Juntando tudo “wytshadow.cap” + “gold\_star.txt” = “aircrack-ng”.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*Xqk50w1DMm1prH1mkQs-DQ.png" alt="aircrack-ng">
  <figcaption>aircrack-ng</figcaption>
</figure>



Será que é apenas uma senha da wifi? Vamos ver no “/etc/passwd” se existe algum usuário com o nome “wytshadow”.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*dKxRuNLYq8FIoTBvoXpMOQ.png" alt="/etc/passwd">
  <figcaption>/etc/passwd</figcaption>
</figure>

Existe um usuário “wytshadow”.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*BE2CV3CrpT6aqaxtm0xM7g.png" alt="wytshadow">
  <figcaption>wytshadow</figcaption>
</figure>



Existe um arquivo com permissão especial “oohfun”, mas ele não vai nos levar a nada, pois o dono do arquivo é “genphlux” e não o “root”.  
Vamos verificar podemos rodar algum comando com “sudo”.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*JcZTZNeekaN2BILj01VCJw.png" alt="">
  <figcaption></figcaption>
</figure>

Vamos rodar “sudo /usr/sbin/service nginx start”.  
Descobrindo a porta do nginx.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*8trrBvN9meZD7SVoTqXM_g.png" alt="configuração do nginx.">
  <figcaption>configuração do nginx.</figcaption>
</figure>



A porta que o serviço esta rodando é a 8080, outra coisa interessante é que deve ser enviado um “User-Agent” especifico.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*wmLqFCPX9MZWzbWhMvxfYA.png" alt="genphlux">
  <figcaption>genphlux</figcaption>2024-01-04
</figure>

Conseguimos mais um usuário “genphlux” e senha.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*k5plpQHgLNNfShbQDSkalw.png" alt="">
  <figcaption></figcaption>
</figure>

Novamente vamos verificar no “/etc/passwd” se existe um usuário maleus.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*OS0tUrY3U8wN7g6LM85c4g.png" alt="maleus">
  <figcaption>maleus</figcaption>
</figure>



Listando arquivo do usuário “maleus”.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*CkXyvMGfH3WhZQjGQnNNfQ.png" alt="">
  <figcaption></figcaption>
</figure>

para verifica quais comandos podemos executar com “sudo”, precisamos da senha.  
A senha estava dentro do arquivo “.viminfo”.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*cBigw6VBAKGne0Q2DIwcMg.png" alt="senha do usuário maleus.">
  <figcaption>senha do usuário maleus.</figcaption>
</figure>



Podemos executar o “dont\_even\_bother” com “sudo”.  
Analise do “dont\_even\_bother”.

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*W8vNfzaOf5NyfXa7cySVtg.png" alt="gdb">
  <figcaption>gdb</figcaption>
</figure>


O “dont\_even\_bother” tem proteção ativa o que demanda muito tempo para e explorar.  
Por que explorar? se eu posso gerar um novo “dont\_even\_bother” para ele fazer o que eu quero.


<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*bby4zMfWu6x5Pb1d5MXwnQ.png" alt="dont_even_bother.c">
  <figcaption>dont_even_bother.c</figcaption>
</figure>

### Escalação de Privilégios

<figure class="image">
  <img src="https://cdn-images-1.medium.com/max/800/1*wrZ51NuLfJQ_hH9VqwQnbg.png" alt="Ganhando o root.">
  <figcaption>Ganhando o root.</figcaption>
</figure>



Até a próxima.